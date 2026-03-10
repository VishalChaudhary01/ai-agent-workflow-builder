import { getEnv } from "@/utils/getEnv";

export const Env = {
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: getEnv("PORT"),
  DATABASE_URL: getEnv("DATABASE_URL"),
  JWT_SECRET: getEnv("JWT_SECRET"),
  AUTH_COOKIE_NAME: getEnv("AUTH_COOKIE_NAME"),
  OPENAI_API_KEY: getEnv("OPENAI_API_KEY"),
  GEMINI_API_KEY: getEnv("GEMINI_API_KEY"),
} as const;
