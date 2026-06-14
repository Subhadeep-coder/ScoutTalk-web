"use client"

import { useState, type ReactNode } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type DeleteChannelDialogProps = Readonly<{
  children: ReactNode
  channelName: string
  onConfirmDelete: () => Promise<void>
}>

export function DeleteChannelDialog({
  children,
  channelName,
  onConfirmDelete,
}: DeleteChannelDialogProps) {
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      await onConfirmDelete()
      setOpen(false)
    } catch {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Delete Channel</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete <span className="font-semibold text-foreground">#{channelName}</span>? This
          cannot be undone.
        </DialogDescription>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            {deleting && <Loader2 className="size-4 animate-spin" />}
            Delete Channel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
