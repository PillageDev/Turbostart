import { defineConfig } from 'drizzle-kit';

import serverEnv from '@repo/env/env.server';

export default defineConfig({
  out: './drizzle',
  schema: ['./src/db/auth.ts', './src/db/features/user-avatar-storage.ts'],
  dialect: 'postgresql',
  dbCredentials: {
    url: serverEnv.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  },
});
