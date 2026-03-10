import { StatusCode } from "@/config/httpStatus";
import { Workflow } from "@/models/Workflow";
import { WorkflowRunner } from "@/services/workflowrunner";
import { AppError } from "@/utils/appError";
import { CreateWorkflowType } from "@/validator/workflow.validator";
import { RequestHandler } from "express";

export const createWorkflow: RequestHandler = async (req, res) => {
  const data: CreateWorkflowType = req.body;
  const userId = req.userId;

  const exitingWorkflow = await Workflow.findOne({ name: data.name, userId });
  if (exitingWorkflow) {
    throw new AppError("Workflow with given name already exist");
  }

  const newWorkflow = await Workflow.create({
    ...data,
    userId,
  });

  res
    .status(StatusCode.CREATED)
    .json({ message: "Create workflow successful", id: newWorkflow._id });
};

export const updateWorkflow: RequestHandler = async (req, res) => {
  const userId = req.userId;
  const workflowId = req.params.id;
  const workflow = await Workflow.findById(workflowId);
  if (!workflow || workflow.userId.toString() !== userId) {
    throw new AppError("Workflow not found", StatusCode.NOT_FOUND);
  }

  const updatedWorkflow = await Workflow.findByIdAndUpdate(
    workflowId,
    req.body,
  );

  res
    .status(StatusCode.OK)
    .json({ message: "Workflow updated", updatedWorkflow });
};

export const getWorkflows: RequestHandler = async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    throw new AppError("Unauthorized user", StatusCode.UNAUTHORIZED);
  }

  const workflows = await Workflow.find({ userId });

  res
    .status(StatusCode.OK)
    .json({ message: "Fetch all workflow successful", workflows });
};

export const getWorkflowById: RequestHandler = async (req, res) => {
  const workflowId = req.params.id;
  const userId = req.userId;
  if (!userId) {
    throw new AppError("Unauthorized user", StatusCode.UNAUTHORIZED);
  }

  const workflow = await Workflow.findById(workflowId);
  if (!workflow || workflow.userId.toString() !== userId) {
    throw new AppError("Workflow not found", StatusCode.NOT_FOUND);
  }

  res.status(StatusCode.OK).json({
    message: "Fetch workflow successful",
    workflow,
  });
};

export const runWorkflow: RequestHandler = async (req, res) => {
  const { id = "" } = req.params;
  const { userMessage, config } = req.body;

  const userId = req.userId;

  if (!userId) {
    throw new AppError("Unauthorized", StatusCode.UNAUTHORIZED);
  }

  const workflow = await Workflow.findById(id).lean();

  if (!workflow || workflow.userId.toString() !== userId) {
    throw new AppError("Workflow not found", StatusCode.NOT_FOUND);
  }

  const runner = new WorkflowRunner(config, userMessage);
  const result = await runner.execute();

  res.status(StatusCode.OK).json({
    message: "Workflow executed",
    output: result.output,
    executionLog: result.log,
  });
};
