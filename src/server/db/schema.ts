import {
    pgTableCreator,
    uuid,
    varchar,
    boolean,
    integer,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `ExpenseTracker_${name}`);

export const users = createTable("users", {
    id: uuid("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    email: varchar("email", { length: 256 }).unique(),
    emailVerified: boolean("emailVerified"),
    provider: varchar("provider", { length: 256 }),
    password: varchar("password", { length: 256 }),
    image: varchar("image"),
    verificationCode: integer("verificationCode"),
});
