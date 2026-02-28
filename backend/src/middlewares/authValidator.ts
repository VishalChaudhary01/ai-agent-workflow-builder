import { Env } from "@/config/env";
import { StatusCode } from "@/config/httpStatus";
import { AppError } from "@/utils/appError";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const validateAuth: RequestHandler = (req, _res, next) => {
  try {
    const token = req.cookies?.[Env.AUTH_COOKIE_NAME];
    if (!token) {
      throw new AppError("Token not found", StatusCode.UNAUTHORIZED);
    }

    const payload = jwt.verify(token, Env.JWT_SECRET) as { userId: string };

    req.userId = payload.userId;

    next();
  } catch (error) {
    next(new AppError("Invalid or expired token", StatusCode.UNAUTHORIZED));
  }
};
