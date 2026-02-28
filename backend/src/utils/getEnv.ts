import { AppError } from "./appError";

export const getEnv = (key: string, defaultValue = "") => {
  const value = process.env[key];
  if (!value) {
    if (!defaultValue) {
      throw new AppError(`Environment variable ${key}, not set`);
    }
    return defaultValue;
  }
  return value;
};
