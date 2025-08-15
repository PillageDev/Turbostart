'use client';

import * as React from 'react';

import { type UseInViewOptions, useInView } from 'motion/react';
import { useTheme } from 'next-themes';

import { cn } from '../lib/utils';
import { CopyButton } from './buttons/copy';

type CodeEditorProps = Omit<React.ComponentProps<'div'>, 'onCopy'> & {
  children: string;
  lang: string;
  themes?: {
    light: string;
    dark: string;
  };
  duration?: number;
  delay?: number;
  header?: boolean;
  dots?: boolean;
  icon?: React.ReactNode;
  cursor?: boolean;
  inView?: boolean;
  inViewMargin?: UseInViewOptions['margin'];
  inViewOnce?: boolean;
  copyButton?: boolean;
  writing?: boolean;
  title?: string;
  onDone?: () => void;
  onCopy?: (content: string) => void;
};

function CodeEditor({
  children: code,
  lang,
  themes = {
    light: 'github-light',
    dark: 'github-dark',
  },
  duration = 5,
  delay = 0,
  className,
  header = true,
  dots = true,
  icon,
  cursor = false,
  inView = false,
  inViewMargin = '0px',
  inViewOnce = true,
  copyButton = false,
  writing = true,
  title,
  onDone,
  onCopy,
  ...props
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme();

  const editorRef = React.useRef<HTMLDivElement>(null);
  const [visibleCode, setVisibleCode] = React.useState('');
  const [highlightedCode, setHighlightedCode] = React.useState('');
  const [isDone, setIsDone] = React.useState(false);

  const inViewResult = useInView(editorRef, {
    once: inViewOnce,
    margin: inViewMargin,
  });
  const isInView = !inView || inViewResult;

  React.useEffect(() => {
    if (!visibleCode.length || !isInView) return;

    const loadHighlightedCode = async () => {
      try {
        const { codeToHtml } = await import('shiki');

        const highlighted = await codeToHtml(visibleCode, {
          lang,
          themes: {
            light: themes.light,
            dark: themes.dark,
          },
          defaultColor: resolvedTheme === 'dark' ? 'dark' : 'light',
        });

        setHighlightedCode(highlighted);
      } catch (e) {
        console.error(`Language "${lang}" could not be loaded.`, e);
      }
    };

    loadHighlightedCode();
  }, [
    lang,
    themes,
    writing,
    isInView,
    duration,
    delay,
    visibleCode,
    resolvedTheme,
  ]);

  React.useEffect(() => {
    if (!writing) {
      setVisibleCode(code);
      onDone?.();
      return;
    }

    if (!code.length || !isInView) return;

    const characters = Array.from(code);
    let index = 0;
    const totalDuration = duration * 1000;
    const interval = totalDuration / characters.length;
    let intervalId: NodeJS.Timeout;

    const timeout = setTimeout(() => {
      intervalId = setInterval(() => {
        if (index < characters.length) {
          setVisibleCode((prev) => {
            const currentIndex = index;
            index += 1;
            return prev + characters[currentIndex];
          });
          editorRef.current?.scrollTo({
            top: editorRef.current?.scrollHeight,
            behavior: 'smooth',
          });
        } else {
          clearInterval(intervalId);
          setIsDone(true);
          onDone?.();
        }
      }, interval);
    }, delay * 1000);

    return () => {
      clearTimeout(timeout);
      clearInterval(intervalId);
    };
  }, [code, duration, delay, isInView, writing, onDone]);

  return (
    <div
      data-slot="code-editor"
      className={cn(
        'bg-muted/50 border-border relative flex h-[400px] w-[600px] flex-col overflow-hidden rounded-xl border',
        className,
      )}
      {...props}
    >
      {header ? (
        <div className="bg-muted border-border/75 dark:border-border/50 relative flex h-10 flex-row items-center justify-between gap-y-2 border-b px-4">
          {dots && (
            <div className="flex flex-row gap-x-2">
              <div className="size-2 rounded-full bg-red-500"></div>
              <div className="size-2 rounded-full bg-yellow-500"></div>
              <div className="size-2 rounded-full bg-green-500"></div>
            </div>
          )}

          {title && (
            <div
              className={cn(
                'flex flex-row items-center gap-2',
                dots &&
                  'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
              )}
            >
              {icon ? (
                <div
                  className="text-muted-foreground [&_svg]:size-3.5"
                  dangerouslySetInnerHTML={
                    typeof icon === 'string' ? { __html: icon } : undefined
                  }
                >
                  {typeof icon !== 'string' ? icon : null}
                </div>
              ) : null}
              <figcaption className="text-muted-foreground flex-1 truncate text-[13px]">
                {title}
              </figcaption>
            </div>
          )}

          {copyButton ? (
            <CopyButton
              content={code}
              size="sm"
              variant="ghost"
              className="-me-2 bg-transparent hover:bg-black/5 dark:hover:bg-white/10"
              onCopy={onCopy}
            />
          ) : null}
        </div>
      ) : (
        copyButton && (
          <CopyButton
            content={code}
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 z-[2] bg-transparent backdrop-blur-md hover:bg-black/5 dark:hover:bg-white/10"
            onCopy={onCopy}
          />
        )
      )}
      <div
        ref={editorRef}
        className="relative h-[calc(100%-2.75rem)] w-full flex-1 overflow-auto p-4 font-mono text-sm"
      >
        <div
          className={cn(
            '[&_code]:!text-[13px] [&>pre,_&_code]:border-none [&>pre,_&_code]:!bg-transparent [&>pre,_&_code]:[background:transparent_!important]',
            cursor &&
              !isDone &&
              "[&_.line:last-of-type::after]:inline-block [&_.line:last-of-type::after]:w-[1ch] [&_.line:last-of-type::after]:-translate-px [&_.line:last-of-type::after]:animate-pulse [&_.line:last-of-type::after]:content-['|']",
          )}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </div>
    </div>
  );
}

export { CodeEditor, type CodeEditorProps };
