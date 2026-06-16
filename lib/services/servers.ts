import apiClient from "@/lib/api-client"

export function getServers() {
  return apiClient.get("/servers")
}

export function createServer(name: string) {
  return apiClient.post("/servers", { name })
}

export function getServer(serverId: string) {
  return apiClient.get(`/servers/${serverId}`)
}

export function uploadServerAvatar(serverId: string, file: File) {
  const formData = new FormData()
  formData.append("file", file)
  return apiClient.post(`/servers/${serverId}/avatar`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
}

export function updateServer(serverId: string, data: { name?: string; description?: string | null; avatar?: string | null; banner?: string | null }) {
  return apiClient.patch(`/servers/${serverId}`, data)
}

export function uploadServerBanner(serverId: string, file: File) {
  const formData = new FormData()
  formData.append("file", file)
  return apiClient.post(`/servers/${serverId}/banner`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
}

export function getServerSettings(serverId: string) {
  return apiClient.get(`/servers/${serverId}/settings`)
}

export function updateServerSettings(serverId: string, data: Record<string, unknown>) {
  return apiClient.patch(`/servers/${serverId}/settings`, data)
}

export function getWelcomeMessages(serverId: string) {
  return apiClient.get(`/servers/${serverId}/welcome-messages`)
}

export function createWelcomeMessage(serverId: string, data: { content: string; isEnabled: boolean; displayOrder: number }) {
  return apiClient.post(`/servers/${serverId}/welcome-messages`, data)
}

export function updateWelcomeMessage(serverId: string, messageId: string, data: { content?: string; isEnabled?: boolean; displayOrder?: number | null }) {
  return apiClient.patch(`/servers/${serverId}/welcome-messages/${messageId}`, data)
}

export function deleteWelcomeMessage(serverId: string, messageId: string) {
  return apiClient.delete(`/servers/${serverId}/welcome-messages/${messageId}`)
}

export function getRoles(serverId: string) {
  return apiClient.get(`/servers/${serverId}/roles`)
}

export function createRole(serverId: string, data: { name: string; color?: string; mentionable?: boolean }) {
  return apiClient.post(`/servers/${serverId}/roles`, data)
}

export function updateRole(serverId: string, roleId: string, data: { name?: string; color?: string; permissions?: string; mentionable?: boolean }) {
  return apiClient.patch(`/servers/${serverId}/roles/${roleId}`, data)
}

export function deleteRole(serverId: string, roleId: string) {
  return apiClient.delete(`/servers/${serverId}/roles/${roleId}`)
}

export function reorderRoles(serverId: string, data: { order: string[] }) {
  return apiClient.patch(`/servers/${serverId}/roles/reorder`, data)
}

export function getRoleMembers(serverId: string, roleId: string) {
  return apiClient.get(`/servers/${serverId}/roles/${roleId}/members`)
}

export function getServerMembers(serverId: string) {
  return apiClient.get(`/servers/${serverId}/members`)
}

export function addRoleMembers(serverId: string, roleId: string, data: { memberIds: string[] }) {
  return apiClient.post(`/servers/${serverId}/roles/${roleId}/members`, data)
}
