import apiClient from "@/lib/api-client"

export type MessageAuthor = {
  id: string
  username: string
  firstName: string
  lastName: string
  displayName: string | null
  avatar: string | null
}

export type AttachmentData = {
  url: string
  type: string
  name: string
}

export type Message = {
  id: string
  authorId: string
  channelId: string
  serverId: string
  parentId: string | null
  content: string | null
  attachments: AttachmentData[] | null
  createdAt: string
  updatedAt: string
  author: MessageAuthor
}

export function getMessages(channelId: string) {
  return apiClient.get<Message[]>(`/channels/${channelId}/messages`)
}

export function sendMessage(channelId: string, content: string | null, attachments?: AttachmentData[], parentId?: string) {
  if (!content && (!attachments || attachments.length === 0)) {
    throw new Error("Message must have content or attachments")
  }
  const body: Record<string, unknown> = {}
  if (content) body.content = content
  if (attachments && attachments.length > 0) body.attachments = attachments
  if (parentId) body.parentId = parentId
  return apiClient.post(`/channels/${channelId}/messages`, body)
}

export function deleteMessage(channelId: string, messageId: string) {
  return apiClient.delete(`/channels/${channelId}/messages/${messageId}`)
}

export function deleteAttachment(channelId: string, messageId: string, url: string) {
  return apiClient.delete(`/channels/${channelId}/messages/${messageId}/attachments`, {
    data: { url },
  })
}

export function uploadAttachment(channelId: string, files: File[]) {
  const formData = new FormData()
  for (const file of files) {
    formData.append("files", file)
  }
  return apiClient.post<AttachmentData[]>(`/channels/${channelId}/attachments`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
}
