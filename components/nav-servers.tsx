"use client"

import { useEffect, useState } from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { getServers } from "@/lib/services/servers"

type Server = {
  id: string
  name: string
  ownerId: string
  avatar?: string
  createdAt: string
}

export function NavServers() {
  const [servers, setServers] = useState<Server[]>([])

  useEffect(() => {
    getServers()
      .then(({ data }) => setServers(data))
      .catch(() => {})
  }, [])

  if (servers.length === 0) return null

  return (
    <>
      <SidebarGroup>
        <SidebarMenu className="gap-2">
          {servers.map((server) => (
            <SidebarMenuItem key={server.id} className="flex justify-center">
              <SidebarMenuButton tooltip={server.name} className="justify-center">
                <Avatar className="size-8">
                  {server.avatar && <AvatarImage src={server.avatar} />}
                  <AvatarFallback className="bg-muted text-xs font-medium">
                    {server.name[0]}
                  </AvatarFallback>
                </Avatar>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      <Separator />
    </>
  )
}
