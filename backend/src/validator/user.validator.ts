import { z } from "zod";

export const signUpSchema = z.object({
  name: z
    .string("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .trim(),

  username: z
    .string("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .regex(/^\S+$/, "Username cannot contain spaces")
    .trim(),

  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const signInSchema = z.object({
  username: z
    .string("Username is required")
    .min(1, "Username is required")
    .trim(),

  password: z.string("Password is required").min(1, "Password is required"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
