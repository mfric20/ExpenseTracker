import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

export async function POST(req: Request) {
  const { verificationCode, userId } = await req.json();

  const response = await db
    .select({ verificationCode: users.verificationCode })
    .from(users)
    .where(eq(users.id, userId));

  const databaseCode = response[0]?.verificationCode;

  if (databaseCode == verificationCode) {
    const query = await db.update(users).set({ emailVerified: true });
    return new Response(JSON.stringify({ status: "successful" }));
  }

  return new Response(JSON.stringify({ error: "Wrong verification code!" }), {
    status: 403,
    statusText: "Wrong verification code!",
  });
}
