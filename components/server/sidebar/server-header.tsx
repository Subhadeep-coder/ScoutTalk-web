"use client"

import { useState } from "react"
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
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="group flex h-12 w-full shrink-0 items-center justify-between gap-2 border-b px-4 font-semibold"
          >
            <span className="truncate">{serverName}</span>
            <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="center" sideOffset={4} className="w-56">
          <DropdownMenuItem>
            <UserPlus className="size-4" />
            Invite People
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setSettingsOpen(true)}>
            <Settings className="size-4" />
            Server Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Plus className="size-4" />
            Create Channel
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <LogOut className="size-4" />
            Leave Server
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ServerSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        serverName={serverName}
      />
    </>
  )
}
