import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

export async function GET(req: Request, res: Response) {
    const url = new URL(req.url);

    const userEmail = url.searchParams.get("userEmail");
    console.log(userEmail);

    const userInfo = await db
        .select()
        .from(users)
        .where(eq(users.email, userEmail as string));

    return new Response(JSON.stringify({ userInfo: userInfo[0] }));
}
