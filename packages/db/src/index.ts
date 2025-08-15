import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import serverEnv from '@repo/env/env.server';

import * as authSchema from './db/auth';
import * as userAvatarStore from './db/features/user-avatar-storage';

const pool = new Pool({
  connectionString: serverEnv.DATABASE_URL,
});

const fullSchema = {
  ...authSchema,
  ...userAvatarStore,
};

export const db = drizzle({ client: pool, schema: fullSchema });

export { fullSchema as schema };
export * from './db/auth';
export * from './db/features/user-avatar-storage';
export { eq, lt, gte, ne, and, desc } from 'drizzle-orm';
