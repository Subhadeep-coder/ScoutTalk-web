import apiClient from "@/lib/api-client"

export function getServers() {
  return apiClient.get("/servers")
}

export function createServer(name: string) {
  return apiClient.post("/servers", { name })
}

export function uploadServerAvatar(serverId: string, file: File) {
  const formData = new FormData()
  formData.append("file", file)
  return apiClient.post(`/servers/${serverId}/avatar`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
}
