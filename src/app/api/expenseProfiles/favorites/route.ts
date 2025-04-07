import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { expenseProfile } from "~/server/db/schema";

export async function PUT(req: Request) {
    try {
        const url = new URL(req.url);

        const expenseProfileId = url.searchParams.get("expenseProfileId");

        const expenseProfileResponse = await db
            .select()
            .from(expenseProfile)
            .where(eq(expenseProfile.id, expenseProfileId ?? ""));
        const expenseProfileRes = expenseProfileResponse[0];

        if (expenseProfileRes) {
            const expenseProfilesResponse = await db
                .update(expenseProfile)
                .set({ favorite: !expenseProfileRes?.favorite })
                .where(eq(expenseProfile.id, expenseProfileId ?? ""));

            return new Response(JSON.stringify({ status: "successful" }));
        }
    } catch (error) {
        console.log("Error on PUT /expenseProfiles/favorites", error);
    }
}
