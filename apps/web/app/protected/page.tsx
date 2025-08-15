import { auth } from "@repo/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { asUrl } from "@repo/config/paths.utils";

export default async function ProtectedPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(
      `${asUrl("auth", "login")}?redirectUrl=${asUrl("web", "protected")}`,
    );
  }

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <h1 className="text-2xl font-bold">Welcome {session.user.name}</h1>
      <p className="text-lg">
        You are authenticated and can view this content.
      </p>
    </div>
  );
}
