"use client"

import { useState } from "react"
import { toast } from "sonner"

import AttachmentButton from "./attachment-button"
import EditAttachmentDialog from "./edit-attachment-dialog"
import EmojiButton from "./emoji-button"
import FilePreview from "./file-preview"
import GifButton from "./gif-button"
import MessageInput from "./message-input"
import ReplyBar from "./reply-bar"
import SendButton from "./send-button"
import { uploadAttachment, type AttachmentData } from "@/lib/services/messages"
import { useMessageStore } from "@/lib/stores/message-store"
import { useReplyStore } from "@/lib/stores/reply-store"

type ChatInputProps = Readonly<{
  channelName: string
  channelId: string
}>

export default function ChatInput({ channelName, channelId }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [attachments, setAttachments] = useState<AttachmentData[]>([])
  const [editAttachment, setEditAttachment] = useState<AttachmentData | null>(null)
  const replyTo = useReplyStore((s) => s.replyTo)
  const clearReply = useReplyStore((s) => s.clearReply)
  const sendAndRefresh = useMessageStore((s) => s.sendAndRefresh)
  const loading = useMessageStore((s) => s.loading)

  const sending = loading

  async function handleFilesSelect(files: File[]) {
    setSelectedFiles((prev) => [...prev, ...files])
    setUploading(true)
    try {
      const { data } = await uploadAttachment(channelId, files)
      setAttachments((prev) => [...prev, ...data])
    } catch {
      setSelectedFiles((prev) => prev.slice(0, -files.length))
      toast.error("Failed to upload files")
    } finally {
      setUploading(false)
    }
  }

  function handleRemoveFile(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  function handleEditAttachment(attachment: AttachmentData) {
    setEditAttachment(attachment)
  }

  function handleSaveAttachment(updated: AttachmentData) {
    setAttachments((prev) => prev.map((a) => (a.url === updated.url ? updated : a)))
  }

  async function handleSend() {
    if (sending) return
    const trimmed = message.trim()
    if (!trimmed && attachments.length === 0) return

    try {
      await sendAndRefresh(channelId, trimmed, attachments.length > 0 ? attachments : undefined, replyTo?.messageId)
      setMessage("")
      setSelectedFiles([])
      setAttachments([])
      clearReply()
    } catch {
      toast.error("Failed to send message")
    }
  }

  return (
    <div className="border-t p-4">
      <ReplyBar />
      <div className="flex flex-col gap-2 rounded-lg border bg-muted/50 px-3 py-1.5">
        {selectedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, i) => (
              <FilePreview
                key={i}
                fileName={file.name}
                fileType={file.type}
                loading={uploading}
                previewUrl={attachments[i]?.url ?? null}
                attachment={attachments[i] ?? null}
                onRemove={() => handleRemoveFile(i)}
                onEdit={handleEditAttachment}
              />
            ))}
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <AttachmentButton onFilesSelect={handleFilesSelect} />
          <EmojiButton onEmojiSelect={(emoji) => setMessage((prev) => prev + emoji)} />
          <GifButton onGifSelect={(url) => console.log("GIF selected:", url)} />
          <MessageInput
            channelName={channelName}
            value={message}
            onChange={setMessage}
            onSend={handleSend}
          />
          <SendButton onSend={handleSend} disabled={sending || (!message.trim() && attachments.length === 0)} />
        </div>
      </div>
      {editAttachment && (
        <EditAttachmentDialog
          attachment={editAttachment}
          open={!!editAttachment}
          onOpenChange={(open) => { if (!open) setEditAttachment(null) }}
          onSave={handleSaveAttachment}
        />
      )}
    </div>
  )
}
