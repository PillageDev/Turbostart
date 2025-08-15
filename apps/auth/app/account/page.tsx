import { auth } from "@repo/auth";
import { asUrl } from "@repo/config/paths.utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileCard } from "./_components/profile-card";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(asUrl("auth", "login"));
  }

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 min-w-screen">
      <div className="w-full flex items-center justify-center">
        <ProfileCard user={session.user} />
      </div>
    </div>
  );
}
