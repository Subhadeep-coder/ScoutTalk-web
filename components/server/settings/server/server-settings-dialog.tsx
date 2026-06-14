"use client"

import { useState, type ReactNode } from "react"

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SidebarInset } from "@/components/ui/sidebar"
import { ServerSettingsSidebar, type ServerSettingsTab } from "@/components/server/settings/server/server-settings-sidebar"

type ServerSettingsDialogProps = Readonly<{
  children: ReactNode
  serverName: string
}>

export function ServerSettingsDialog({ children, serverName }: ServerSettingsDialogProps) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<ServerSettingsTab>("server-profile")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-[90vh] w-[90vw] !max-w-none gap-0 overflow-hidden p-0">
        <DialogTitle className="sr-only">{serverName} Settings</DialogTitle>
        <div onPointerDown={(e) => e.stopPropagation()} className="flex size-full">
          <ServerSettingsSidebar serverName={serverName} tab={tab} onTabChange={setTab} />
          <SidebarInset className="flex flex-1 items-center justify-center p-6">
            <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
              <p className="text-lg font-medium">Coming soon</p>
            </div>
          </SidebarInset>
        </div>
      </DialogContent>
    </Dialog>
  )
}
