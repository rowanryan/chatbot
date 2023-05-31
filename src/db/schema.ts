import {
    mysqlTable,
    serial,
    text,
    timestamp,
    varchar,
    int,
} from "drizzle-orm/mysql-core";

const createdAt = timestamp("created_at").defaultNow().notNull();

export const chatbots = mysqlTable("chatbots", {
    id: serial("id").primaryKey(),
    user: varchar("user_id", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    systemMessage: varchar("system_message", { length: 1000 }).notNull(),
    createdAt,
});

export const contentEntries = mysqlTable("content_entries", {
    id: serial("id").primaryKey(),
    chatbot: int("chatbot_id").notNull(),
    createdAt,
});

export const pineconeIndexes = mysqlTable("pinecone_indexes", {
    id: serial("id").primaryKey(),
    content: text("content").notNull(),
    createdAt,
});
