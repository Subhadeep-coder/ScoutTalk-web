"use client"

import { AppSidebar } from "@/components/app-sidebar"
import SocketProvider from "@/components/socket-provider"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider defaultOpen={false} onOpenChange={() => {}}>
      <SocketProvider>
        <AppSidebar />
        <SidebarInset className="max-h-dvh">{children}</SidebarInset>
      </SocketProvider>
    </SidebarProvider>
  )
}
