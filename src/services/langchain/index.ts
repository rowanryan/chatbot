import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatMessage } from "@/server/schemas";
import { HumanChatMessage, AIChatMessage } from "langchain/schema";
import { AgentExecutor, ChatAgent } from "langchain/agents";
import { Calculator } from "langchain/tools/calculator";

export { initializeAgentExecutorWithOptions } from "langchain/agents";

export const llm = new ChatOpenAI();
const tools = [new Calculator()];

const agent = ChatAgent.fromLLMAndTools(new ChatOpenAI(), tools);
const executor = AgentExecutor.fromAgentAndTools({ agent, tools });

export const createChatHistory = (messages: ChatMessage[]) => {
    return messages.map((message) => {
        if (message.actor === "bot") {
            return new HumanChatMessage(message.message);
        }

        return new AIChatMessage(message.message);
    });
};
