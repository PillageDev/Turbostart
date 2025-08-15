import z from 'zod';

const LanguageSchema = z.object({
  name: z.string(),
  code: z.string().length(2).toLowerCase(),
  flag: z.string(),
});

const i18nConfigSchema = z.object({
  languages: z.array(LanguageSchema).min(1),
});

const i18nConfigData = {
  languages: [
    {
      name: 'English',
      code: 'en',
      flag: '🇬🇧',
    },
  ],
} as const satisfies z.infer<typeof i18nConfigSchema>;

export const i18nConfig = i18nConfigSchema.parse(i18nConfigData);
