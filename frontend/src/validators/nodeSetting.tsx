import { z } from "zod";

export const agentSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(64, "Name must be under 64 characters"),
  instruction: z
    .string()
    .min(1, "Instruction is required")
    .max(4000, "Instruction must be under 4000 characters"),
  includeChatHistory: z.boolean(),
  model: z.string().min(1, "Please select a model"),
  temperature: z.number().min(0).max(2),
  maxTokens: z.number().min(128).max(8192),
  outputFormat: z.enum(["text", "json"]),
  jsonSchema: z.string().optional(),
});

export const userApprovalSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(64, "Title must be under 64 characters"),
  message: z
    .string()
    .max(4000, "Message must be under 4000 characters")
    .optional(),
});

export const endSchema = z.object({
  outputFormat: z
    .string()
    .max(4000, "Output format must be under 4000 characters")
    .optional(),
});

export const ifElseSchema = z.object({
  ifCondition: z
    .string()
    .min(1, "If condition is required")
    .max(155, "If condition must be under 155 characters"),
});

export const whileSchema = z.object({
  condition: z
    .string()
    .min(1, "Condition is required")
    .max(155, "Condition must be under 155 characters"),
});
export type AgentFormData = z.infer<typeof agentSchema>;
export type UserApprovalData = z.infer<typeof userApprovalSchema>;
export type EndData = z.infer<typeof endSchema>;
export type IfElseData = z.infer<typeof ifElseSchema>;
export type WhileData = z.infer<typeof whileSchema>;
