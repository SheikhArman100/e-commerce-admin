'use client'

import { axiosPublic } from "@/lib/axios"
import { useAuthStore } from "@/stores/authStore"






const useUpdatedToken = () => {
  const setAccessToken = useAuthStore((state: any) => state.setAccessToken)

  const update = async () => {
    const response = await axiosPublic.get('/auth/token', {
      withCredentials: true
    })

    setAccessToken(response.data.data.accessToken)
    return response.data.data.accessToken
  }
  return update
}

export default useUpdatedToken