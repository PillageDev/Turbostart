import z from 'zod';

const sharedEnvSchema = z.object({
  WEB_BASE_URL: z.string(),
  AUTH_BASE_URL: z.string(),
  API_BASE_URL: z.string(),
  APP_NAME: z.string(),
});

const sharedEnv = sharedEnvSchema.parse({
  WEB_BASE_URL: process.env.NEXT_PUBLIC_WEB_BASE_URL,
  AUTH_BASE_URL: process.env.NEXT_PUBLIC_AUTH_BASE_URL,
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
} satisfies Record<keyof z.infer<typeof sharedEnvSchema>, unknown>);

export default sharedEnv;
