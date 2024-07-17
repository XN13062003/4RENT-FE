import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { IBusiness } from "../@types/business.type";
import http from "@/app/utils/http";

const QUERY_KEY = "BusinessQuery";

export const useGetListBusiness = (options?: Partial<UseQueryOptions>) => {
  return useQuery({
    queryKey: [QUERY_KEY, "get-all"],
    queryFn: () => http.getWithAutoRefreshToken("/api/business", { useAccessToken: false }),
    select(data) {
      return data;
    },
    enabled: options?.enabled,
  });
};