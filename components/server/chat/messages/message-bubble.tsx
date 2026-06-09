"use client"

import type { Message } from "@/lib/services/messages"
import MessageAvatar from "./message-avatar"

type MessageBubbleProps = Readonly<{
  message: Message
}>

export default function MessageBubble({ message }: MessageBubbleProps) {
  const { author } = message
  const displayName = author.displayName || `${author.firstName} ${author.lastName}`
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="flex items-start gap-3 rounded-lg px-2 py-1.5 hover:bg-muted/50">
      <MessageAvatar avatar={author.avatar} firstName={author.firstName} lastName={author.lastName} />
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium hover:underline cursor-pointer">
            {displayName}
          </span>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  )
}
