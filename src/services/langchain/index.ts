import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatMessage } from "@/server/schemas";
import { AgentExecutor, ChatConversationalAgent } from "langchain/agents";
import { SerpAPI } from "langchain/tools";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";

export { initializeAgentExecutorWithOptions } from "langchain/agents";

export const llm = new ChatOpenAI();
export const tools = [new SerpAPI()];

export const agent = ChatConversationalAgent.fromLLMAndTools(llm, tools);

export const createExecutor = async (previousMessages: ChatMessage[]) => {
    const executor = AgentExecutor.fromAgentAndTools({
        agent,
        tools,
        memory: await createBufferMemory(previousMessages),
    });

    return executor;
};

export const createBufferMemory = async (messages: ChatMessage[]) => {
    const chatMessageHistory = new ChatMessageHistory();
    messages = messages.filter((message) => !message.error);

    for (const message of messages) {
        if (message.actor === "bot") {
            await chatMessageHistory.addAIChatMessage(message.message);
        } else {
            await chatMessageHistory.addUserMessage(message.message);
        }
    }

    return new BufferMemory({
        chatHistory: chatMessageHistory,
        returnMessages: true,
        memoryKey: "chat_history",
    });
};
