
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (accessToken: string) => set({ accessToken: accessToken })
    }),
    {
      name: 'EcommerceJwt'
    }
  )
)
