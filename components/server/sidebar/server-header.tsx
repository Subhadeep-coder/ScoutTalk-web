"use client"

import { Bell, ChevronDown, FolderPlus, LogOut, Plus, Settings, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CreateChannelDialog } from "@/components/server/sidebar/create-channel-dialog"
import { CreateCategoryDialog } from "@/components/server/sidebar/create-category-dialog"
import { InviteDialog } from "@/components/server/sidebar/invite-dialog"
import { ServerSettingsDialog } from "@/components/server/settings/server/server-settings-dialog"
import { useActiveServerStore } from "@/lib/stores/active-server-store"
import { usePermissions } from "@/lib/hooks/use-permissions"

type ServerHeaderProps = Readonly<{
  serverName: string
  onCreated?: () => void
}>

export function ServerHeader({ serverName, onCreated }: ServerHeaderProps) {
  const activeServer = useActiveServerStore((s) => s.activeServer)
  const categories = activeServer?.categories ?? []
  const serverId = activeServer?.id ?? ""
  const { can } = usePermissions()
  const canManage = can("MANAGE_CHANNELS")
  const canManageGuild = can("MANAGE_GUILD")
  const canInvite = can("CREATE_INSTANT_INVITE")
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="group flex h-14 w-full shrink-0 items-center justify-between gap-2 border-b px-4 font-semibold text-base"
          >
            <span className="truncate">{serverName}</span>
            <ChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="center" sideOffset={4} className="w-64">
          {canInvite && (
            <InviteDialog serverId={serverId}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <UserPlus className="size-5" />
                Invite People
              </DropdownMenuItem>
            </InviteDialog>
          )}
          {canManage && (
            <>
              <DropdownMenuSeparator />
              <CreateChannelDialog categoryName="" serverId={serverId} categories={categories} onCreated={onCreated}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Plus className="size-5" />
                  Create Channel
                </DropdownMenuItem>
              </CreateChannelDialog>
              <CreateCategoryDialog onCreated={onCreated}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <FolderPlus className="size-5" />
                  Create Category
                </DropdownMenuItem>
              </CreateCategoryDialog>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Bell className="size-5" />
            Notification Settings
          </DropdownMenuItem>
          {canManageGuild && (
            <ServerSettingsDialog serverName={serverName}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Settings className="size-5" />
                Server Settings
              </DropdownMenuItem>
            </ServerSettingsDialog>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <LogOut className="size-5" />
            Leave Server
          </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
    </>)
}
