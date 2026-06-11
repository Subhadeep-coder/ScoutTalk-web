"use client"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import MessageAvatar from "./message-avatar"
import type { MessageAuthor } from "@/lib/services/messages"

type MessageAuthorProps = Readonly<{
  author: MessageAuthor
  displayName: string
}>

export default function MessageAuthorInfo({ author, displayName }: MessageAuthorProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="text-sm font-medium hover:underline cursor-pointer">
          {displayName}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="flex items-start gap-3" side="top" align="start">
        <MessageAvatar avatar={author.avatar} firstName={author.firstName} lastName={author.lastName} />
        <div>
          <p className="font-medium">{`${author.firstName} ${author.lastName}`}</p>
          <p className="text-xs text-muted-foreground">@{author.username}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
