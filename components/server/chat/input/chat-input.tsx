"use client"

import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import AttachmentButton from "./attachment-button"
import EmojiButton from "./emoji-button"
import FilePreview from "./file-preview"
import GifButton from "./gif-button"
import MessageInput from "./message-input"
import ReplyBar from "./reply-bar"
import SendButton from "./send-button"
import { uploadAttachment, type AttachmentData } from "@/lib/services/messages"
import { useMessageStore } from "@/lib/stores/message-store"
import { useReplyStore } from "@/lib/stores/reply-store"
import { startTyping, stopTyping } from "@/lib/socket"

const TYPING_THROTTLE = 3000
const IDLE_TIMEOUT = 4000

type ChatInputProps = Readonly<{
  channelName: string
  channelId: string
  serverId: string
}>

export default function ChatInput({ channelName, channelId, serverId }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const lastTypingEmit = useRef(0)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [attachments, setAttachments] = useState<AttachmentData[]>([])
  const replyTo = useReplyStore((s) => s.replyTo)
  const clearReply = useReplyStore((s) => s.clearReply)
  const sendMessageAction = useMessageStore((s) => s.sendMessage)
  const loading = useMessageStore((s) => s.loading)

  const sending = loading

  const channelRef = useRef({ channelId, serverId })

  useEffect(() => {
    channelRef.current = { channelId, serverId }
  }, [channelId, serverId])

  function clearIdleTimer() {
    if (idleTimer.current !== null) {
      clearTimeout(idleTimer.current)
      idleTimer.current = null
    }
  }

  function emitStopTyping() {
    clearIdleTimer()
    stopTyping(channelId, serverId)
  }

  useEffect(() => {
    return () => {
      clearIdleTimer()
      const { channelId: cid, serverId: sid } = channelRef.current
      stopTyping(cid, sid)
    }
  }, [])

  function handleMessageChange(value: string) {
    setMessage(value)

    if (value) {
      const now = Date.now()
      if (now - lastTypingEmit.current > TYPING_THROTTLE) {
        lastTypingEmit.current = now
        startTyping(channelId, serverId)
      }

      clearIdleTimer()
      idleTimer.current = setTimeout(() => {
        emitStopTyping()
      }, IDLE_TIMEOUT)
    } else {
      emitStopTyping()
    }
  }

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

  function handleSaveAttachment(updated: AttachmentData) {
    setAttachments((prev) => prev.map((a) => (a.url === updated.url ? updated : a)))
  }

  async function handleSend() {
    if (sending) return
    const trimmed = message.trim()
    if (!trimmed && attachments.length === 0) return

    emitStopTyping()
    try {
      await sendMessageAction(channelId, trimmed, attachments.length > 0 ? attachments : undefined, replyTo?.messageId)
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
                onSave={handleSaveAttachment}
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
            onChange={handleMessageChange}
            onSend={handleSend}
          />
          <SendButton onSend={handleSend} disabled={sending || (!message.trim() && attachments.length === 0)} />
        </div>
      </div>
    </div>
  )
}
