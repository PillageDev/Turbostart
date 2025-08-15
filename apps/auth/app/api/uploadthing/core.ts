// app/api/uploadthing/avatarFileRouter.ts

import { db, eq, user, userAvatarStorage } from "@repo/db";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";

const f = createUploadthing();

export const avatarFileRouter = {
  avatar: f({ image: { maxFileSize: "4MB" } })
    .input(z.object({ userId: z.string() }))
    .middleware(async ({ input }) => {
      return { userId: input.userId };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      const userId = metadata.userId;

      try {
        // insert to the avatar storage
        await db.insert(userAvatarStorage).values({
          userId: userId,
          url: file.ufsUrl,
          createdAt: new Date(),
        });

        // update the user's avatar
        await db
          .update(user)
          .set({ image: file.ufsUrl })
          .where(eq(user.id, userId));

        return {
          ufsUrl: file.ufsUrl,
          userId: userId,
        };
      } catch (error) {
        console.error("Database insertion failed:", error);

        return {
          ufsUrl: file.ufsUrl,
          userId: userId,
        };
      }
    }),
} satisfies FileRouter;

export type AvatarFileRouter = typeof avatarFileRouter;
