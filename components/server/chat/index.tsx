"use client"

import { useEffect } from "react"

import ChatHeader from "./header"
import MessageList from "./messages/message-list"
import ChatInput from "./input/chat-input"
import { useMessageStore } from "@/lib/stores/message-store"
import { getSocket } from "@/lib/socket"

type ChatSectionProps = Readonly<{
  channelName: string
  channelId: string
}>

export default function ChatSection({ channelName, channelId }: ChatSectionProps) {
  const messages = useMessageStore((s) => s.messagesByChannel[channelId])
  const fetchMessages = useMessageStore((s) => s.fetchMessages)
  const addMessage = useMessageStore((s) => s.addMessage)
  const updateMessageInList = useMessageStore((s) => s.updateMessageInList)
  const removeMessageFromList = useMessageStore((s) => s.removeMessageFromList)

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

    socket.on("message:new", onNew)
    socket.on("message:update", onUpdate)
    socket.on("message:delete", onDelete)

    return () => {
      socket.off("message:new", onNew)
      socket.off("message:update", onUpdate)
      socket.off("message:delete", onDelete)
    }
  }, [channelId, addMessage, updateMessageInList, removeMessageFromList])

  return (
    <main className="flex flex-1 flex-col">
      <ChatHeader channelName={channelName} />
      <MessageList messages={messages ?? []} />
      <ChatInput channelName={channelName} channelId={channelId} />
    </main>
  )
}
