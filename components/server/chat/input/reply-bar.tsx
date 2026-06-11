"use client"

import { Reply, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useReplyStore } from "@/lib/stores/reply-store"

export default function ReplyBar() {
  const replyTo = useReplyStore((s) => s.replyTo)
  const clearReply = useReplyStore((s) => s.clearReply)

  if (!replyTo) return null

  return (
    <div className="flex items-center gap-2 border-l-4 border-primary bg-muted/50 px-3 py-1.5 text-sm">
      <Reply className="size-4 shrink-0 text-primary" />
      <div className="flex min-w-0 flex-1 items-center gap-1.5">
        <span className="shrink-0 font-medium text-primary">{replyTo.authorName}</span>
        <span className="truncate text-muted-foreground">
          {replyTo.content ?? "Attachment"}
        </span>
      </div>
      <Button variant="ghost" size="icon-xs" onClick={clearReply}>
        <X />
      </Button>
    </div>
  )
}
