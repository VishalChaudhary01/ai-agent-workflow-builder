import {
  createWorkflow,
  getWorkflowById,
  getWorkflows,
} from "@/controller/workflow.controller";
import { validateInput } from "@/middlewares/inputValidator";
import { createWorkflowSchema } from "@/validator/workflow.validator";
import { Router } from "express";

const workflowRoutes = Router();

workflowRoutes.post("/", validateInput(createWorkflowSchema), createWorkflow);
workflowRoutes.get("/:id", getWorkflowById);
workflowRoutes.get("/", getWorkflows);

export default workflowRoutes;
