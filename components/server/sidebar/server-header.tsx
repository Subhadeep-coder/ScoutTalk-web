"use client"

import { ChevronDown, LogOut, Plus, Settings, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ServerSettingsDialog } from "@/components/server/settings/server-settings-dialog"

type ServerHeaderProps = Readonly<{
  serverName: string
}>

export function ServerHeader({ serverName }: ServerHeaderProps) {
  return (
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
        <DropdownMenuItem>
          <UserPlus className="size-5" />
          Invite People
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <ServerSettingsDialog serverName={serverName}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Settings className="size-5" />
            Server Settings
          </DropdownMenuItem>
        </ServerSettingsDialog>
        <DropdownMenuItem>
          <Plus className="size-5" />
          Create Channel
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <LogOut className="size-5" />
          Leave Server
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
