import {
    mysqlTable,
    serial,
    text,
    timestamp,
    varchar,
} from "drizzle-orm/mysql-core";

export const contentEntries = mysqlTable("contentEntries", {
    id: serial("id").primaryKey(),
    user: varchar("user_id", { length: 255 }).notNull(),
    identifier: varchar("identifier", { length: 255 }).notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
