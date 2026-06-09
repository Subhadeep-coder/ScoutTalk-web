"use client"

import { SendHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"

type SendButtonProps = Readonly<{
  onSend: () => void
  disabled?: boolean
}>

export default function SendButton({ onSend, disabled }: SendButtonProps) {
  return (
    <Button type="button" size="sm" onClick={onSend} disabled={disabled}>
      <SendHorizontal className="size-4" />
    </Button>
  )
}
