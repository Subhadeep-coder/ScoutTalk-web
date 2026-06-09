"use client"

import { useState } from "react"
import { Image } from "lucide-react"

import { Button } from "@/components/ui/button"
import { GifPicker } from "@/components/server/gif-picker"

type GifButtonProps = Readonly<{
  onGifSelect: (url: string) => void
}>

export default function GifButton({ onGifSelect }: GifButtonProps) {
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
        <Image className="size-4" />
      </Button>
      {open && (
        <div className="absolute bottom-14 left-0 z-50">
          <GifPicker
            onSelect={(url) => {
              onGifSelect(url)
              setOpen(false)
            }}
            onClose={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  )
}
