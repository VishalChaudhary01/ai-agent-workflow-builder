import { z } from "zod";

export const createWorkflowSchema = z.object({
  name: z
    .string("Name is required")
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters"),

  description: z.string().max(500, "Description too long").optional(),

  config: z.string().default("{}").optional(),

  published: z.boolean().default(false).optional(),
});

export type CreateWorkflowType = z.infer<typeof createWorkflowSchema>;
