import { create } from "zustand"
import { getMessages, sendMessage, type Message, type AttachmentData } from "@/lib/services/messages"

type MessageStore = {
  messagesByChannel: Record<string, Message[]>
  loading: boolean
  error: string | null
  fetchMessages: (channelId: string) => Promise<void>
  sendMessage: (channelId: string, content: string, attachments?: AttachmentData[], parentId?: string) => Promise<void>
  addMessage: (message: Message) => void
  updateMessageInList: (message: Message) => void
  removeMessageFromList: (id: string, channelId: string) => void
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

  sendMessage: async (channelId: string, content: string, attachments?: AttachmentData[], parentId?: string) => {
    const { data } = await sendMessage(channelId, content, attachments, parentId)
    get().addMessage(data)
  },

  addMessage: (message) => {
    set((state) => {
      const existing = state.messagesByChannel[message.channelId] ?? []
      if (existing.some((m) => m.id === message.id)) return state
      return {
        messagesByChannel: {
          ...state.messagesByChannel,
          [message.channelId]: [...existing, message],
        },
      }
    })
  },

  updateMessageInList: (message) => {
    set((state) => {
      const existing = state.messagesByChannel[message.channelId]
      if (!existing) return state
      return {
        messagesByChannel: {
          ...state.messagesByChannel,
          [message.channelId]: existing.map((m) => (m.id === message.id ? message : m)),
        },
      }
    })
  },

  removeMessageFromList: (id, channelId) => {
    set((state) => {
      const existing = state.messagesByChannel[channelId]
      if (!existing) return state
      return {
        messagesByChannel: {
          ...state.messagesByChannel,
          [channelId]: existing.filter((m) => m.id !== id),
        },
      }
    })
  },
}))
