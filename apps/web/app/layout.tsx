import { Providers } from "~/components/providers";
import "@repo/ui/styles/globals.css";

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <Providers>{children}</Providers>
        </body>
      </html>
    </>
  );
}

export const metadata = {
  title: "My App",
  description: "My App Description",
};
