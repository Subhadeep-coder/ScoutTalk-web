"use client"

import type { KeyboardEvent } from "react"

import { Input } from "@/components/ui/input"

type MessageInputProps = Readonly<{
  channelName: string
  value: string
  onChange: (value: string) => void
  onSend: () => void
}>

export default function MessageInput({ channelName, value, onChange, onSend }: MessageInputProps) {
  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <Input
      placeholder={`Message #${channelName}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      className="border-0 bg-transparent shadow-none focus-visible:ring-0"
    />
  )
}
