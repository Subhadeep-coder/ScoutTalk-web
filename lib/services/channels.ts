import apiClient from "@/lib/api-client"

export function createChannel(data: {
  name: string
  serverId: string
  categoryId: string
  type: "TEXT" | "VOICE"
}) {
  return apiClient.post("/channels", data)
}
