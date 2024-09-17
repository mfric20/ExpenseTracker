import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import bcrypt from "bcrypt";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);

        const userEmail = url.searchParams.get("userEmail");

        const userInfo = await db
            .select()
            .from(users)
            .where(eq(users.email, userEmail as string));

        return new Response(JSON.stringify({ userInfo: userInfo[0] }));
    } catch (error) {
        console.log("Error on GET /user", error);
    }
}

export async function PUT(req: Request) {
    try {
        const url = new URL(req.url);

        const userEmail = url.searchParams.get("userEmail");
        const newUsername = url.searchParams.get("newUsername");

        const updateResult = await db
            .update(users)
            .set({ name: newUsername })
            .where(eq(users.email, userEmail as string));

        if (updateResult.rowCount && updateResult?.rowCount > 0)
            return new Response(JSON.stringify({ status: "success" }));

        return new Response(JSON.stringify({ status: "failed" }));
    } catch (error) {
        console.log("Error on PUT /user", error);
    }
}

export async function POST(req: Request) {
    try {
        const url = new URL(req.url);
        const userEmail = url.searchParams.get("userEmail");

        const values: {
            currentPassword: string;
            newPassword: string;
            confirmPassword: string;
        } = await req.json();

        const selectResult = await db
            .select()
            .from(users)
            .where(eq(users.email, userEmail as string));

        const userInfo = selectResult[0];

        const passwordMatch = await bcrypt.compare(
            values.currentPassword,
            userInfo?.password ?? "",
        );

        if (passwordMatch && values.newPassword == values.confirmPassword) {
            const hashPassword = await bcrypt.hash(values.newPassword, 10);

            const updateResult = await db
                .update(users)
                .set({ password: hashPassword })
                .where(eq(users.email, userEmail as string));

            if (updateResult.rowCount && updateResult?.rowCount > 0)
                return new Response(JSON.stringify({ status: "success" }));
        } else {
            return new Response(JSON.stringify({ error: "Wrong password!" }), {
                status: 403,
                statusText: "Wrong password!",
            });
        }
    } catch (error) {
        console.log("Error on POST /user", error);
    }

    return new Response(JSON.stringify({ error: "Something went wrong!" }), {
        status: 500,
    });
}
