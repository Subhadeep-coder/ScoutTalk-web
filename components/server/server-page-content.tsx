"use client"

import { useEffect, useRef } from "react"

import { ServerSidebar } from "@/components/server/sidebar"
import ChatSection from "@/components/server/chat"
import { useServerStore } from "@/lib/stores/server-store"
import { useActiveServerStore } from "@/lib/stores/active-server-store"
import { getServer } from "@/lib/services/servers"
import { joinServer, leaveServer } from "@/lib/socket"
import { useSocketStore } from "@/lib/socket"

type ServerPageContentProps = Readonly<{
  serverId: string
  channelId: string
}>

export function ServerPageContent({ serverId, channelId }: ServerPageContentProps) {
  const activeServer = useActiveServerStore((s) => s.activeServer)
  const setActiveServer = useActiveServerStore((s) => s.setActiveServer)
  const setActiveServerId = useServerStore((s) => s.setActiveServerId)
  const setActiveChannelId = useActiveServerStore((s) => s.setActiveChannelId)
  const isConnected = useSocketStore((s) => s.isConnected)
  const prevServerId = useRef<string | null>(null)

  useEffect(() => {
    setActiveServerId(serverId)
    setActiveChannelId(channelId)
    if (!activeServer || activeServer.id !== serverId) {
      getServer(serverId).then(({ data }) => setActiveServer(data)).catch(() => {})
    }
  }, [serverId, channelId, setActiveServerId, setActiveChannelId, activeServer, setActiveServer])

  useEffect(() => {
    if (!isConnected) return

    if (prevServerId.current && prevServerId.current !== serverId) {
      leaveServer(prevServerId.current)
    }

    joinServer(serverId)
    prevServerId.current = serverId

    return () => {
      if (prevServerId.current) {
        leaveServer(prevServerId.current)
        prevServerId.current = null
      }
    }
  }, [serverId, isConnected])

  function refetchServer() {
    getServer(serverId).then(({ data }) => setActiveServer(data)).catch(() => {})
  }

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
          onChannelCreated={refetchServer}
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
        onChannelCreated={refetchServer}
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
