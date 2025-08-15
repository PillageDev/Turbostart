import { defineConfig } from 'drizzle-kit';

import serverEnv from '@repo/env/env.server';

export default defineConfig({
  out: './drizzle',
  dialect: 'postgresql',
  schema: './src/db/empty/empty-schema.ts',
  dbCredentials: {
    url: serverEnv.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  },
});
