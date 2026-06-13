"use client"

import { FileText, Loader2, Pen, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import EditAttachmentDialog from "./edit-attachment-dialog"
import type { AttachmentData } from "@/lib/services/messages"

type FilePreviewProps = Readonly<{
  fileName: string
  fileType: string
  loading: boolean
  previewUrl: string | null
  attachment: AttachmentData | null
  onRemove: () => void
  onSave: (updated: AttachmentData) => void
}>

export default function FilePreview({ fileName, fileType, loading, previewUrl, attachment, onRemove, onSave }: FilePreviewProps) {
  const isImage = fileType.startsWith("image/")

  return (
    <div className="relative w-fit rounded-lg border bg-muted/30">
      <div className="size-32">
        {loading ? (
          <div className="flex size-full items-center justify-center rounded-lg bg-muted">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : isImage && previewUrl ? (
          <img
            src={previewUrl}
            alt={fileName}
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
        {attachment && (
          <EditAttachmentDialog attachment={attachment} onSave={onSave}>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-5 rounded-full bg-background shadow hover:bg-muted"
            >
              <Pen className="size-3" />
            </Button>
          </EditAttachmentDialog>
        )}
      </div>
    </div>
  )
}
