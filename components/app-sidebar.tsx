"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import { Users } from "lucide-react"

import { CreateServerDialog } from "@/components/create-server-dialog"
import { NavServers } from "@/components/nav-servers"
import { NavUser } from "@/components/nav-user"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [serverRefreshKey, setServerRefreshKey] = useState(0)

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex justify-center">
            <SidebarMenuButton size="lg" className="justify-center" asChild>
              <Link href="/dashboard">
                <Users className="size-5" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <Separator />
      </SidebarHeader>
      <SidebarContent>
        <NavServers key={serverRefreshKey} />
        <SidebarMenu>
          <CreateServerDialog onCreated={() => setServerRefreshKey((k) => k + 1)} />
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
