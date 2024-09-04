import { and, eq } from "drizzle-orm";
import NextAuth, { Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { GoogleProfile } from "next-auth/providers/google";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { JWT } from "next-auth/jwt";

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
                    .where(
                        and(
                            eq(users.email, email),
                            eq(users.provider, "credentials"),
                        ),
                    );

                if (query.length < 1) throw new Error("invalidCredentials");

                const user = query[0];

                if (user?.emailVerified == false)
                    throw new Error(`emailNotVerified&email=${user?.email}`);

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
                const query = await db
                    .select()
                    .from(users)
                    .where(eq(users.email, googleProfile.email));

                if (query.length === 0) {
                    await db.insert(users).values({
                        id: uuidv4(),
                        email: googleProfile.email,
                        emailVerified: googleProfile.email_verified,
                        provider: "google",
                        image: googleProfile.picture,
                        name: googleProfile.name,
                        password: "",
                    });
                }

                if (query.length > 0) {
                    const user = query[0];
                    if (user?.provider != "google")
                        throw new Error("emailError");
                }
                return true;
            } else if (signInInfo.account.provider === "credentials") {
            }
            return true;
        },
        async redirect(params: {
            url: String;
            baseUrl: String;
        }): Promise<string> {
            if (params.url === "/signout") {
                return "/login";
            }
            return "/dashboard";
        },
        async jwt({ token, user }: { token: JWT; user: User }) {
            if (user) {
                token.picture = user.image;
                token.provider = user.provider ?? "google";
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            if (session.user) {
                session.user.provider = token.provider;
            }
            return session;
        },
    },

    pages: {
        signIn: "/login",
        error: "/login",
    },
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
