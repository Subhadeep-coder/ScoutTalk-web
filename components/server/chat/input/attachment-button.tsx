"use client"

import { useRef } from "react"
import { Paperclip } from "lucide-react"

import { Button } from "@/components/ui/button"

type AttachmentButtonProps = Readonly<{
  onFileSelect: (file: File) => void
}>

export default function AttachmentButton({ onFileSelect }: AttachmentButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <label>
      <input ref={inputRef} type="file" className="hidden" onChange={handleChange} />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 text-muted-foreground hover:text-foreground"
        asChild
      >
        <span>
          <Paperclip className="size-4" />
        </span>
      </Button>
    </label>
  )
}
