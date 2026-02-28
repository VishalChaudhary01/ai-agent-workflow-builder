import { StatusCode } from "@/config/httpStatus";
import { User } from "@/models/User";
import { AppError } from "@/utils/appError";
import { SignInInput, SignUpInput } from "@/validator/user.validator";
import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Env } from "@/config/env";

export const signUp: RequestHandler = async (req, res) => {
  const data: SignUpInput = req.body;

  const user = await User.findOne({ username: data.username });
  if (user) {
    throw new AppError("Username already taken", StatusCode.CONFLICT);
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);
  const newUser = await User.create({ ...data, password: hashedPassword });

  const token = jwt.sign({ userId: newUser.id }, Env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res
    .cookie(Env.AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: Env.NODE_ENV === "production" ? true : false,
      sameSite: Env.NODE_ENV === "production" ? "none" : "lax",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      path: "/",
    })
    .status(StatusCode.CREATED)
    .json({ message: "SignUp successful" });
};

export const signIn: RequestHandler = async (req, res) => {
  const data: SignInInput = req.body;

  const user = await User.findOne({ username: data.username });
  if (!user) {
    throw new AppError("Invalid Credentials", StatusCode.BAD_REQUEST);
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid Credentials", StatusCode.BAD_REQUEST);
  }

  const token = jwt.sign({ userId: user.id }, Env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie(Env.AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: Env.NODE_ENV === "production" ? true : false,
    sameSite: Env.NODE_ENV === "production" ? "none" : "lax",
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    path: "/",
  });

  res.status(StatusCode.OK).json({ message: "SignIn successful" });
};

export const signOut: RequestHandler = async (req, res) => {
  res
    .clearCookie(Env.AUTH_COOKIE_NAME)
    .status(StatusCode.OK)
    .json({ message: "SignOut successful" });
};

export const getProfile: RequestHandler = async (req, res) => {
  if (!req.userId) {
    throw new AppError("Unauthorized", StatusCode.UNAUTHORIZED);
  }

  const user = await User.findById(req.userId)
    .select("_id name username")
    .lean();

  if (!user) {
    throw new AppError("User not found", StatusCode.NOT_FOUND);
  }

  res.status(StatusCode.OK).json({ message: "User fetch successful", user });
};
