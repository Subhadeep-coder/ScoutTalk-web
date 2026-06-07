import apiClient from "@/lib/api-client"

export function getProfile() {
  return apiClient.get("/users/me")
}
