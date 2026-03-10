import {
  createWorkflow,
  getWorkflowById,
  getWorkflows,
  runWorkflow,
  updateWorkflow,
} from "@/controller/workflow.controller";
import { validateInput } from "@/middlewares/inputValidator";
import { createWorkflowSchema } from "@/validator/workflow.validator";
import { Router } from "express";

const workflowRoutes = Router();

workflowRoutes.post("/", validateInput(createWorkflowSchema), createWorkflow);
workflowRoutes.put("/:id", updateWorkflow);
workflowRoutes.get("/:id", getWorkflowById);
workflowRoutes.get("/", getWorkflows);
workflowRoutes.post("/:id/run", runWorkflow);

export default workflowRoutes;
