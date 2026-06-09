"use client"

import EmojiPickerReact, { type EmojiClickData } from "emoji-picker-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/use-theme"

type EmojiPickerProps = Readonly<{
  onSelect: (emoji: string) => void
  onClose: () => void
}>

export function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  const { theme } = useTheme()

  return (
    <div className="flex flex-col rounded-xl border bg-popover shadow-lg">
      <div className="flex justify-end border-b p-1">
        <Button type="button" variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
      </div>
      <EmojiPickerReact
        theme={theme === "dark" ? "dark" : "light"}
        onEmojiClick={(data: EmojiClickData) => {
          onSelect(data.emoji)
          onClose()
        }}
      />
    </div>
  )
}
