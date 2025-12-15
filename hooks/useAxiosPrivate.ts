'use client'

import { useEffect } from 'react'


import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { axiosPrivate } from '@/lib/axios'
import useUpdatedToken from './useUpdatedToken'
import { useAuthStore } from '@/stores/authStore'


const useAxiosPrivate = () => {
  const update = useUpdatedToken()
  const accessToken = useAuthStore((state: any) => state.accessToken)
  const setAccessToken = useAuthStore((state: any) => state.setAccessToken)
  const queryClient=useQueryClient()
  const router=useRouter()

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      config => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${accessToken}`
        }
        return config
      },
      error => Promise.reject(error)
    )

    const responseIntercept = axiosPrivate.interceptors.response.use(
      response => response,
      async error => {
        const prevRequest = error?.config
        const errorMessage = error?.response?.data?.message || ''

        // 401 Unauthorized → Sign out immediately
        if (error?.response?.status === 401) {
          setAccessToken(null)
          queryClient.removeQueries();
          router.push("/auth/signin");
          return Promise.reject(error)
        }

        // 403 Forbidden
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          // Check if it's specifically a token expiration
          if (errorMessage === 'Token has expired' || errorMessage === 'Invalid token format'  || errorMessage.toLowerCase().includes('expired')) {
            prevRequest.sent = true

            try {
              const newAccessToken = await update()

              if (!newAccessToken) {
                // Refresh failed, sign out
                setAccessToken(null)
                queryClient.removeQueries();
                router.push("/auth/signin");
                return Promise.reject(error)
              }

              prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
              return axiosPrivate(prevRequest)
            } catch (refreshError) {
              // Refresh token failed or expired, sign out
              setAccessToken(null)
              queryClient.removeQueries();
              router.push("/auth/signin");
              return Promise.reject(refreshError)
            }
          }

          // If it's "Insufficient permissions", don't refresh
          // Just reject and let the component handle it
          return Promise.reject(error)
        }

        return Promise.reject(error)
      }
    )

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept)
      axiosPrivate.interceptors.response.eject(responseIntercept)
    }
  }, [accessToken, update, setAccessToken, queryClient, router])

  return axiosPrivate
}

export default useAxiosPrivate