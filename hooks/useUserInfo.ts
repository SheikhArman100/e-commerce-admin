"use client"


import { axiosPublic } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";


const useUserInfo = () => {

  return useQuery({
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