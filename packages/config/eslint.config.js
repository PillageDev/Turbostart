/**
 * Flat ESLint configuration for @repo/config package.
 *
 * This package only contains TypeScript (no Next.js pages), so we reuse the
 * shared internal React + TypeScript rules without the Next.js plugin to avoid
 * page directory warnings.
 *
 * If we later add Node-only (non-React) code here and want a slimmer rule set,
 * we can replace the imported shared config with a lighter variant.
 */
import { config as reactInternalConfig } from '@repo/eslint-config/react-internal';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // Package-level ignores (placed first so they apply globally)
  {
    ignores: [
      '**/node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      'bun.lock',
    ],
  },

  // Shared internal React + TS configuration
  ...reactInternalConfig,

  // Package specific tweaks / overrides can be added here
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      // Keep parserOptions minimal to avoid forcing type-aware linting everywhere
      // (reactInternalConfig already establishes sensible defaults).
      parserOptions: {
        sourceType: 'module',
      },
    },
    rules: {
      // Add / override rules specific to this package below if needed.
    },
  },
];
