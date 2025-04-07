import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { expense } from "~/server/db/schema";

interface RouteContext {
    params: {
        id: string;
    };
}

export async function GET(req: Request, { params }: RouteContext) {
    try {
        const { id } = params;
        const url = new URL(req.url);
        const searchParams = url.searchParams;
        const limit = searchParams.get("limit") || "10";
        const offset = searchParams.get("offset") || "0";

        const expenseProfileResponse = await db
            .select()
            .from(expense)
            .where(eq(expense.expenseProfileId, id))
            .limit(parseInt(limit))
            .offset(parseInt(offset));

        return new Response(
            JSON.stringify({ expense: expenseProfileResponse }),
        );
    } catch (error) {
        console.log(`Error on GET /expense`, error);
        return new Response(
            JSON.stringify({ error }),
            { status: 500 }
        );
    }
}