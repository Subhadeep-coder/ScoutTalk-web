import apiClient from "@/lib/api-client"

export type MessageAuthor = {
  id: string
  username: string
  firstName: string
  lastName: string
  displayName: string | null
  avatar: string | null
}

export type Message = {
  id: string
  authorId: string
  channelId: string
  serverId: string
  parentId: string | null
  content: string
  attachments: string | null
  createdAt: string
  updatedAt: string
  author: MessageAuthor
}

export function getMessages(channelId: string) {
  return apiClient.get<Message[]>(`/channels/${channelId}/messages`)
}

export function sendMessage(channelId: string, content: string) {
  return apiClient.post(`/channels/${channelId}/messages`, { content })
}
