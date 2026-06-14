"use client"

import { type ReactNode } from "react"
import { Hash, Volume2 } from "lucide-react"
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type Tab = "overview" | "permissions" | "invites"

type ChannelSettingsSidebarProps = Readonly<{
  channelType: "TEXT" | "VOICE"
  editedName: string
  tab: Tab
  onTabChange: (tab: Tab) => void
  children: ReactNode
}>

export function ChannelSettingsSidebar({
  channelType,
  editedName,
  tab,
  onTabChange,
  children,
}: ChannelSettingsSidebarProps) {
  const Icon = channelType === "TEXT" ? Hash : Volume2

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r">
      <div className="flex items-center gap-2 px-4 py-4">
        <Icon className="size-4 text-muted-foreground" />
        <span className="truncate text-sm font-semibold">{editedName}</span>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Channel Settings</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive={tab === "overview"} onClick={() => onTabChange("overview")}>
                Overview
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton isActive={tab === "permissions"} onClick={() => onTabChange("permissions")}>
                Permissions
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton isActive={tab === "invites"} onClick={() => onTabChange("invites")}>
                Invites
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <div className="mt-auto border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            {children}
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </aside>
  )
}
