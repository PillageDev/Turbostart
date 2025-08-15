import z from 'zod';

import sharedEnv from '@repo/env/env.shared';

import { PathsSchema } from './paths.schema';

export const pathsConfigData = {
  auth: {
    appUrl: sharedEnv.AUTH_BASE_URL,
    paths: {
      login: { href: '/login' },
      account: { href: '/account' },
      authError: { href: '/auth-error' },
    },
  },
  web: {
    appUrl: sharedEnv.WEB_BASE_URL,
    paths: {
      protected: { href: '/protected' },
    },
  },
} as const satisfies z.infer<typeof PathsSchema>;

export const pathsConfig = PathsSchema.parse(pathsConfigData);
