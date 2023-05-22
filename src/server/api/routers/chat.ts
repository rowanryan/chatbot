import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { chatMessage } from "@/server/schemas";
import { TRPCError } from "@trpc/server";
import { createExecutor } from "@/services/langchain";
import openai, { type ChatCompletionRequestMessage } from "@/lib/openai";

export const chatRouter = createTRPCRouter({
    prompt: publicProcedure
        .input(
            z.object({
                messages: chatMessage.array(),
            })
        )
        .mutation(async ({ input }) => {
            try {
                const messages: ChatCompletionRequestMessage[] =
                    input.messages.map((message) => ({
                        role: message.actor === "bot" ? "assistant" : "user",
                        content: message.message,
                    }));

                const completion = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "Keep your responses under 50 words long.",
                        },
                        ...messages,
                    ],
                });

                return completion.data.choices[0]?.message?.content;
            } catch (error) {
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
            }
        }),
    promptLangchain: publicProcedure
        .input(
            z.object({
                messages: chatMessage.array(),
            })
        )
        .mutation(async ({ input }) => {
            try {
                const newMessage = input.messages.at(-1);
                const previousMessages = input.messages.slice(0, -1);

                const executor = await createExecutor(previousMessages);

                const result = await executor.call({
                    input: newMessage?.message,
                });

                return result.output as string;
            } catch (error) {
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
            }
        }),
});
