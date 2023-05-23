import { z } from "zod";

export const chatMessage = z.object({
    actor: z.enum(["bot", "user"]),
    message: z.string(),
    error: z.boolean(),
    timestamp: z.date(),
});

export type ChatMessage = z.infer<typeof chatMessage>;

export const textEntry = z.object({
    text: z
        .string()
        .min(1, { message: "Cannot be empty." })
        .max(50000, { message: "Cannot have more than 50,000 characters." }),
});

export type TextEntry = z.infer<typeof textEntry>;
