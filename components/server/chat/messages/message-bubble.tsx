"use client"

import { useState, useRef } from "react"
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
import { deleteAttachment, updateMessage } from "@/lib/services/messages"
import { useMessageStore } from "@/lib/stores/message-store"
import MessageAvatar from "./message-avatar"
import MessageActions from "./message-actions"
import MessageAuthorInfo from "./message-author"
import MessageEditInput from "./message-edit-input"
import MessageReplyIndicator from "./message-reply-indicator"
import ImagePreviewDialog from "./image-preview-dialog"

type MessageBubbleProps = Readonly<{
  message: Message
}>

export default function MessageBubble({ message }: MessageBubbleProps) {
  const { author } = message
  const [preview, setPreview] = useState<{ url: string; name: string } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(message.content ?? "")
  const inputRef = useRef<HTMLInputElement>(null)
  const fetchMessages = useMessageStore((s) => s.fetchMessages)
  const displayName = author.displayName || `${author.firstName} ${author.lastName}`
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
  const attachments = message.attachments

  function handleStartEdit() {
    setEditText(message.content ?? "")
    setIsEditing(true)
  }

  async function handleSaveEdit() {
    const trimmed = editText.trim()
    if (!trimmed) return
    try {
      await updateMessage(message.id, trimmed)
      setIsEditing(false)
      fetchMessages(message.channelId)
    } catch {
      toast.error("Failed to edit message")
    }
  }

  function handleCancelEdit() {
    setIsEditing(false)
    setEditText(message.content ?? "")
  }

  function handleEditKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleSaveEdit()
    } else if (e.key === "Escape") {
      handleCancelEdit()
    }
  }

  return (
    <div id={`message-${message.id}`} className="group relative rounded-lg px-2 py-1.5 hover:bg-muted/50">
      <div className="grid grid-cols-[auto_1fr] gap-x-3 items-start">
        {message.parentId && (
          <>
            <div />
            <div className="mb-0.5">
              <MessageReplyIndicator parentId={message.parentId} channelId={message.channelId} />
            </div>
          </>
        )}
        <MessageAvatar avatar={author.avatar} firstName={author.firstName} lastName={author.lastName} />
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <MessageAuthorInfo author={author} displayName={displayName} />
            <span className="text-xs text-muted-foreground">{time}</span>
          </div>
          {isEditing ? (
            <MessageEditInput
              value={editText}
              inputRef={inputRef}
              onChange={setEditText}
              onKeyDown={handleEditKeyDown}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
            />
          ) : (
            message.content && <p className="text-sm">
              {message.content}
              {message.isEdited && <span className="ml-1 text-xs text-muted-foreground">(edited)</span>}
            </p>
          )}
          {attachments && attachments.length > 0 && (
            <div className="flex items-end gap-2">
              <div className={`grid gap-1 max-w-sm w-full ${attachments.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
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
            {!isEditing && message.isEdited && !message.content && (
              <span className="shrink-0 text-xs text-muted-foreground">(edited)</span>
            )}
          </div>
          )}
        </div>
        {!isEditing && (
          <MessageActions
            channelId={message.channelId}
            messageId={message.id}
            authorId={message.authorId}
            authorName={displayName}
            content={message.content}
            onEdit={handleStartEdit}
          />
        )}
      </div>
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
                  await deleteAttachment(message.id, deleteTarget)
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
