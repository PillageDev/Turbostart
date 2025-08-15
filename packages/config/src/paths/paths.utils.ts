import { pathsConfigData } from './paths.config';

type PathKeys = {
  [K in keyof typeof pathsConfigData]: keyof (typeof pathsConfigData)[K]['paths'];
};

type ExtractReplacements<
  TApp extends keyof typeof pathsConfigData,
  TPath extends PathKeys[TApp],
> = TPath extends keyof (typeof pathsConfigData)[TApp]['paths']
  ? (typeof pathsConfigData)[TApp]['paths'][TPath] extends {
      replacements: readonly (infer R)[];
    }
    ? R extends string
      ? Record<R, string>
      : never
    : never
  : never;

type HasReplacements<
  TApp extends keyof typeof pathsConfigData,
  TPath extends PathKeys[TApp],
> = TPath extends keyof (typeof pathsConfigData)[TApp]['paths']
  ? (typeof pathsConfigData)[TApp]['paths'][TPath] extends {
      replacements: readonly string[];
    }
    ? true
    : false
  : false;

export function asUrl<
  TApp extends keyof typeof pathsConfigData,
  TPath extends PathKeys[TApp],
>(
  appKey: TApp,
  pathKey: TPath,
  ...args: HasReplacements<TApp, TPath> extends true
    ? [replacements: ExtractReplacements<TApp, TPath>]
    : [replacements?: never]
): string;

export function asUrl<TApp extends keyof typeof pathsConfigData>(
  appKey: TApp,
  pathKey: PathKeys[TApp],
  replacements?: Record<string, string>,
): string {
  const app = pathsConfigData[appKey];
  const appUrl = 'appUrl' in app ? app.appUrl : undefined;

  if (!appUrl) {
    throw new Error(
      `App URL is not defined for app: ${String(appKey)}. Please check your paths configuration.`,
    );
  }

  const pathValue = app.paths[pathKey as keyof typeof app.paths] as {
    href: string;
    replacements?: string[];
  };

  let finalHref = pathValue.href;

  if (pathValue.replacements && replacements) {
    for (const replacement of pathValue.replacements) {
      const value = replacements[replacement];
      if (value !== undefined) {
        finalHref = finalHref.replace(`[${replacement}]`, value);
      } else {
        console.warn(`Missing replacement value for: ${replacement}`);
      }
    }
  }

  return `${appUrl}${finalHref}`;
}
