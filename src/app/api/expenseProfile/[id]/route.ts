export const dynamic = "force-dynamic";

import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "~/server/db";
import { expenseProfile, user } from "~/server/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "~/app/api/auth/[...nextauth]/route";

interface RouteContext {
    params: {
        id: string;
    };
}

export async function GET(req:Request, { params }: RouteContext) {
    try {
        const session = await getServerSession(authOptions);

        const usersResponse = await db
            .select()
            .from(user)
            .where(eq(user.email, session?.user.email as string));
        const userRes = usersResponse[0];

        if(!userRes){
            return new Response(
                JSON.stringify({ error: "User not found" }),
                { status: 404 }
            );
        }

        console.log(`ExpenseProfile id: ${params.id}`);
        if (user) {
            const expenseProfileResponse = await db
                .select()
                .from(expenseProfile)
                .where(eq(expenseProfile.id, params.id));

            return new Response(
                JSON.stringify({ expenseProfile: expenseProfileResponse[0] }),
            );
        }
    } catch (error) {
        console.log(`Error on GET /expenseProfile/id`, error);
        return new Response(
            JSON.stringify({ error }),
            { status: 500 }
        );
    }
}
