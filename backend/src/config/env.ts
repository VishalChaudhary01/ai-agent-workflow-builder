import { getEnv } from "@/utils/getEnv";

export const Env = {
  PORT: getEnv("PORT", "5000"),
} as const;
