"use client"

import { useState } from "react"
import Image from "next/image"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Message } from "@/lib/services/messages"
import { deleteAttachment } from "@/lib/services/messages"
import { useMessageStore } from "@/lib/stores/message-store"
import MessageAvatar from "./message-avatar"
import MessageActions from "./message-actions"
import ImagePreviewDialog from "./image-preview-dialog"

type MessageBubbleProps = Readonly<{
  message: Message
}>

export default function MessageBubble({ message }: MessageBubbleProps) {
  const { author } = message
  const [preview, setPreview] = useState<{ url: string; name: string } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const fetchMessages = useMessageStore((s) => s.fetchMessages)
  const displayName = author.displayName || `${author.firstName} ${author.lastName}`
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
  const attachments = message.attachments

  return (
    <div className="group relative flex items-start gap-3 rounded-lg px-2 py-1.5 hover:bg-muted/50">
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
              <div
                key={i}
                className={`group/image relative overflow-hidden rounded-lg ${attachments.length === 3 && i === 0 ? "row-span-2" : "aspect-square"}`}
              >
                <button
                  type="button"
                  className="size-full"
                  onClick={() => setPreview({ url: att.url, name: att.name })}
                >
                  <Image
                    src={att.url}
                    alt={att.name}
                    width={400}
                    height={400}
                    unoptimized
                    className="size-full cursor-pointer object-cover transition-opacity group-hover/image:opacity-80"
                  />
                </button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="absolute right-1 top-1 z-10 text-destructive opacity-0 transition-opacity hover:scale-110 hover:text-destructive group-hover/image:opacity-100"
                  onClick={() => setDeleteTarget(att.url)}
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      <MessageActions
        channelId={message.channelId}
        messageId={message.id}
        authorId={message.authorId}
        authorName={displayName}
        content={message.content}
      />
      <ImagePreviewDialog
        url={preview?.url ?? null}
        name={preview?.name ?? ""}
        open={!!preview}
        onOpenChange={(open) => { if (!open) setPreview(null) }}
      />
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove attachment</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this attachment?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!deleteTarget) return
                try {
                  await deleteAttachment(message.channelId, message.id, deleteTarget)
                  toast.success("Attachment removed")
                  fetchMessages(message.channelId)
                } catch {
                  toast.error("Failed to remove attachment")
                }
                setDeleteTarget(null)
              }}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
