import { createRouteHandler } from "uploadthing/next";
import { avatarFileRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: avatarFileRouter,
});
