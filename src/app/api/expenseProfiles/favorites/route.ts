import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { expenseProfiles } from "~/server/db/schema";

export async function PUT(req: Request) {
    try {
        const url = new URL(req.url);

        const expenseProfileId = url.searchParams.get("expenseProfileId");

        const expenseProfileResponse = await db
            .select()
            .from(expenseProfiles)
            .where(eq(expenseProfiles.id, expenseProfileId ?? ""));
        const expenseProfile = expenseProfileResponse[0];

        if (expenseProfile) {
            const expenseProfilesResponse = await db
                .update(expenseProfiles)
                .set({ favorite: !expenseProfile?.favorite })
                .where(eq(expenseProfiles.id, expenseProfileId ?? ""));

            return new Response(JSON.stringify({ status: "successful" }));
        }
    } catch (error) {
        console.log("Error on PUT /expenseProfiles/favorites", error);
    }
}
