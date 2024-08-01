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

        console.log("User: ", user);
        // Add logic here to look up the user from the credentials supplied

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          throw new Error("invalidCredentials");
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
      console.log("SignInInfo: ", signInInfo);
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
        return true;
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
