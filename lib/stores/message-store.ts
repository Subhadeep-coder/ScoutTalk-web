import { create } from "zustand"
import { getMessages, sendMessage, type Message } from "@/lib/services/messages"

type MessageStore = {
  messagesByChannel: Record<string, Message[]>
  loading: boolean
  error: string | null
  fetchMessages: (channelId: string) => Promise<void>
  sendAndRefresh: (channelId: string, content: string) => Promise<void>
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

  sendAndRefresh: async (channelId: string, content: string) => {
    await sendMessage(channelId, content)
    await get().fetchMessages(channelId)
  },
}))
