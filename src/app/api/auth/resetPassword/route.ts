import { eq } from "drizzle-orm";
import { sendEmail } from "~/lib/mailer";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const values: { email: string } = await req.json();

  const query = await db.select().from(users).where(eq(users.email, values.email as string));
  const user = query[0];

  const pageUrl = process.env.PAGE_URL;

  if (!user) {
    return new Response(JSON.stringify({ error: "No user with that email!" }), { status: 403 })
  }

  await sendEmail(
    values.email,
    "ExpenseTracker - Password reset",
    `<p>Reset your password <a href="${pageUrl}/${user?.id}/resetPassword">here</a></p>`,
  );

  return new Response(JSON.stringify({ success: true }));
}

export async function PUT(req: Request) {
  const values: { userId: string, password: string } = await req.json();

  const hashPassword = await bcrypt.hash(values.password, 10);
  await db.update(users).set({ password: hashPassword }).where(eq(users.id, values?.userId));

  return new Response(JSON.stringify({ success: true }));
}
