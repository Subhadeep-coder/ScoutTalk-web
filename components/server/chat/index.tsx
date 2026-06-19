"use client"

import { useEffect, useRef } from "react"

import ChatHeader from "./header"
import MessageList from "./messages/message-list"
import ChatInput from "./input/chat-input"
import TypingIndicator from "./typing-indicator"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useMessageStore } from "@/lib/stores/message-store"
import { useTypingStore } from "@/lib/stores/typing-store"
import { getSocket } from "@/lib/socket"

type ChatSectionProps = Readonly<{
  channelName: string
  channelId: string
  serverId: string
}>

export default function ChatSection({ channelName, channelId, serverId }: ChatSectionProps) {
  const messages = useMessageStore((s) => s.messagesByChannel[channelId])
  const fetchMessages = useMessageStore((s) => s.fetchMessages)
  const addMessage = useMessageStore((s) => s.addMessage)
  const updateMessageInList = useMessageStore((s) => s.updateMessageInList)
  const removeMessageFromList = useMessageStore((s) => s.removeMessageFromList)
  const currentUserId = useAuthStore((s) => s.user?.id)
  const setUserTyping = useTypingStore((s) => s.setUserTyping)
  const clearUserTyping = useTypingStore((s) => s.clearUserTyping)
  const typingTimeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  useEffect(() => {
    fetchMessages(channelId)
  }, [channelId, fetchMessages])

  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const onNew = (msg: { id: string; channelId: string }) => {
      if (msg.channelId === channelId) {
        addMessage(msg as Parameters<typeof addMessage>[0])
      }
    }

    const onUpdate = (msg: { id: string; channelId: string }) => {
      if (msg.channelId === channelId) {
        updateMessageInList(msg as Parameters<typeof updateMessageInList>[0])
      }
    }

    const onDelete = (payload: { id: string; channelId: string }) => {
      removeMessageFromList(payload.id, payload.channelId)
    }

    const onTyping = (payload: { userId: string; channelId: string; user: { id: string; username?: string; displayName?: string; avatar?: string } }) => {
      if (payload.channelId !== channelId || payload.userId === currentUserId) return
      setUserTyping(payload.channelId, {
        userId: payload.user.id,
        username: payload.user.username ?? "",
        displayName: payload.user.displayName,
        avatar: payload.user.avatar,
      })

      const key = payload.userId
      const existing = typingTimeouts.current.get(key)
      if (existing) clearTimeout(existing)

      const timeout = setTimeout(() => {
        clearUserTyping(payload.channelId, payload.userId)
        typingTimeouts.current.delete(key)
      }, 4000)
      typingTimeouts.current.set(key, timeout)
    }

    const onTypingStop = (payload: { userId: string; channelId: string }) => {
      if (payload.channelId !== channelId) return
      clearUserTyping(payload.channelId, payload.userId)
      const existing = typingTimeouts.current.get(payload.userId)
      if (existing) {
        clearTimeout(existing)
        typingTimeouts.current.delete(payload.userId)
      }
    }

    socket.on("message:new", onNew)
    socket.on("message:update", onUpdate)
    socket.on("message:delete", onDelete)
    socket.on("channel:typing", onTyping)
    socket.on("channel:typing:stop", onTypingStop)

    return () => {
      socket.off("message:new", onNew)
      socket.off("message:update", onUpdate)
      socket.off("message:delete", onDelete)
      socket.off("channel:typing", onTyping)
      socket.off("channel:typing:stop", onTypingStop)
      const timeouts = typingTimeouts.current
      for (const timeout of timeouts.values()) {
        clearTimeout(timeout)
      }
      timeouts.clear()
    }
  }, [channelId, addMessage, updateMessageInList, removeMessageFromList, setUserTyping, clearUserTyping, currentUserId])

  return (
    <main className="flex flex-1 flex-col">
      <ChatHeader channelName={channelName} />
      <MessageList messages={messages ?? []} />
      <TypingIndicator channelId={channelId} />
      <ChatInput channelName={channelName} channelId={channelId} serverId={serverId} />
    </main>
  )
}
