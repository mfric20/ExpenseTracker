export const dynamic = "force-dynamic";

import { db } from "~/server/db";
import { expenseType } from "~/server/db/schema";

export async function GET() {
    try {
        const expenseTypes = await db
            .select()
            .from(expenseType);

        return new Response(
            JSON.stringify({ expenseTypes }),
            { status: 200 }
        );
    } catch (error) {
        console.log(`Error on GET /expenseTypes`, error);
        return new Response(
            JSON.stringify({ error }),
            { status: 500 }
        );
    }
}