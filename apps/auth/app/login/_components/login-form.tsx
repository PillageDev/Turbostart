"use client";

import { GalleryVerticalEnd, GithubIcon } from "lucide-react";

import { cn } from "@repo/ui/utils";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import Trans from "~/components/i18n";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { createAuthService } from "../_lib/auth.service";
import { useQueryState } from "nuqs";
import { useRouter } from "next/navigation";
import sharedEnv from "@repo/env/env.shared";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [redirectUrl] = useQueryState("redirectUrl");

  const t = useTranslations("login");

  const router = useRouter();

  const authService = createAuthService();

  const loginWithMagicLink = async (email: string) => {
    const success = await authService.loginWithMagicLink(email, redirectUrl);

    if (success) {
      toast.success(t("MagicLink.emailSent", { email }));
    } else {
      toast.error(t("MagicLink.emailFailed"));
    }
  };

  const loginWithGithub = async () => {
    const { success, url } = await authService.loginWithGithub(redirectUrl);

    if (!success) {
      toast.error(t("LoginWithGithub.failed"));
    } else {
      router.push(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    if (email) {
      await loginWithMagicLink(email);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">{sharedEnv.APP_NAME}</span>
            </a>
            <h1 className="text-xl font-bold">
              <Trans
                namespace="login"
                i18nKey="LoginPage.welcomeText"
                className="text-center"
                values={{ company: sharedEnv.APP_NAME }}
              />
            </h1>
            <div className="text-center text-sm">
              <Trans namespace="login" i18nKey="LoginPage.noAccountText" />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              <Trans namespace="login" i18nKey="LoginPage.loginButtonText" />
            </Button>
          </div>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              <Trans namespace="login" i18nKey="LoginPage.dividerText" />
            </span>
          </div>
          <div className="grid gap-4">
            <Button
              variant="outline"
              type="button"
              className="w-full"
              onClick={loginWithGithub}
            >
              <GithubIcon />
              <Trans
                namespace="login"
                i18nKey="LoginPage.loginWithGithubText"
              />
            </Button>
          </div>
        </div>
      </form>

      <div className="text-muted-foreground text-center text-xs text-balance">
        <Trans
          namespace="login"
          i18nKey="LoginPage.tosMessage"
          values={{
            termsOfService: (
              <a href="#" key={"tos"} className="underline">
                {t("LoginPage.termsOfService")}
              </a>
            ),
            privacyPolicy: (
              <a href="#" key={"privacy"} className="underline">
                {t("LoginPage.privacyPolicy")}
              </a>
            ),
          }}
        />
      </div>
    </div>
  );
}
