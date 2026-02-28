import { Router } from "express";
import userRoutes from "./user.routes";
import { validateAuth } from "@/middlewares/authValidator";
import workflowRoutes from "./workflow.routes";

const appRoutes = Router();

appRoutes.use("/user", userRoutes);
appRoutes.use("/workflow", validateAuth, workflowRoutes);

export default appRoutes;
