"use client"

import { useEffect } from "react"

import { ServerSidebar } from "@/components/server/sidebar"
import { useServerStore } from "@/lib/stores/server-store"
import { useActiveServerStore } from "@/lib/stores/active-server-store"

type ServerPageContentProps = Readonly<{
  serverId: string
  channelId: string
}>

export function ServerPageContent({ serverId, channelId }: ServerPageContentProps) {
  const activeServer = useActiveServerStore((s) => s.activeServer)
  const setActiveServerId = useServerStore((s) => s.setActiveServerId)

  useEffect(() => {
    setActiveServerId(serverId)
  }, [serverId, setActiveServerId])

  if (!activeServer || activeServer.id !== serverId) return null

  const activeChannel = activeServer.channels.find((c) => c.id === channelId)

  return (
    <div className="flex h-full">
      <ServerSidebar
        serverId={serverId}
        activeChannelId={channelId}
        serverName={activeServer.name}
        categories={activeServer.categories}
        channels={activeServer.channels}
      />
      <main className="flex flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center border-b px-4 font-medium">
          {activeChannel ? `# ${activeChannel.name}` : "Select a channel"}
        </header>
        <div className="flex flex-1 items-center justify-center text-muted-foreground">
          {activeChannel ? (
            <p>Welcome to #{activeChannel.name}</p>
          ) : (
            <p>Channel not found</p>
          )}
        </div>
      </main>
    </div>
  )
}
