import { z } from "zod";

export const chatMessage = z.object({
    actor: z.enum(["bot", "user"]),
    message: z.string(),
    error: z.boolean(),
    timestamp: z.date(),
});

export type ChatMessage = z.infer<typeof chatMessage>;
