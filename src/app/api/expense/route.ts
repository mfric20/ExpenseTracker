import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { expense } from "~/server/db/schema";
import { v4 as uuidv4 } from "uuid";
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

export async function POST(req: Request) {
    try {
        const { name, amount, type, expenseProfileId } = await req.json();
        
        const expenseId = uuidv4();
        
        const newExpense = await db
            .insert(expense)
            .values({
                id: expenseId,
                name,
                amount: Number(amount),
                type,
                expenseProfileId,
                createdAt: new Date().toISOString(),
            })
            .returning();

        return new Response(
            JSON.stringify({ 
                success: true,
                expense: newExpense[0]
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error(`Error on POST /api/expense`, error);
        return new Response(
            JSON.stringify({ error: String(error) }),
            { status: 500 }
        );
    }
}
