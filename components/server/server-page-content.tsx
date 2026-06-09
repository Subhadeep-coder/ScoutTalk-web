"use client"

import { useEffect } from "react"

import { ServerSidebar } from "@/components/server/sidebar"
import ChatSection from "@/components/server/chat"
import { useServerStore } from "@/lib/stores/server-store"
import { useActiveServerStore } from "@/lib/stores/active-server-store"
import { getServer } from "@/lib/services/servers"

type ServerPageContentProps = Readonly<{
  serverId: string
  channelId: string
}>

export function ServerPageContent({ serverId, channelId }: ServerPageContentProps) {
  const activeServer = useActiveServerStore((s) => s.activeServer)
  const setActiveServer = useActiveServerStore((s) => s.setActiveServer)
  const setActiveServerId = useServerStore((s) => s.setActiveServerId)

  useEffect(() => {
    setActiveServerId(serverId)
    if (!activeServer || activeServer.id !== serverId) {
      getServer(serverId).then(({ data }) => setActiveServer(data)).catch(() => {})
    }
  }, [serverId, setActiveServerId, activeServer, setActiveServer])

  if (!activeServer || activeServer.id !== serverId) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Loading...
      </div>
    )
  }

  const activeChannel = activeServer.channels.find((c) => c.id === channelId)

  if (!activeChannel) {
    return (
      <div className="flex h-full">
        <ServerSidebar
          serverId={serverId}
          activeChannelId={channelId}
          serverName={activeServer.name}
          categories={activeServer.categories}
          channels={activeServer.channels}
        />
        <main className="flex flex-1 items-center justify-center text-muted-foreground">
          Channel not found
        </main>
      </div>
    )
  }

  const isVoice = activeChannel.type === "VOICE"

  return (
    <div className="flex h-full">
      <ServerSidebar
        serverId={serverId}
        activeChannelId={channelId}
        serverName={activeServer.name}
        categories={activeServer.categories}
        channels={activeServer.channels}
      />
      {isVoice ? (
        <main className="flex flex-1 items-center justify-center text-muted-foreground">
          <div className="flex flex-col items-center gap-2">
            <p className="text-lg font-medium">Voice Channel</p>
            <p className="text-sm">Coming soon</p>
          </div>
        </main>
      ) : (
        <ChatSection channelName={activeChannel.name} channelId={channelId} />
      )}
    </div>
  )
}
