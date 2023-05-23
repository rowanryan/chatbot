import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { desc } from "drizzle-orm";
import { textEntry } from "@/server/schemas";
import { contentEntries } from "@/db/schema";
import { TRPCError } from "@trpc/server";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PineconeClient } from "@pinecone-database/pinecone";
import { env } from "@/env.mjs";

export const contentRouter = createTRPCRouter({
    getHistory: protectedProcedure.query(async ({ ctx }) => {
        const entries = await ctx.db
            .select({
                content: contentEntries.content,
                createdAt: contentEntries.createdAt,
            })
            .from(contentEntries)
            .orderBy(desc(contentEntries.createdAt));

        return entries;
    }),

    addRawText: protectedProcedure
        .input(textEntry)
        .mutation(async ({ ctx, input }) => {
            const pineconeClient = new PineconeClient();

            await pineconeClient.init({
                apiKey: env.PINECONE_API_KEY,
                environment: env.PINECONE_ENVIRONMENT,
            });

            const pineconeIndex = pineconeClient.Index(env.PINECONE_INDEX);

            try {
                const splitter = new RecursiveCharacterTextSplitter({
                    chunkSize: 500,
                    chunkOverlap: 100,
                });

                const chunks = await splitter.splitText(input.text);

                const docs = chunks.map(
                    (chunk) =>
                        new Document({
                            pageContent: chunk,
                            metadata: { identifier: ctx.identifier },
                        })
                );

                await PineconeStore.fromDocuments(
                    docs,
                    new OpenAIEmbeddings(),
                    {
                        pineconeIndex,
                    }
                );
            } catch {
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
            }

            return await ctx.db.insert(contentEntries).values({
                user: ctx.userId,
                identifier: ctx.identifier,
                content: input.text,
            });
        }),
});
