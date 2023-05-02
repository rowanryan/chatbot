import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { chatMessage } from "@/server/schemas";
import { agent, createBufferMemory, tools } from "@/services/langchain";
import { AgentExecutor } from "langchain/agents";
import { TRPCError } from "@trpc/server";

export const chatRouter = createTRPCRouter({
    prompt: publicProcedure
        .input(
            z.object({
                messages: chatMessage.array(),
            })
        )
        .mutation(async ({ input }) => {
            try {
                const newMessage = input.messages.at(-1);
                const previousMessages = input.messages.slice(0, -1);

                const executor = AgentExecutor.fromAgentAndTools({
                    agent,
                    tools,
                    memory: await createBufferMemory(previousMessages),
                });

                const result = await executor.call({
                    input: newMessage?.message,
                });

                return result.output as string;
            } catch (error) {
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
            }
        }),
});
