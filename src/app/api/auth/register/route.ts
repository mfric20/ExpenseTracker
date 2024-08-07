import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { sendEmail } from "~/lib/mailer";

export async function POST(req: Request) {
  const values = await req.json();

  //Check if user with email already exists
  const usersWithEmail = await db
    .select()
    .from(users)
    .where(eq(users.email, values.email));

  if (usersWithEmail.length > 0)
    return new Response(
      JSON.stringify({ error: "User with this email already exists!" }),
      { status: 403, statusText: "User with this email already exists!" },
    );

  const hashPassword = await bcrypt.hash(values.password, 10);

  const userId = uuidv4();
  const verificationCode =
    Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

  await db.insert(users).values({
    id: userId,
    email: values.email,
    emailVerified: false,
    name: values.name,
    password: hashPassword,
    picture:
      "https://utfs.io/f/1a65c421-0ed1-4510-a492-54e9257e451c-n1chqy.jpg",
    provider: "credentials",
    verificationCode: verificationCode,
  });

  await sendEmail(
    values.email,
    "ExpenseTracker - Verification code",
    `<p>Welcome to ExpenseTracker, your verification code is <h1>${verificationCode}</h1></p>`,
  );

  return new Response(JSON.stringify({ userId }));
}
