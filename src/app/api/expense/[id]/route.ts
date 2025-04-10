import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { expense } from "~/server/db/schema";

interface RouteContext {
    params: {
        id: string;
    };
}

export async function PUT(req: Request, { params }: RouteContext) {
    try {
        const { id } = params;
        const { name, amount, type } = await req.json();

        const updatedExpense = await db
            .update(expense)
            .set({
                name,
                amount: Number(amount),
                type,
            })
            .where(eq(expense.id, id))
            .returning();

        if (!updatedExpense.length) {
            return new Response(
                JSON.stringify({ error: "Expense not found" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ 
                success: true,
                expense: updatedExpense[0]
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error(`Error on PUT /api/expense/${params.id}`, error);
        return new Response(
            JSON.stringify({ error: String(error) }),
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request, { params }: RouteContext) {
    try {
        const { id } = params;
        
        const deletedExpense = await db
            .delete(expense)
            .where(eq(expense.id, id))
            .returning();

        if (!deletedExpense.length) {
            return new Response(
                JSON.stringify({ error: "Expense not found" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ 
                success: true,
                expense: deletedExpense[0]
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error(`Error on DELETE /api/expense/${params.id}`, error);
        return new Response(
            JSON.stringify({ error: String(error) }),
            { status: 500 }
        );
    }
}