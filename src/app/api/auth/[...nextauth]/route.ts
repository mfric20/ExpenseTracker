import { eq } from "drizzle-orm";
import NextAuth, { Awaitable } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { GoogleProfile } from "next-auth/providers/google";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { v4 as uuidv4 } from "uuid";
import { User } from "next-auth";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        const query = await db
          .select()
          .from(users)
          .where(eq(users.email, email) && eq(users.provider, "credentials"));

        const user = query[0];

        if (user?.emailVerified == false) throw new Error("emailNotVerified");

        const passwordMatch = await bcrypt.compare(
          password,
          user?.password || "",
        );

        if (passwordMatch) {
          return user as User;
        } else {
          throw new Error("invalidCredentials");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn(signInInfo: any) {
      if (signInInfo.account.provider === "google") {
        const googleProfile = signInInfo.profile as GoogleProfile;
        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, googleProfile.email));

        if (user.length === 0) {
          await db.insert(users).values({
            id: uuidv4(),
            email: googleProfile.email,
            emailVerified: googleProfile.email_verified,
            provider: "google",
            picture: googleProfile.picture,
            name: googleProfile.name,
            password: "",
          });

          return true;
        }

        throw new Error("emailError");
      } else if (signInInfo.account.provider === "credentials") {
      }
      return true;
    },
    async redirect(params: { url: String; baseUrl: String }): Promise<string> {
      if (params.url === "/signout") {
        return "/login";
      }
      return "/";
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
