'use client';

import * as React from 'react';

import { useTheme } from 'next-themes';

import { cn } from '../lib/utils';
import { CopyButton } from './buttons/copy';
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  type TabsProps,
  TabsTrigger,
} from './tabs';

type CodeTabsProps = {
  codes: Record<string, string>;
  lang?: string;
  themes?: {
    light: string;
    dark: string;
  };
  copyButton?: boolean;
  onCopy?: (content: string) => void;
} & Omit<TabsProps, 'children'>;

function CodeTabs({
  codes,
  lang = 'bash',
  themes = {
    light: 'github-light',
    dark: 'github-dark',
  },
  className,
  defaultValue,
  value,
  onValueChange,
  copyButton = true,
  onCopy,
  ...props
}: CodeTabsProps) {
  const { resolvedTheme } = useTheme();

  const [highlightedCodes, setHighlightedCodes] = React.useState<Record<
    string,
    string
  > | null>(null);
  const [selectedCode, setSelectedCode] = React.useState<string>(
    value ?? defaultValue ?? Object.keys(codes)[0] ?? '',
  );

  React.useEffect(() => {
    async function loadHighlightedCode() {
      try {
        const { codeToHtml } = await import('shiki');
        const newHighlightedCodes: Record<string, string> = {};

        for (const [command, val] of Object.entries(codes)) {
          const highlighted = await codeToHtml(val, {
            lang,
            themes: {
              light: themes.light,
              dark: themes.dark,
            },
            defaultColor: resolvedTheme === 'dark' ? 'dark' : 'light',
          });

          newHighlightedCodes[command] = highlighted;
        }

        setHighlightedCodes(newHighlightedCodes);
      } catch (error) {
        console.error('Error highlighting codes', error);
        setHighlightedCodes(codes);
      }
    }
    loadHighlightedCode();
  }, [resolvedTheme, lang, themes.light, themes.dark, codes]);

  return (
    <Tabs
      data-slot="install-tabs"
      className={cn(
        'bg-muted/50 w-full gap-0 overflow-hidden rounded-xl border',
        className,
      )}
      {...props}
      value={selectedCode}
      onValueChange={(val) => {
        setSelectedCode(val);
        onValueChange?.(val);
      }}
    >
      <TabsList
        data-slot="install-tabs-list"
        className="bg-muted border-border/75 dark:border-border/50 relative h-10 w-full justify-between rounded-none border-b px-4 py-0 text-current"
        activeClassName="rounded-none shadow-none bg-transparent after:content-[''] after:absolute after:inset-x-0 after:h-0.5 after:bottom-0 dark:after:bg-white after:bg-black after:rounded-t-full"
      >
        <div className="flex h-full gap-x-3">
          {highlightedCodes &&
            Object.keys(highlightedCodes).map((code) => (
              <TabsTrigger
                key={code}
                value={code}
                className="text-muted-foreground px-0 data-[state=active]:text-current"
              >
                {code}
              </TabsTrigger>
            ))}
        </div>

        {copyButton && highlightedCodes && (
          <CopyButton
            content={codes[selectedCode]}
            size="sm"
            variant="ghost"
            className="-me-2 bg-transparent hover:bg-black/5 dark:hover:bg-white/10"
            onCopy={onCopy}
          />
        )}
      </TabsList>
      <TabsContents data-slot="install-tabs-contents">
        {highlightedCodes &&
          Object.entries(highlightedCodes).map(([code, val]) => (
            <TabsContent
              data-slot="install-tabs-content"
              key={code}
              className="flex w-full items-center overflow-auto p-4 text-sm"
              value={code}
            >
              <div
                className="[&_code]:!text-[13px] [&>pre,_&_code]:border-none [&>pre,_&_code]:!bg-transparent [&>pre,_&_code]:[background:transparent_!important]"
                dangerouslySetInnerHTML={{ __html: val }}
              />
            </TabsContent>
          ))}
      </TabsContents>
    </Tabs>
  );
}

export { CodeTabs, type CodeTabsProps };
