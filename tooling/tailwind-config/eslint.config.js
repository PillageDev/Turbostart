/**
 * Flat ESLint config for @repo/tailwind-config.
 *
 * Goal: make `bun lint` succeed without pulling in TypeScript project parsing
 * (since this package currently has only a PostCSS config JS file).
 *
 * We intentionally:
 *  - Do NOT use @typescript-eslint (no TS sources here, avoids project lookup errors)
 *  - Keep the config minimal (JS recommended + Prettier compat)
 *  - Use CommonJS (package lacks `"type": "module"`)
 */

const js = require('@eslint/js');
const prettier = require('eslint-config-prettier');

/** @type {import("eslint").Linter.FlatConfig[]} */
module.exports = [
  // Global ignores for this package
  {
    ignores: ['**/node_modules/**', 'dist/**', '.next/**', 'bun.lock'],
  },

  // Base recommended JS rules
  js.configs.recommended,

  // Package-specific overrides
  {
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
    },
    // Merge in Prettier's disabling of formatting-related rules
    rules: {
      ...(prettier && prettier.rules ? prettier.rules : {}),
    },
  },
];
