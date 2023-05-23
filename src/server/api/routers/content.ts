import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { textEntry } from "@/server/schemas";
import { contentEntries } from "@/db/schema";

export const contentRouter = createTRPCRouter({
    addRawText: protectedProcedure
        .input(textEntry)
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.insert(contentEntries).values({
                user: ctx.userId,
                identifier: ctx.identifier,
                content: input.text,
            });
        }),
});
