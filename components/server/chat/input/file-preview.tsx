"use client"

import { useMemo } from "react"
import { FileText, Pen, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type FilePreviewProps = Readonly<{
  file: File
  onRemove: () => void
}>

export default function FilePreview({ file, onRemove }: FilePreviewProps) {
  const isImage = file.type.startsWith("image/")

  const previewUrl = useMemo(() => {
    if (isImage) return URL.createObjectURL(file)
    return null
  }, [file, isImage])

  return (
    <div className="relative w-fit rounded-lg border bg-muted/30">
      <div className="size-32">
        {isImage && previewUrl ? (
          <img
            src={previewUrl}
            alt={file.name}
            className="size-full rounded-lg object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center rounded-lg bg-muted">
            <FileText className="size-10 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="absolute -right-2 -top-2 flex flex-col gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-5 rounded-full bg-background text-destructive shadow hover:bg-destructive hover:text-destructive-foreground"
          onClick={onRemove}
        >
          <Trash2 className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-5 rounded-full bg-background shadow hover:bg-muted"
          disabled
        >
          <Pen className="size-3" />
        </Button>

      </div>
    </div>
  )
}
