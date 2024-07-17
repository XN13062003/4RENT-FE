import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ISkills } from "../@types/skills.type";
import http from "@/app/utils/http";

const QUERY_KEY = "SkillsQuery";

export const useGetListSkills = (options?: Partial<UseQueryOptions>) => {
  return useQuery({
    queryKey: [QUERY_KEY, "get-all"],
    queryFn: () => http.getWithAutoRefreshToken("/api/skills/getAllSkills", { useAccessToken: false }),
    select(data) {
      return data;
    },
    enabled: options?.enabled,
  });
};