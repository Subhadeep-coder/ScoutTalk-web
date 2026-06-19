"use client"

import { useState, type ReactNode } from "react"

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SidebarInset } from "@/components/ui/sidebar"
import { ServerSettingsSidebar, type ServerSettingsTab } from "@/components/server/settings/server/server-settings-sidebar"
import { ServerSettingsLayout } from "@/components/server/settings/server/server-settings-layout"
import { tabMeta } from "@/components/server/settings/server/server-settings-tab-meta"
import { ServerProfileContent } from "@/components/server/settings/server/server-profile-content"
import { ServerTagContent } from "@/components/server/settings/server/server-tag-content"
import { ServerEngagementContent } from "@/components/server/settings/server/server-engagement-content"
import { ServerRolesContent } from "@/components/server/settings/server/roles/server-roles-content"
import { ServerMembersContent } from "@/components/server/settings/server/server-members-content"
import { useActiveServerStore } from "@/lib/stores/active-server-store"

type ServerSettingsDialogProps = Readonly<{
  children: ReactNode
  serverName: string
}>

export function ServerSettingsDialog({ children, serverName }: ServerSettingsDialogProps) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<ServerSettingsTab>("server-profile")
  const serverId = useActiveServerStore((s) => s.activeServer?.id)

  const meta = tabMeta[tab]

  function renderContent() {
    switch (tab) {
      case "server-profile":
        return serverId ? <ServerProfileContent serverId={serverId} /> : null
      case "server-tag":
        return <ServerTagContent />
      case "engagement":
        return serverId ? <ServerEngagementContent serverId={serverId} /> : null
      case "members":
        return serverId ? <ServerMembersContent serverId={serverId} /> : null
      case "roles":
        return serverId ? <ServerRolesContent serverId={serverId} /> : null
      default:
        return (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
              <p className="text-lg font-medium">Coming soon</p>
            </div>
          </div>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-[90vh] w-[90vw] !max-w-none gap-0 overflow-hidden p-0">
        <DialogTitle className="sr-only">{serverName} Settings</DialogTitle>
        <div onPointerDown={(e) => e.stopPropagation()} className="flex size-full">
          <ServerSettingsSidebar serverName={serverName} tab={tab} onTabChange={setTab} />
          <SidebarInset className="flex flex-1 p-0">
            <ServerSettingsLayout title={meta.title} description={meta.description}>
              {renderContent()}
            </ServerSettingsLayout>
          </SidebarInset>
        </div>
      </DialogContent>
    </Dialog>
  )
}
