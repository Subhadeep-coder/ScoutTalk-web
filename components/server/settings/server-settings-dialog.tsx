"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type ServerSettingsDialogProps = Readonly<{
  open: boolean
  onOpenChange: (open: boolean) => void
  serverName: string
}>

export function ServerSettingsDialog({ open, onOpenChange, serverName }: ServerSettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{serverName} Settings</DialogTitle>
          <DialogDescription>
            Manage your server settings.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
