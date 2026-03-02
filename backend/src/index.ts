import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Env } from "./config/env";
import { errorHandler } from "./middlewares/errorHandler";
import { StatusCode } from "./config/httpStatus";
import { AppError } from "./utils/appError";
import { connectDB } from "./config/db";
import appRoutes from "./routes";

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Healthy server" });
});

app.use("/api/v1", appRoutes);

app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`API route ${req.path} not found`, StatusCode.NOT_FOUND));
});

app.use(errorHandler);

app.listen(Env.PORT, async () => {
  await connectDB();
  console.log(`Server running at http://localhost:${Env.PORT}`);
});
