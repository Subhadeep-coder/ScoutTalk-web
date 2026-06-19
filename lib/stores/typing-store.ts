import { create } from "zustand"

export type TypingUser = {
  userId: string
  username: string
  displayName?: string
  avatar?: string
}

type TypingState = {
  typingByChannel: Record<string, TypingUser[]>
  setUserTyping: (channelId: string, user: TypingUser) => void
  clearUserTyping: (channelId: string, userId: string) => void
}

export const useTypingStore = create<TypingState>((set) => ({
  typingByChannel: {},

  setUserTyping: (channelId, user) => {
    set((state) => {
      const current = state.typingByChannel[channelId] ?? []
      if (current.some((u) => u.userId === user.userId)) return state
      return {
        typingByChannel: {
          ...state.typingByChannel,
          [channelId]: [...current, user],
        },
      }
    })
  },

  clearUserTyping: (channelId, userId) => {
    set((state) => {
      const current = state.typingByChannel[channelId]
      if (!current) return state
      const filtered = current.filter((u) => u.userId !== userId)
      if (filtered.length === current.length) return state
      return {
        typingByChannel: {
          ...state.typingByChannel,
          [channelId]: filtered,
        },
      }
    })
  },
}))
