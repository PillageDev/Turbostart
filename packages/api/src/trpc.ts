import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "./context";
import superjson from "superjson";
import z, { ZodError } from "zod";

// create the trpc server
const t = initTRPC.context<Context>().create({
  transformer: superjson, // use superjson to support complex types
  errorFormatter: ({ shape, error }) => ({
    // custom error formatter to support zod errors
    ...shape,
    data: {
      ...shape.data,
      zodError:
        error.cause instanceof ZodError ? z.treeifyError(error.cause) : null,
    },
  }),
});

// making server side calls from loaders
export const createCallerFactory = t.createCallerFactory;

// creating routers
export const router = t.router;

// Procedures

// Public procedure has no auth
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user?.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});
