"use client"

import { useState } from "react"
import Image from "next/image"

import type { Message } from "@/lib/services/messages"
import MessageAvatar from "./message-avatar"
import ImagePreviewDialog from "./image-preview-dialog"

type MessageBubbleProps = Readonly<{
  message: Message
}>

export default function MessageBubble({ message }: MessageBubbleProps) {
  const { author } = message
  const [preview, setPreview] = useState<{ url: string; name: string } | null>(null)
  const displayName = author.displayName || `${author.firstName} ${author.lastName}`
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
  const attachments = message.attachments

  return (
    <div className="flex items-start gap-3 rounded-lg px-2 py-1.5 hover:bg-muted/50">
      <MessageAvatar avatar={author.avatar} firstName={author.firstName} lastName={author.lastName} />
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium hover:underline cursor-pointer">
            {displayName}
          </span>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
        {message.content && <p className="text-sm">{message.content}</p>}
        {attachments && attachments.length > 0 && (
          <div className={`grid gap-1 max-w-sm ${attachments.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
            {attachments.map((att, i) => (
              <button
                key={i}
                type="button"
                className={`overflow-hidden rounded-lg ${attachments.length === 3 && i === 0 ? "row-span-2" : "aspect-square"}`}
                onClick={() => setPreview({ url: att.url, name: att.name })}
              >
                <Image
                  src={att.url}
                  alt={att.name}
                  width={400}
                  height={400}
                  unoptimized
                  className="size-full cursor-pointer object-cover transition-opacity hover:opacity-80"
                />
              </button>
            ))}
          </div>
        )}
      </div>
      <ImagePreviewDialog
        url={preview?.url ?? null}
        name={preview?.name ?? ""}
        open={!!preview}
        onOpenChange={(open) => { if (!open) setPreview(null) }}
      />
    </div>
  )
}
