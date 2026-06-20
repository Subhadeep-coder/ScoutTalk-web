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

export type ParentMessageAuthor = {
  id: string
  displayName: string | null
  avatar: string | null
}

export type ParentMessage = {
  id: string
  authorId: string
  content: string | null
  attachments: AttachmentData[] | null
  author: ParentMessageAuthor | null
}

export type Message = {
  id: string
  authorId: string | null
  channelId: string
  serverId: string
  parentId: string | null
  parent: ParentMessage | null
  content: string | null
  attachments: AttachmentData[] | null
  isEdited: boolean
  isSystem: boolean
  systemType: "join" | "boost" | "pin" | "default" | null
  createdAt: string
  updatedAt: string
  author: MessageAuthor | null
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

export function updateMessage(messageId: string, content: string) {
  return apiClient.patch<Message>(`/messages/${messageId}`, { content })
}

export function deleteMessage(messageId: string) {
  return apiClient.delete(`/messages/${messageId}`)
}

export function deleteAttachment(messageId: string, url: string) {
  return apiClient.delete(`/messages/${messageId}/attachments`, {
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
