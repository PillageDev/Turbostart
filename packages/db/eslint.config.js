/**
 * Flat ESLint configuration for @repo/db package.
 *
 * This package contains both server/database TypeScript code and a small React
 * provider entry (see providers.tsx). We therefore reuse the shared internal
 * React + TypeScript flat config (react-internal) rather than the Next.js one
 * to avoid page-directory related warnings.
 *
 * If this package later becomes purely backend (no React), we can swap to a
 * leaner base config or introduce a dedicated “node” shared config.
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
      'drizzle.config.*',
      'drizzle-*.*',
    ],
  },

  // Shared internal React + TS configuration
  ...reactInternalConfig,

  // Package-specific overrides / refinements
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      // Keep parserOptions minimal (we are not enabling full type-aware linting here)
      parserOptions: {
        sourceType: 'module',
      },
    },
    rules: {
      // Add DB specific rule adjustments here if needed.
      // Example (commented): Turn off prop-types if ever triggered by mixed imports
      // 'react/prop-types': 'off',
    },
  },

  // Removed node-only override block (excludedFiles is not supported in flat config API)
];
