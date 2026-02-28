import {
  getProfile,
  signIn,
  signOut,
  signUp,
} from "@/controller/user.controller";
import { validateAuth } from "@/middlewares/authValidator";
import { validateInput } from "@/middlewares/inputValidator";
import { signInSchema, signUpSchema } from "@/validator/user.validator";
import { Router } from "express";

const userRoutes = Router();

userRoutes.post("/signup", validateInput(signUpSchema), signUp);
userRoutes.post("/signin", validateInput(signInSchema), signIn);
userRoutes.post("/signout", signOut);
userRoutes.get("/profile", validateAuth, getProfile);

export default userRoutes;
