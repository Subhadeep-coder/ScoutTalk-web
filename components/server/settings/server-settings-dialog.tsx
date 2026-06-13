"use client"

import { useState, type ReactNode } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type ServerSettingsDialogProps = Readonly<{
  children: ReactNode
  serverName: string
}>

export function ServerSettingsDialog({ children, serverName }: ServerSettingsDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
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
