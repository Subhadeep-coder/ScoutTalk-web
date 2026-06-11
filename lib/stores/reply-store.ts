import { create } from "zustand"

type ReplyTarget = {
  messageId: string
  authorName: string
  content: string | null
}

type ReplyStore = {
  replyTo: ReplyTarget | null
  setReplyTo: (target: ReplyTarget) => void
  clearReply: () => void
}

export const useReplyStore = create<ReplyStore>((set) => ({
  replyTo: null,
  setReplyTo: (replyTo) => set({ replyTo }),
  clearReply: () => set({ replyTo: null }),
}))
