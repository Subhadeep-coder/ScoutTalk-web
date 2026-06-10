"use client"

import { AppSidebar } from "@/components/app-sidebar"
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
      <AppSidebar />
      <SidebarInset className="max-h-dvh">{children}</SidebarInset>
    </SidebarProvider>
  )
}
