import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { expenseProfiles, users } from "~/server/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "~/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        const usersResponse = await db
            .select()
            .from(users)
            .where(eq(users.email, session?.user.email as string));
        const user = usersResponse[0];

        if (user) {
            const exponseProfilesResponse = await db
                .select()
                .from(expenseProfiles)
                .where(eq(expenseProfiles.userId, user?.id));

            return new Response(
                JSON.stringify({ expenseProfiles: exponseProfilesResponse }),
            );
        }
    } catch (error) {
        console.log("Error on GET /expenseProfiles", error);
    }
}
