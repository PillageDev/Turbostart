/**
 * Flat ESLint configuration for @repo/auth.
 *
 * This package is a mixed TypeScript library (server + client auth helpers) and does
 * not need Next.js specific rules. We reuse the shared internal React + TS flat config
 * (`react-internal`) and layer on package‑specific ignores and a placeholder override
 * block for future customizations.
 *
 * We intentionally do NOT enable parserOptions.project here to avoid forcing full
 * type-aware linting (keeps lint fast and avoids TS program resolution issues in
 * packages that only need syntactic rules).
 */
import { config as reactInternalConfig } from '@repo/eslint-config/react-internal';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // Package-level ignores
  {
    ignores: [
      '**/node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      'bun.lock',
    ],
  },

  // Shared internal React + TypeScript rules
  ...reactInternalConfig,

  // Package-specific overrides / future adjustments
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      // Keep it simple (no project: true to avoid type-aware requirements).
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      // Add or override auth-specific rules here if needed.
      // Example (disabled here, add if you want stricter imports):
      // 'no-restricted-imports': ['error', { patterns: ['../*'] }],
    },
  },
];
