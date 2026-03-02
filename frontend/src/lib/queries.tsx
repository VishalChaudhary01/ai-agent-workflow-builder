import { useQuery } from "@tanstack/react-query";
import { profileQueryFn } from "./api-functions";

export const useProfileQuery = () => {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: profileQueryFn,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};
