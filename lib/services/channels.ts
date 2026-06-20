import apiClient from "@/lib/api-client"

export type PermissionOverride = {
  id: string
  channelId: string
  roleId: string | null
  memberId: string | null
  allow: string
  deny: string
}

export function createChannel(data: {
  name: string
  serverId: string
  categoryId: string
  type: "TEXT" | "VOICE"
}) {
  return apiClient.post("/channels", data)
}

export function reorderChannels(data: {
  serverId: string
  categoryId: string
  order: string[]
}) {
  return apiClient.patch("/channels/reorder", data)
}

export function deleteChannel(channelId: string) {
  return apiClient.delete(`/channels/${channelId}`)
}

export function updateChannel(channelId: string, data: { name: string }) {
  return apiClient.patch(`/channels/${channelId}`, data)
}

export function getChannelPermissionOverrides(channelId: string) {
  return apiClient.get<PermissionOverride[]>(`/channels/${channelId}/permissions`)
}

export function upsertRolePermissionOverride(
  channelId: string,
  roleId: string,
  data: { allow: string; deny: string },
) {
  return apiClient.put<PermissionOverride>(`/channels/${channelId}/permissions/roles/${roleId}`, data)
}

export function deleteRolePermissionOverride(channelId: string, roleId: string) {
  return apiClient.delete(`/channels/${channelId}/permissions/roles/${roleId}`)
}

export function upsertMemberPermissionOverride(
  channelId: string,
  memberId: string,
  data: { allow: string; deny: string },
) {
  return apiClient.put<PermissionOverride>(`/channels/${channelId}/permissions/members/${memberId}`, data)
}

export function deleteMemberPermissionOverride(channelId: string, memberId: string) {
  return apiClient.delete(`/channels/${channelId}/permissions/members/${memberId}`)
}
