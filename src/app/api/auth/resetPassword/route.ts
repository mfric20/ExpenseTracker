import { eq } from "drizzle-orm";
import { sendEmail } from "~/lib/mailer";
import { db } from "~/server/db";
import { user } from "~/server/db/schema";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const values: { email: string } = await req.json();

  const query = await db.select().from(user).where(eq(user.email, values.email as string));
  const userRes = query[0];

  const pageUrl = process.env.PAGE_URL;

  if (!userRes) {
    return new Response(JSON.stringify({ error: "No user with that email!" }), { status: 403 })
  }

  await sendEmail(
    values.email,
    "ExpenseTracker - Password reset",
    `<p>Reset your password <a href="${pageUrl}/${userRes?.id}/resetPassword">here</a></p>`,
  );

  return new Response(JSON.stringify({ success: true }));
}

export async function PUT(req: Request) {
  const values: { userId: string, password: string } = await req.json();

  const hashPassword = await bcrypt.hash(values.password, 10);
  await db.update(user).set({ password: hashPassword }).where(eq(user.id, values?.userId));

  return new Response(JSON.stringify({ success: true }));
}
