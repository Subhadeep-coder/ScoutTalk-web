"use client"

import { useRef } from "react"
import { Paperclip } from "lucide-react"

import { Button } from "@/components/ui/button"

type AttachmentButtonProps = Readonly<{
  onFilesSelect: (files: File[]) => void
}>

export default function AttachmentButton({ onFilesSelect }: AttachmentButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (files && files.length > 0) {
      onFilesSelect(Array.from(files))
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <label>
      <input ref={inputRef} type="file" multiple className="hidden" onChange={handleChange} />
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
