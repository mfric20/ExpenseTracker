import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getServerSession } from "next-auth/next";
import { db } from "~/server/db";
import { authOptions } from "~/app/api/auth/[...nextauth]/route";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";

const f = createUploadthing();

export const ourFileRouter = {
    imageUploader: f({ image: { maxFileSize: "4MB" } })
        .middleware(async ({ req }) => {
            const session = await getServerSession(authOptions);
            if (!session?.user) throw new UploadThingError("Unauthorized");

            return { userEmail: session.user.email };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            await db
                .update(users)
                .set({ image: file.url })
                .where(eq(users.email, metadata.userEmail));

            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return { uploadedBy: metadata.userEmail };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
