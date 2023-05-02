import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatMessage } from "@/server/schemas";
import { ChatConversationalAgent } from "langchain/agents";
import { Calculator } from "langchain/tools/calculator";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";

export { initializeAgentExecutorWithOptions } from "langchain/agents";

export const llm = new ChatOpenAI();
export const tools = [new Calculator()];

export const agent = ChatConversationalAgent.fromLLMAndTools(llm, tools);

export const createBufferMemory = async (messages: ChatMessage[]) => {
    const chatMessageHistory = new ChatMessageHistory();

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