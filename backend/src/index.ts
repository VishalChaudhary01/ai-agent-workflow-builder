import express, { NextFunction, Request, Response } from "express";
import { Env } from "./config/env";
import { errorHandler } from "./middlewares/errorHandler";
import { StatusCode } from "./config/httpStatus";
import { AppError } from "./utils/appError";

const app = express();

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Healthy server" });
});

app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`API route ${req.path} not found`, StatusCode.NOT_FOUND));
});

app.use(errorHandler);

app.listen(Env.PORT, () =>
  console.log(`Server running at http://localhost:${Env.PORT}`),
);
