import { getEnv } from "@/utils/getEnv";

export const Env = {
  PORT: getEnv("PORT"),
} as const;
