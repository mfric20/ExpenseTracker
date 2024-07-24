import {
  serial,
  pgTableCreator,
  uuid,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `ExpenseTracker_${name}`);

export const users = createTable("users", {
  id: uuid("id").primaryKey(),
  userName: varchar("name", { length: 256 }),
  email: varchar("email", { length: 256 }).unique(),
  emailVerified: boolean("emailVerified"),
  provider: varchar("provider", { length: 256 }),
  password: varchar("password", { length: 256 }),
  picture: varchar("picture"),
});
