
import { create } from 'zustand'

interface AuthState {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
}

// In-memory access token store.
// Storing JWTs in memory (rather than localStorage) prevents token theft via XSS.
// Session persistence across page reloads is handled securely via the HttpOnly refresh token cookie.
export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  setAccessToken: (accessToken) => set({ accessToken }),
}))
