import { z } from "zod";

export const chatMessage = z.object({
    actor: z.enum(["bot", "user"]),
    message: z.string(),
    timestamp: z.date(),
});

export type ChatMessage = z.infer<typeof chatMessage>;
