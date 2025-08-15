import { getRequestConfig } from "next-intl/server";

export const NAMESPACES = ["common"] as const;

export type Namespace = (typeof NAMESPACES)[number];

export default getRequestConfig(async () => {
  const locale = "en";

  const messages: Record<string, any> = {};

  for (const namespace of NAMESPACES) {
    const namespaceMessages = (
      await import(`../../messages/${locale}/${namespace}.json`)
    ).default;
    messages[namespace] = namespaceMessages;
  }

  return {
    locale,
    messages,
  };
});
