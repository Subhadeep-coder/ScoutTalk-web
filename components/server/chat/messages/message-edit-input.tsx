"use client"

import type { RefObject } from "react"
import { Smile } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type MessageEditInputProps = Readonly<{
  value: string
  inputRef: RefObject<HTMLInputElement | null>
  onChange: (value: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onSave: () => void
  onCancel: () => void
}>

export default function MessageEditInput({ value, inputRef, onChange, onKeyDown, onSave, onCancel }: MessageEditInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="flex-1"
          autoFocus
        />
        {/* Emoji button */}
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-foreground"
          >
            <Smile className="size-4" />
          </Button>
        </div>
      </div>
      <span className="text-xs text-muted-foreground">
        escape to{" "}
        <button type="button" className="cursor-pointer underline underline-offset-2 text-primary hover:text-primary/80" onClick={onCancel}>cancel</button>
        {" "}• enter to{" "}
        <button type="button" className="cursor-pointer underline underline-offset-2 text-primary hover:text-primary/80" onClick={onSave}>save</button>
      </span>
    </div>
  )
}
