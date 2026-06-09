"use client"

import { Paperclip } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function AttachmentButton() {
  return (
    <label>
      <input type="file" className="hidden" />
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
