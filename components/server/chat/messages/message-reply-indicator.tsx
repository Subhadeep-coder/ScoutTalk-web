"use client"

import { useCallback } from "react"
import { Reply } from "lucide-react"

import type { ParentMessage } from "@/lib/services/messages"

type MessageReplyIndicatorProps = Readonly<{
  parentId: string
  parent: ParentMessage | null
}>

export default function MessageReplyIndicator({ parentId, parent }: MessageReplyIndicatorProps) {
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

  if (!parent) {
    return (
      <button type="button" className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground text-left cursor-pointer hover:text-foreground" onClick={handleClick}>
        <Reply className="size-3 shrink-0" />
        <span className="italic">Original message was deleted</span>
      </button>
    )
  }

  const author = parent.author
  const parentName = author?.displayName ?? "Unknown"
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
