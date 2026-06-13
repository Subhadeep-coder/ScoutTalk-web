"use client"

import { useState, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { AttachmentData } from "@/lib/services/messages"

type EditAttachmentDialogProps = Readonly<{
  children: ReactNode
  attachment: AttachmentData
  onSave: (updated: AttachmentData) => void
}>

export default function EditAttachmentDialog({ children, attachment, onSave }: EditAttachmentDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(attachment.name)

  function handleSave() {
    onSave({ ...attachment, name })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{name}</DialogTitle>
        </DialogHeader>
        <div className="flex gap-4">
          <div className="size-48 shrink-0 overflow-hidden rounded-lg border bg-muted/30">
            <img
              src={attachment.url}
              alt={attachment.name}
              className="size-full object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Type</label>
              <Input value={attachment.type} disabled className="bg-muted" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <Button type="button" size="sm" className="mt-auto self-end" onClick={handleSave} disabled={!name.trim()}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
