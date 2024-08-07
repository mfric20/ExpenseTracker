import { eq } from "drizzle-orm";
import { sendEmail } from "~/lib/mailer";
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

export async function PUT(req: Request) {
  const body = await req.json();
  const email = body?.email;

  const verificationCode =
    Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  try {
    const query: { userId: string }[] = await db
      .update(users)
      .set({ verificationCode: verificationCode })
      .where(eq(users.email, email))
      .returning({ userId: users.id });

    const userId = query[0]?.userId;

    await sendEmail(
      email,
      "ExpenseTracker - Verification code",
      `<p>Welcome to ExpenseTracker, your verification code is <h1>${verificationCode}</h1></p>`,
    );

    return new Response(JSON.stringify({ userId }));
  } catch (error) {
    return new Response(JSON.stringify({ error: "Something went wrong!" }), {
      status: 400,
      statusText: "Something went wrong!",
    });
  }
}
