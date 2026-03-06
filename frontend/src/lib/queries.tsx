import { useQuery } from "@tanstack/react-query";
import {
  getAllWorkflowsQueryFn,
  getWorkflowByIdQueryFn,
  profileQueryFn,
} from "./api-functions";

export const useProfileQuery = () => {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: profileQueryFn,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAllWorkflowsQuery = () => {
  return useQuery({
    queryKey: ["workflows"],
    queryFn: getAllWorkflowsQueryFn,
    staleTime: 100,
  });
};

export const useWorkflowQuery = (id: string) => {
  return useQuery({
    queryKey: ["workflow", id],
    queryFn: () => getWorkflowByIdQueryFn(id),
    retry: 2,
    enabled: !!id,
  });
};
