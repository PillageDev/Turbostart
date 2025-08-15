import { cors } from "nitro-cors";
import { createTRPCContext } from "@repo/api/context";
import { defineTRPCEventHandler } from "@falcondev-oss/nitro-trpc-event-handler";
import { appRouter } from "@repo/api";

export default eventHandler({
  handler: defineTRPCEventHandler({
    router: appRouter,
    createContext: async (req) => {
      await createTRPCContext({ headers: req.headers });
    },
  }),
  onRequest: [
    cors({
      origin: "*",
      methods: "*",
    }),
  ],
});
