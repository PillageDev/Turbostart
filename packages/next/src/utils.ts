import { z } from "zod";

export const zodParseFactory =
  <T extends z.ZodTypeAny>(schema: T) =>
  (data: unknown): z.infer<T> => {
    try {
      // @ts-expect-error works
      return schema.parse(data) as unknown;
    } catch (err) {
      console.error(err);

      // handle error
      throw new Error(`Invalid data: ${err as string}`);
    }
  };
