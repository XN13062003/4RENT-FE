import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { IProvinces } from "../@types/provinces.type";

const QUERY_KEY = "ProvincesQuery";

export const useGetListProvinces = (options?: Partial<UseQueryOptions>) => {
  return useQuery({
    queryKey: [QUERY_KEY, "get-all"],
    queryFn: () => axios.get<IProvinces[]>("https://provinces.open-api.vn/api/"),
    select(data) {
      return data;
    },
    enabled: options?.enabled,
  });
};