import { create } from "zustand"
import { getMessages, sendMessage, type Message, type AttachmentData } from "@/lib/services/messages"

type MessageStore = {
  messagesByChannel: Record<string, Message[]>
  loading: boolean
  error: string | null
  fetchMessages: (channelId: string) => Promise<void>
  sendAndRefresh: (channelId: string, content: string, attachments?: AttachmentData[]) => Promise<void>
}

export const useMessageStore = create<MessageStore>((set, get) => ({
  messagesByChannel: {},
  loading: false,
  error: null,

  fetchMessages: async (channelId: string) => {
    set({ loading: true, error: null })
    try {
      const { data } = await getMessages(channelId)
      set({ messagesByChannel: { ...get().messagesByChannel, [channelId]: data }, loading: false })
    } catch {
      set({ error: "Failed to load messages", loading: false })
    }
  },

  sendAndRefresh: async (channelId: string, content: string, attachments?: AttachmentData[]) => {
    await sendMessage(channelId, content, attachments)
    await get().fetchMessages(channelId)
  },
}))
