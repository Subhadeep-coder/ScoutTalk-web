"use client"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const servers = [
  { name: "General" },
  { name: "Random" },
  { name: "Music" },
  { name: "Gaming" },
]

export function NavServers() {
  return (
    <SidebarGroup>
      <SidebarMenu className="gap-2">
        {servers.map((server) => (
          <SidebarMenuItem key={server.name} className="flex justify-center">
            <SidebarMenuButton tooltip={server.name} className="justify-center">
              <Avatar className="size-8">
                <AvatarFallback className="bg-muted text-xs font-medium">
                  {server.name[0]}
                </AvatarFallback>
              </Avatar>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
