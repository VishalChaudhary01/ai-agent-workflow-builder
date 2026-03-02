import API from "./axios-client";
import type { SignInInput, SignUpInput } from "@/validators/user";
import type { CreateWorkflowType } from "@/validators/workflow";

export const signupMutationFn = async (input: SignUpInput): Promise<any> => {
  const res = await API.post("/user/signup", input);
  return res.data;
};

export const signinMutationFn = async (input: SignInInput): Promise<any> => {
  const res = await API.post("/user/signin", input);
  return res.data;
};

export const signoutMutationFn = async (): Promise<any> => {
  const res = await API.post("/user.signout");
  return res.data;
};

export const profileQueryFn = async (): Promise<any> => {
  const res = await API.get("/user/profile");
  return res.data;
};

export const createWorkflowMutationFn = async (
  input: CreateWorkflowType,
): Promise<any> => {
  const res = await API.post("/workflow", input);
  return res.data;
};

export const getAllWorkflowsQueryFn = async (): Promise<any> => {
  const res = await API.get("/workflow");
  return res.data;
};

export const getWorkflowByIdQueryFn = async (id: string): Promise<any> => {
  const res = await API.get(`/workflow/:${id}`);
  return res.data;
};
