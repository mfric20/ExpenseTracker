import { users } from "~/server/db/schema";

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

export type Tuser = typeof users.$inferSelect;
