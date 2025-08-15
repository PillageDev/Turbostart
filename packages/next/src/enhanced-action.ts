import "server-only";

import { redirect } from "next/navigation";

import { z } from "zod";

import { zodParseFactory } from "./utils";
import { auth } from "@repo/auth";
import { headers } from "next/headers";
import { asUrl } from "@repo/config/paths.utils";

// Derive the user type from the better auth session dynamically
type _Session = Awaited<ReturnType<typeof auth.api.getSession>>;
type AuthUser = _Session extends { user: infer U } ? U : unknown;

type AnyZodSchema = z.ZodType<any, any, any>;

type InferParams<
  C extends { schema?: AnyZodSchema },
  A,
> = C["schema"] extends AnyZodSchema ? z.infer<C["schema"]> : A;

/**
 * @name enhanceAction
 * @description Enhance an action with captcha, schema and auth checks
 */
export function enhanceAction<
  Args,
  Response,
  Config extends {
    auth?: boolean;
    captcha?: boolean;
    schema?: AnyZodSchema;
  },
>(
  fn: (
    params: InferParams<Config, Args>,
    user: Config["auth"] extends false ? undefined : AuthUser,
  ) => Response | Promise<Response>,
  config: Config,
) {
  return async (params: InferParams<Config, Args>) => {
    const requireAuth = config.auth ?? true;
    let user: AuthUser | undefined = undefined;

    // validate the schema passed in the config if it exists
    const data = (
      config.schema ? zodParseFactory(config.schema)(params) : params
    ) as InferParams<Config, Args>;

    // verify the user is authenticated if required
    if (requireAuth) {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      // If the user is not authenticated, redirect to the specified URL.
      if (!session || !session.user) {
        redirect(asUrl("auth", "login"));
      }

      user = session.user;
    }

    return fn(
      data,
      (requireAuth
        ? (user as AuthUser)
        : undefined) as Config["auth"] extends false ? undefined : AuthUser,
    );
  };
}
