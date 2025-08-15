import { TRPCNextProvider } from "@repo/api-client/next/providers";
import { Toaster } from "@repo/ui/sonner";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <TRPCNextProvider>
      <ThemeProvider
        attribute={"class"}
        enableSystem
        disableTransitionOnChange
        defaultTheme={"system"}
      >
        <NuqsAdapter>
          <NextIntlClientProvider>
            <Toaster richColors={true} position="top-center" />
            {children}
          </NextIntlClientProvider>
        </NuqsAdapter>
      </ThemeProvider>
    </TRPCNextProvider>
  );
}
