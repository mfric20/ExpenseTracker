export const dynamic = "force-dynamic";

import { v4 as uuidv4 } from "uuid";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "~/server/db";
import { expenseProfile, user } from "~/server/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "~/app/api/auth/[...nextauth]/route";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        const usersResponse = await db
            .select()
            .from(user)
            .where(eq(user.email, session?.user.email as string));
        const userRes = usersResponse[0];

        if (userRes) {
            const exponseProfilesResponse = await db
                .select()
                .from(expenseProfile)
                .where(eq(expenseProfile.userId, userRes?.id)).orderBy(
                    desc(expenseProfile.favorite), asc(expenseProfile.name));

            return new Response(
                JSON.stringify({ expenseProfiles: exponseProfilesResponse }),
            );
        }
    } catch (error) {
        console.log("Error on GET /expenseProfiles", error);
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        const values: {
            name: string;
            color: string;
            budget: number;
        } = await req.json();

        const usersResponse = await db
            .select()
            .from(user)
            .where(eq(user.email, session?.user.email as string));
        const userRes = usersResponse[0];

        const expenseProfileId = uuidv4();

        if (userRes) {
            const exponseProfilesResponse = await db
                .insert(expenseProfile)
                .values({
                    id: expenseProfileId,
                    userId: userRes.id,
                    color: values.color,
                    budget: values.budget,
                    name: values.name,
                    favorite: false,
                }).returning();

            if(exponseProfilesResponse.length == 0) {
                return new Response(
                    JSON.stringify({ error: "Error creating expense profile" }),
                    { status: 500 },
                );
            }

            return new Response(JSON.stringify({ success: "True" }));
        }
    } catch (error) {
        console.log("Error on GET /expenseProfiles", error);
    }
}

export async function DELETE(req: Request) {
    try {
        const url = new URL(req.url);

        const expenseProfileId = url.searchParams.get("expenseProfileId");

        const exponseProfilesResponse = await db
            .delete(expenseProfile)
            .where(eq(expenseProfile.id, expenseProfileId ?? "")).returning();

        if (exponseProfilesResponse.length == 0) {
            return new Response(
                JSON.stringify({ error: "Error deleting expense profile" }),
                { status: 500 },
            );
        }

        return new Response(JSON.stringify({ status: "successful" }));
    } catch (error) {
        console.log("Error on DELETE /expenseProfiles", error);
    }
}

export async function PUT(req: Request) {
    try {
        const url = new URL(req.url);

        const expenseProfileId = url.searchParams.get("expenseProfileId");

        const values: {
            name: string;
            color: string;
            budget: number;
        } = await req.json();

        const exponseProfilesResponse = await db
            .update(expenseProfile)
            .set({
                name: values.name,
                color: values.color,
                budget: values.budget,
            })
            .where(eq(expenseProfile.id, expenseProfileId ?? ""))
            .returning();

        if (exponseProfilesResponse.length == 0) {
            return new Response(
                JSON.stringify({ error: "Error updating expense profile" }),
                { status: 500 },
            );
        }

        return new Response(JSON.stringify({ status: "successful" }));
    } catch (error) {
        console.log("Error on PUT /expenseProfiles", error);
    }
}
