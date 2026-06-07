import axios from "axios"
import { useAuthStore } from "@/lib/stores/auth-store"

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
})

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = useAuthStore.getState().refreshToken
      if (!refreshToken) {
        useAuthStore.getState().logout()
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refresh_token: refreshToken },
        )

        useAuthStore.getState().setTokens(data.access_token, data.refresh_token)
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`
        return apiClient(originalRequest)
      } catch {
        useAuthStore.getState().logout()
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
)

export function setAuthTokens(accessToken: string, refreshToken: string) {
  useAuthStore.getState().setTokens(accessToken, refreshToken)
}

export default apiClient
