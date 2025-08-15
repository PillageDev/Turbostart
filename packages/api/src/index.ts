import { protectedProcedure, publicProcedure, router } from "./trpc";

const appRouter = router({
  hello: router({
    greeting: publicProcedure.query(() => {
      return "Hello from tRPC!";
    }),
    protected: protectedProcedure.query(() => {
      return "Protected";
    }),
  }),
});

export type AppRouter = typeof appRouter;

// This is to be used by the Nitro API server
export { appRouter };
