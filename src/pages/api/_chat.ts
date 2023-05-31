import type { NextApiRequest, NextApiResponse } from "next";
import { PineconeClient } from "@pinecone-database/pinecone";
import { env } from "@/env.mjs";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import type { ChatMessage } from "@/server/schemas";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { CallbackManager } from "langchain/callbacks";
import { VectorDBQAChain } from "langchain/chains";
import { ChainTool } from "langchain/tools";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case "POST": {
            const reqBody = req.body as {
                newMessage: ChatMessage;
                history: ChatMessage[];
                identifier: string;
            };

            const pineconeClient = new PineconeClient();

            await pineconeClient.init({
                apiKey: env.PINECONE_API_KEY,
                environment: env.PINECONE_ENVIRONMENT,
            });

            const pineconeIndex = pineconeClient.Index(env.PINECONE_INDEX);

            const vectorStore = await PineconeStore.fromExistingIndex(
                new OpenAIEmbeddings(),
                { pineconeIndex }
            );

            // const results = await vectorStore.similaritySearch(
            //     reqBody.newMessage.message,
            //     1,
            //     {
            //         identifier: reqBody.identifier,
            //     }
            // );

            const model = new ChatOpenAI({
                streaming: true,
            });

            const chain = VectorDBQAChain.fromLLM(model, vectorStore);

            const qaTool = new ChainTool({
                name: "knowledge-base",
                description:
                    "Knowledge base - useful for when you need to ask questions about the people, events or other concepts.",
                chain: chain,
            });

            const tools = [qaTool];

            const chatHistory = new ChatMessageHistory();
            for (const message of reqBody.history) {
                if (message.actor === "bot") {
                    await chatHistory.addAIChatMessage(message.message);
                }

                await chatHistory.addUserMessage(message.message);
            }

            const executor = await initializeAgentExecutorWithOptions(
                tools,
                model,
                {
                    agentType: "chat-conversational-react-description",
                    verbose: true,
                    memory: new BufferMemory({
                        chatHistory,
                    }),
                }
            );

            await executor.call(
                {
                    input: reqBody.newMessage.message,
                    chat_history: [],
                },
                CallbackManager.fromHandlers({
                    async handleLLMNewToken(token: string) {
                        res.write(token);
                    },
                })
            );

            // await chain.call(
            //     {
            //         question: reqBody.newMessage.message,
            //         chat_history: reqBody.history.map((message) => {
            //             if (message.actor === "bot")
            //                 return `AI: ${message.message}\n`;

            //             return `Human: ${message.message}\n`;
            //         }),
            //     },
            //     CallbackManager.fromHandlers({
            //         async handleLLMNewToken(token: string) {
            //             res.write(token);
            //         },
            //     })
            // );

            // if (results.length > 0) {
            //     const promptTemplate = PromptTemplate.fromTemplate(
            //         `
            //             You are an AI assistant. If you cannot answer the prompt from the user yourself, then answer the prompt from the user using the provided information that was fetched from an embedding or vector database. Keep in mind the context of the conversation. If the provided information does not match the prompt from the user or you cannot answer the prompt with confidence using the provided information, then ignore the provided information and pretend you never received it in the first place and also don't mention it. The user can never know that you have extra information from a database.

            //             Provided information:
            //             {information}

            //             Prompt from the user:
            //             {text}
            //             `
            //     );

            //     const prompt = await promptTemplate.format({
            //         information: results[0]?.pageContent,
            //         text: reqBody.newMessage.message,
            //     });

            //     await model.call([
            //         ...reqBody.history.map((message) => {
            //             if (message.actor === "bot")
            //                 return new AIChatMessage(message.message);

            //             return new HumanChatMessage(message.message);
            //         }),
            //         new HumanChatMessage(prompt),
            //     ]);
            // } else {
            //     await model.call([
            //         ...reqBody.history.map((message) => {
            //             if (message.actor === "bot")
            //                 return new AIChatMessage(message.message);

            //             return new HumanChatMessage(message.message);
            //         }),
            //         new HumanChatMessage(reqBody.newMessage.message),
            //     ]);
            // }

            return res.end();
        }
        default: {
            return res.status(405).send("Method not allowed.");
        }
    }
}
