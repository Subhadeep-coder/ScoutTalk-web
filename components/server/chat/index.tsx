"use client"

import { useEffect } from "react"

import ChatHeader from "./header"
import MessageList from "./messages/message-list"
import ChatInput from "./input/chat-input"
import { useMessageStore } from "@/lib/stores/message-store"

type ChatSectionProps = Readonly<{
  channelName: string
  channelId: string
}>

export default function ChatSection({ channelName, channelId }: ChatSectionProps) {
  const messages = useMessageStore((s) => s.messagesByChannel[channelId])
  const fetchMessages = useMessageStore((s) => s.fetchMessages)

  useEffect(() => {
    fetchMessages(channelId)
  }, [channelId, fetchMessages])

  return (
    <main className="flex flex-1 flex-col">
      <ChatHeader channelName={channelName} />
      <MessageList messages={messages ?? []} />
      <ChatInput channelName={channelName} channelId={channelId} />
    </main>
  )
}
