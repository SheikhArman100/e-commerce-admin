"use client"

import { axiosPublic } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { IAuthUser } from "@/types/auth.types";

interface IAuthResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: IAuthUser;
}

const useUserInfo = () => {
  return useQuery<IAuthResponse>({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await axiosPublic.get("/auth/user", {
        withCredentials: true,
      });

      return response.data;
    },
  });
};

export default useUserInfo
