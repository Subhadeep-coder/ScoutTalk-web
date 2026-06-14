import apiClient from "@/lib/api-client"

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
