import { expense, expenseProfile, user } from "~/server/db/schema";

export type TError = {
    code: string;
    message: string;
    response: {
        status: Number;
        statusText: string;
    };
};

export type credentialsProfile = {
    email: string;
    password: string;
};

export type Tuser = typeof user.$inferSelect;
export type TExpenseProfile = typeof expenseProfile.$inferSelect;
export type Texpense = typeof expense.$inferSelect;
