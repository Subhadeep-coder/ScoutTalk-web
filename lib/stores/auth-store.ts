import { create } from "zustand"

export type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  displayName: string
  username: string
  needsOnboarding: boolean
} | null

type AuthState = {
  user: User
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  hydrate: () => void
  setAuth: (user: User, accessToken: string, refreshToken: string) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  setUser: (user: User) => void
  logout: () => void
}

function load(key: string): string | null {
  if (typeof window === "undefined") return null
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function setAuthCookie(value: string) {
  document.cookie = `accessToken=${value}; path=/; max-age=604800; samesite=lax`
}

function clearAuthCookie() {
  document.cookie = "accessToken=; path=/; max-age=0"
}

const initialAccessToken = load("accessToken")
const initialRefreshToken = load("refreshToken")

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: initialAccessToken,
  refreshToken: initialRefreshToken,
  isAuthenticated: !!initialAccessToken,
  hydrate: () => {
    const accessToken = load("accessToken")
    const refreshToken = load("refreshToken")
    if (accessToken && refreshToken) {
      setAuthCookie(accessToken)
      set({ accessToken, refreshToken, isAuthenticated: true })
    }
  },
  setUser: (user) => set({ user }),
  setAuth: (user, accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken)
    localStorage.setItem("refreshToken", refreshToken)
    setAuthCookie(accessToken)
    set({ user, accessToken, refreshToken, isAuthenticated: true })
  },
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken)
    localStorage.setItem("refreshToken", refreshToken)
    setAuthCookie(accessToken)
    set({ accessToken, refreshToken })
  },
  logout: () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    clearAuthCookie()
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false })
  },
}))
