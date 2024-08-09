import { eq } from "drizzle-orm";
import { sendEmail } from "~/lib/mailer";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

export async function POST(req: Request) {
  const values = await req.json();

  const query = await db.select().from(users).where(eq(users.email, values.email as string));
  const user = query[0];

  const pageUrl = process.env.PAGE_URL;

  await sendEmail(
    values.email,
    "ExpenseTracker - Password reset",
    `<p>Reset your password <a href="${pageUrl}/${user?.id}/resetPassword">here</a></p>`,
  );

  return new Response(JSON.stringify({ success: true }));
}
