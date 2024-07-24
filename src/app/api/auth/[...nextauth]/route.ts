import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { GoogleProfile } from "next-auth/providers/google";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { v4 as uuidv4 } from "uuid";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const user = { id: "1", name: "J Smith", email: "jsmith@example.com" };

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
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
            userName: googleProfile.name,
            password: "",
          });
        }

        console.log("user", user);
      }

      return true; // Do different verification for other providers that don't have `email_verified`
    },
  },
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
