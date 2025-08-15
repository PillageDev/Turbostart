"use server";

import { z } from "zod";
import { enhanceAction } from "@repo/next/enhanced-action";
import { auth } from "@repo/auth";
import { asUrl } from "@repo/config/paths.utils";
import { headers } from "next/headers";

export const sendMagicLink = enhanceAction(
  async ({ email, redirectUrl }) => {
    const callbackUrl = redirectUrl ?? asUrl("auth", "account");

    const data = await auth.api.signInMagicLink({
      body: {
        email,
        callbackURL: callbackUrl,
        errorCallbackURL: asUrl("auth", "authError"),
      },
      headers: await headers(),
    });

    return data;
  },
  {
    schema: z.object({
      email: z.string(),
      redirectUrl: z.string().nullable(),
    }),
    auth: false,
  },
);

export const githubOAuth = enhanceAction(
  async ({ redirectUrl }) => {
    const callbackUrl = redirectUrl ?? asUrl("auth", "account");

    const data = await auth.api.signInSocial({
      body: {
        provider: "github",
        errorCallbackURL: asUrl("auth", "authError"),
        callbackURL: callbackUrl,
      },
      headers: await headers(),
    });

    return data;
  },
  {
    schema: z.object({
      redirectUrl: z.string().nullable(),
    }),
    auth: false,
  },
);
