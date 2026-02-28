import { NextFunction, Request, Response } from "express";
import { StatusCode } from "@/config/httpStatus";
import { AppError } from "@/utils/appError";

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.log(`Error occured at PATH: ${req.path}`, error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
    message:
      error.message ??
      "We are sorry for the inconvenience. Something went wrong on the server. Please try again later.",
  });
}
