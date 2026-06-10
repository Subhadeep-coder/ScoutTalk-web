"use client"

import { useEffect, useState } from "react"
import { Download, Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type ImagePreviewDialogProps = Readonly<{
  url: string | null
  name: string
  open: boolean
  onOpenChange: (open: boolean) => void
}>

export default function ImagePreviewDialog({ url, name, open, onOpenChange }: ImagePreviewDialogProps) {
  const [scale, setScale] = useState(100)

  useEffect(() => {
    if (open) setScale(100)
  }, [open])

  function zoomIn() {
    setScale((prev) => Math.min(prev + 25, 400))
  }

  function zoomOut() {
    setScale((prev) => Math.max(prev - 25, 25))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton className="sm:max-w-[56rem] max-h-[85vh] grid-rows-[auto_1fr]">
        <DialogHeader>
          <DialogTitle className="truncate">{name}</DialogTitle>
        </DialogHeader>
        {url && (
          <div className="relative min-h-0">
            <div className="flex h-full w-full items-center justify-center overflow-auto rounded-lg bg-muted/30">
              <img
                src={url}
                alt={name}
                className="block shrink-0"
                draggable={false}
                style={{
                  width: `${scale}%`,
                  height: `${scale}%`,
                  objectFit: "contain",
                  maxWidth: "none",
                  maxHeight: "none",
                }}
              />
            </div>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-2"
              asChild
            >
              <a href={url} download={name} target="_blank" rel="noreferrer">
                <Download />
              </a>
            </Button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-background/80 px-3 py-1.5 backdrop-blur-sm">
              <Button variant="ghost" size="icon-sm" onClick={zoomOut} disabled={scale <= 25}>
                <Minus />
              </Button>
              <span className="w-10 text-center text-xs tabular-nums">{scale}%</span>
              <Button variant="ghost" size="icon-sm" onClick={zoomIn} disabled={scale >= 400}>
                <Plus />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
