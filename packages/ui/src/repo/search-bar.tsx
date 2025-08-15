import * as React from 'react';

import { Search } from 'lucide-react';

import { Input } from '@repo/ui/input';
import { cn } from '@repo/ui/utils';

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  shortcutCode?: string | string[];
  commandKey?: boolean;
  className?: string;
  containerClassName?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearch?: (value: string) => void;
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      placeholder = 'Search...',
      shortcutCode = 'f',
      commandKey,
      className,
      containerClassName,
      searchValue,
      onSearchChange,
      onSearch,
      ...props
    },
    forwardedRef,
  ) => {
    const internalRef = React.useRef<HTMLInputElement>(null);
    const ref =
      (forwardedRef as React.RefObject<HTMLInputElement>) || internalRef;

    const codes = React.useMemo(
      () => (Array.isArray(shortcutCode) ? shortcutCode : [shortcutCode]),
      [shortcutCode],
    );

    const keyLabel = codes[0]?.toUpperCase?.() || '';

    const isMac = /Mac|iPhone|iPod|iPad/.test(navigator.platform);
    const modifierLabel = commandKey === true ? (isMac ? '⌘' : 'Alt+') : '';
    const fullShortcutLabel =
      commandKey === false ? keyLabel : `${modifierLabel}${keyLabel}`;

    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        const keyMatch = codes.includes(e.key.toLowerCase());
        const modifierHeld = isMac ? e.metaKey : e.altKey;
        const modifierCheck =
          commandKey === undefined || commandKey === modifierHeld;

        const inputIsFocused =
          document.activeElement?.tagName === 'INPUT' ||
          document.activeElement?.tagName === 'TEXTAREA' ||
          (document.activeElement as HTMLElement | null)?.isContentEditable;

        if (!inputIsFocused && keyMatch && modifierCheck) {
          e.preventDefault();
          ref?.current?.focus();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [ref, shortcutCode, commandKey, codes, isMac]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (onSearch) {
        onSearch(searchValue);
      }
    };

    return (
      <form
        onSubmit={handleSubmit}
        className={cn('relative', containerClassName)}
      >
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />

        <Input
          ref={ref}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'h-8 w-48 border-gray-700 bg-gray-800 pr-8 pl-10 text-sm text-white placeholder-gray-400',
            className,
          )}
          {...props}
        />

        {commandKey !== undefined && (
          <kbd className="absolute top-1/2 right-2 -translate-y-1/2 transform rounded bg-gray-700 px-1 text-xs text-gray-400">
            {fullShortcutLabel}
          </kbd>
        )}
      </form>
    );
  },
);

SearchBar.displayName = 'SearchBar';
