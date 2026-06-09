"use client"

import { useState } from "react"
import { Smile } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EmojiPicker } from "@/components/server/emoji-picker"

type EmojiButtonProps = Readonly<{
  onEmojiSelect: (emoji: string) => void
}>

export default function EmojiButton({ onEmojiSelect }: EmojiButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 text-muted-foreground hover:text-foreground"
        onClick={() => setOpen(!open)}
      >
        <Smile className="size-4" />
      </Button>
      {open && (
        <div className="absolute bottom-14 left-0 z-50">
          <EmojiPicker
            onSelect={(emoji) => {
              onEmojiSelect(emoji)
              setOpen(false)
            }}
            onClose={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  )
}
