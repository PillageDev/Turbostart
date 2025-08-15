import { headers as nextHeaders } from "next/headers";
import { appRouter } from "..";
import { createTRPCContext } from "../context";
import { createCallerFactory } from "../trpc";

/**
 * Build a tRPC context from arbitrary headers.
 */
async function createContextFromHeaders(init: HeadersInit) {
  const h = new Headers(init);

  return createTRPCContext({ headers: h });
}

const makeCaller = createCallerFactory(appRouter);

type AppCaller = ReturnType<typeof makeCaller>;

/**
 * Create a server-side tRPC caller using a Headers-like object.
 *
 * Useful for:
 * - Next.js Route Handlers (passing `request.headers`)
 * - Edge/server utilities with access to headers
 */
export async function createCallerFromHeaders(
  init: HeadersInit,
): Promise<AppCaller> {
  const ctx = await createContextFromHeaders(init);
  return makeCaller(ctx);
}

/**
 * Create a server-side tRPC caller from a Fetch API Request object.
 *
 * Useful for:
 * - Next.js Route Handlers: `export async function GET(req: Request) { ... }`
 */
export async function createCallerFromRequest(
  request: Request,
): Promise<AppCaller> {
  return createCallerFromHeaders(request.headers);
}

/**
 * Get a server-side tRPC caller using Next.js incoming request headers.
 *
 * Use inside:
 * - Server Actions
 * - Server Components
 * - Any server-only code in the App Router
 */
export async function getServerCaller(): Promise<AppCaller> {
  const h = await nextHeaders();
  return createCallerFromHeaders(h);
}

/**
 * Convenience alias specifically for Server Actions.
 */
export const getActionCaller = getServerCaller;

/**
 * Convenience alias specifically for Route Handlers.
 */
export async function getRouteHandlerCaller(
  request: Request,
): Promise<AppCaller> {
  return createCallerFromRequest(request);
}
