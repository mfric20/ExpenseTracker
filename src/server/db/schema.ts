import {
    pgTableCreator,
    uuid,
    varchar,
    boolean,
    integer,
    date,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `ExpenseTracker_${name}`);

export const user = createTable("user", {
    id: uuid("id").primaryKey().unique(),
    name: varchar("name", { length: 256 }),
    email: varchar("email", { length: 256 }).unique(),
    emailVerified: boolean("emailVerified"),
    provider: varchar("provider", { length: 256 }),
    password: varchar("password", { length: 256 }),
    image: varchar("image"),
    verificationCode: integer("verificationCode"),
});

export const expenseProfile = createTable("expsenseProfile", {
    id: uuid("id").primaryKey().unique(),
    name: varchar("name", { length: 256 }),
    createdAt: date("createdAt").defaultNow(),
    budget: integer("budget"),
    color: varchar("color"),
    favorite: boolean("favorite"),
    userId: uuid("userId")
        .references(() => user.id, { onDelete: "cascade" })
        .notNull(),
});

export const expense = createTable("expense", {
    id: uuid("id").primaryKey().unique(),
    name: varchar("name", { length: 256 }),
    description: varchar("description", { length: 256 }),
    type: varchar("type", { length: 256 }),
    createdAt: date("createdAt").defaultNow(),
    amount: integer("amount"),
    expenseProfileId: uuid("expenseProfileId")
        .references(() => expenseProfile.id, { onDelete: "cascade" })
        .notNull(),
});

export const expenseType = createTable("expenseType", {
    id: uuid("id").primaryKey().unique(),
    name: varchar("name", { length: 256 }),
    expenseId: uuid("expenseId")
        .references(() => expense.id, { onDelete: "cascade" })
        .notNull(),
});