"use client";
import { useTranslations } from "next-intl";
import { cloneElement, createElement, isValidElement } from "react";
import type { ElementType, ReactElement, ReactNode } from "react";
import { Namespace } from "~/lib/i18n/request";

type RichWrapper = ElementType | ReactElement | string;

export type TransProps = {
  i18nKey: string;
  namespace: Namespace;
  values?: Record<string, unknown>;
  components?: Record<string, RichWrapper>;
  className?: string;
};

function toRichHandler(wrapper: RichWrapper): (chunks: ReactNode) => ReactNode {
  if (isValidElement(wrapper)) {
    return (chunks: ReactNode) =>
      cloneElement(wrapper, wrapper.props as any, chunks);
  }

  if (typeof wrapper === "string" || typeof wrapper === "function") {
    const Component = (chunks: ReactNode) =>
      createElement(wrapper as ElementType, null, chunks);
    Component.displayName = `RichWrapper(${typeof wrapper === "string" ? wrapper : wrapper.name || "Anonymous"})`;
    return Component;
  }

  return (chunks: ReactNode) => chunks;
}

export function Trans({
  i18nKey,
  namespace,
  values,
  components,
  className,
}: TransProps) {
  const t = useTranslations(namespace);

  const richHandlers: Record<string, (chunks: ReactNode) => ReactNode> = {};
  if (components) {
    for (const [name, wrapper] of Object.entries(components)) {
      richHandlers[name] = toRichHandler(wrapper);
    }
  }

  const result = t.rich(i18nKey, {
    ...values,
    ...richHandlers,
  } as any);

  return <span className={className}>{result}</span>;
}

Trans.displayName = "Trans";
export default Trans;
