"use server";

import { db, eq, user } from "@repo/db";
import { enhanceAction } from "@repo/next/enhanced-action";
import z from "zod";

export const updateUserNameAction = enhanceAction(
  async ({ name, id }) => {
    // update the user's name in the database
    await db.update(user).set({ name }).where(eq(user.id, id));
  },
  {
    schema: z.object({
      name: z.string().min(1, "Name is required"),
      id: z.string().min(1, "User id is required"),
    }),
  },
);
