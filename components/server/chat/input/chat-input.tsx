"use client"

import { useState } from "react"

import AttachmentButton from "./attachment-button"
import EmojiButton from "./emoji-button"
import GifButton from "./gif-button"
import MessageInput from "./message-input"
import SendButton from "./send-button"
import { useMessageStore } from "@/lib/stores/message-store"

type ChatInputProps = Readonly<{
  channelName: string
  channelId: string
}>

export default function ChatInput({ channelName, channelId }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const sendAndRefresh = useMessageStore((s) => s.sendAndRefresh)
  const loading = useMessageStore((s) => s.loading)

  const sending = loading

  async function handleSend() {
    const trimmed = message.trim()
    if (!trimmed || sending) return

    try {
      await sendAndRefresh(channelId, trimmed)
      setMessage("")
    } catch {
      // TODO: show error toast
    }
  }

  return (
    <div className="border-t p-4">
      <div className="flex items-center gap-1.5 rounded-lg border bg-muted/50 px-3 py-1.5">
        <AttachmentButton />
        <EmojiButton onEmojiSelect={(emoji) => setMessage((prev) => prev + emoji)} />
        <GifButton onGifSelect={(url) => console.log("GIF selected:", url)} />
        <MessageInput
          channelName={channelName}
          value={message}
          onChange={setMessage}
          onSend={handleSend}
        />
        <SendButton onSend={handleSend} disabled={sending || !message.trim()} />
      </div>
    </div>
  )
}
