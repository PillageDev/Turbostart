import { auth } from "@repo/auth";
import { asUrl } from "@repo/config/paths.utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "./_components/login-form";

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect(asUrl("auth", "account"));
  }

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
