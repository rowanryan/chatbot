import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const chatRouter = createTRPCRouter({
    sendMessage: publicProcedure
        .input(
            z.object({
                message: z.string(),
            })
        )
        .mutation(({ input }) => {}),
});
