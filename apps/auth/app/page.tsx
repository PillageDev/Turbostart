import { auth } from "@repo/auth";
import { asUrl } from "@repo/config/paths.utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(asUrl("auth", "login"));
  } else {
    redirect(asUrl("auth", "account"));
  }
}
