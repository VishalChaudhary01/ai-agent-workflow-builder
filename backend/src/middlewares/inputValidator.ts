import { RequestHandler } from "express";
import { ZodObject } from "zod";

export const validateInput = (schema: ZodObject): RequestHandler => {
  return (req, _res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};
