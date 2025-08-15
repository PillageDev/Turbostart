import z from 'zod';

const AppPathSchema = <T extends z.ZodRawShape>(pathsSchema: z.ZodObject<T>) =>
  z.object({
    appUrl: z.string(),
    paths: pathsSchema,
  });

const PathSchema = z.object({
  href: z.string(),
  replacements: z.array(z.string()).optional(),
});

const AuthPathsSchema = z.object({
  login: PathSchema,
  account: PathSchema,
  authError: PathSchema,
});

const WebPathsSchema = z.object({
  protected: PathSchema,
});

export const PathsSchema = z.object({
  auth: AppPathSchema(AuthPathsSchema),
  web: AppPathSchema(WebPathsSchema),
});
