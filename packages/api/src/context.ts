import { auth } from "@repo/auth";
import { db } from "@repo/db";

/**
 * Create TRPC context with the session and db
 * @param opts the options
 * @returns the context
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth.api.getSession({
    headers: opts.headers,
  });

  return {
    session,
    db,
  };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
