"use client"

import { useEffect } from "react"
import Link from "next/link"
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
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { getServers } from "@/lib/services/servers"
import { useServerStore } from "@/lib/stores/server-store"

export function NavServers() {
  const servers = useServerStore((s) => s.servers)
  const activeServerId = useServerStore((s) => s.activeServerId)
  const setServers = useServerStore((s) => s.setServers)

  useEffect(() => {
    getServers()
      .then(({ data }) => setServers(data))
      .catch(() => {})
  }, [setServers])

  if (servers.length === 0) return null

  return (
    <>
      <SidebarGroup>
        <SidebarMenu className="gap-2">
          {servers.map((server) => {
            const isActive = server.id === activeServerId
            return (
              <SidebarMenuItem key={server.id} className="flex justify-center">
                <div
                  className={cn(
                    "absolute -left-2 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full transition-opacity",
                    isActive ? "bg-white opacity-100" : "opacity-0",
                  )}
                />
                <SidebarMenuButton tooltip={server.name} className="justify-center" asChild>
                  <Link href={`/server/${server.id}`}>
                    <Avatar className="size-10">
                      {server.avatar && <AvatarImage src={server.avatar} />}
                      <AvatarFallback className="bg-muted text-sm font-medium">
                        {server.name[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroup>
      <Separator />
    </>
  )
}
