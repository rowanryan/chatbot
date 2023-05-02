import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { chatMessage } from "@/server/schemas";
import { createChatHistory, llm } from "@/services/langchain";

export const chatRouter = createTRPCRouter({
    prompt: publicProcedure
        .input(
            z.object({
                messages: chatMessage.array(),
            })
        )
        .mutation(async ({ input }) => {
            const history = createChatHistory(input.messages);

            const result = await llm.call(history);

            return result.text;
        }),
});
