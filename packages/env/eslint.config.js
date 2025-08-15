import { nextJsConfig } from '@repo/eslint-config/next-js';

/**
 * Flat ESLint config for @repo/env package.
 * Reuses the shared Next.js config for consistency (even though this package
 * itself is just env schema code) to keep rule coverage aligned with apps.
 *
 * If this becomes overly strict later, we can swap to a leaner shared config.
 *
 * @type {import("eslint").Linter.FlatConfig[]}
 */
export default [
  // Package-level ignores first
  {
    ignores: ['**/node_modules/**', 'dist/**', '.next/**', 'bun.lock'],
  },

  // Reuse shared Next.js + React + TS rules
  ...nextJsConfig,
];
