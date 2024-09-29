import { z } from "zod";

export const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_ACCESS_EXPIRY: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_REFRESH_EXPIRY: z.string(),
  RATE_LIMIT_TTL: z.coerce.number(),
  RATE_LIMIT: z.coerce.number(),
});

export type EnvironmentVariables = z.infer<typeof envSchema>;
