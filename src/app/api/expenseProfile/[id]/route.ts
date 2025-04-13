export const dynamic = "force-dynamic";

import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "~/server/db";
import { expense, expenseProfile, expenseType, user } from "~/server/db/schema";
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

                const expenses = await db
    .select({
        id: expense.id,
        name: expense.name,
        amount: expense.amount,
        createdAt: expense.createdAt,
        typeName: expenseType.name,
        type: expense.type,
    })
    .from(expense)
    .leftJoin(expenseType, eq(expense.type, expenseType.id))
    .where(
        and(
            eq(expense.expenseProfileId, params.id),
            sql`EXTRACT(MONTH FROM ${expense.createdAt}) = EXTRACT(MONTH FROM CURRENT_DATE)`,
            sql`EXTRACT(YEAR FROM ${expense.createdAt}) = EXTRACT(YEAR FROM CURRENT_DATE)`
        )
    )
    .orderBy(desc(expense.createdAt));

            return new Response(
                JSON.stringify({ expenseProfile: expenseProfileResponse[0], expenses }),
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

export async function PUT(req: Request, { params }: RouteContext) {
    try {
        const { id } = params;
        const { name, amount, type } = await req.json();

        await db
            .update(expense)
            .set({
                name,
                amount,
                type,
            })
            .where(eq(expense.id, id));

        return new Response(
            JSON.stringify({ success: true }),
            { status: 200 }
        );
    } catch (error) {
        console.log(`Error on PUT /expense/id`, error);
        return new Response(
            JSON.stringify({ error }),
            { status: 500 }
        );
    }
}
