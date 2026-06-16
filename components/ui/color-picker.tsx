"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ROLE_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4",
  "#3b82f6", "#8b5cf6", "#ec4899", "#78716c", "#a1a1aa",
]

type ColorPickerProps = Readonly<{
  value: string
  onChange: (color: string) => void
  size?: "sm" | "md"
}>

export function ColorPicker({ value, onChange, size = "md" }: ColorPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const swatchSize = size === "sm" ? "size-5" : "size-6"

  return (
    <div className="flex gap-1 items-center">
      {ROLE_COLORS.map((color) => (
        <Button
          key={color}
          type="button"
          variant="ghost"
          size="icon"
          className={cn("rounded-full p-0 shrink-0", swatchSize, value === color && "ring-1 ring-foreground ring-offset-1")}
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
        />
      ))}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("rounded-full p-0 overflow-hidden shrink-0", swatchSize)}
        onClick={() => inputRef.current?.click()}
      >
        <div className="size-full rounded-full bg-[conic-gradient(red,yellow,lime,cyan,blue,magenta,red)]" />
      </Button>
      <input
        ref={inputRef}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
      />
    </div>
  )
}
