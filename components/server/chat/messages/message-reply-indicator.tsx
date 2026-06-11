"use client"

import { useCallback, useMemo } from "react"
import { Reply } from "lucide-react"

import { useMessageStore } from "@/lib/stores/message-store"

type MessageReplyIndicatorProps = Readonly<{
  parentId: string
  channelId: string
}>

export default function MessageReplyIndicator({ parentId, channelId }: MessageReplyIndicatorProps) {
  const messages = useMessageStore((s) => s.messagesByChannel[channelId])

  const parent = useMemo(() => messages?.find((m) => m.id === parentId), [messages, parentId])

  const handleClick = useCallback(() => {
    const el = document.getElementById(`message-${parentId}`)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" })
      el.classList.add("ring-2", "ring-primary", "rounded-lg")
      setTimeout(() => {
        el.classList.remove("ring-2", "ring-primary", "rounded-lg")
      }, 1000)
    }
  }, [parentId])

  if (!parent) return null

  const parentName = parent.author.displayName || `${parent.author.firstName} ${parent.author.lastName}`
  const preview = parent.content ?? "Attachment"

  return (
    <button type="button" className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground text-left cursor-pointer hover:text-foreground" onClick={handleClick}>
      <Reply className="size-3 shrink-0" />
      <span className="truncate">
        <span className="font-medium text-primary">{parentName}</span>
        <span className="ml-1">{preview}</span>
      </span>
    </button>
  )
}
