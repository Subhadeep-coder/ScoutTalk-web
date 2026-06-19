"use client"

import { useEffect, useRef } from "react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useServerStore } from "@/lib/stores/server-store"
import { connectSocket, disconnectSocket, joinServer, leaveServer } from "@/lib/socket"

export default function SocketProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const accessToken = useAuthStore((s) => s.accessToken)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const activeServerId = useServerStore((s) => s.activeServerId)
  const joinedServers = useRef<Set<string>>(new Set())
  const prevServer = useRef<string | null>(null)

  // ── join on first connect / reconnect ──
  useEffect(() => {
    const joined = joinedServers.current

    if (!accessToken || !isAuthenticated) {
      disconnectSocket()
      joined.clear()
      return
    }

    const sock = connectSocket(accessToken)

    // Join if there's an active server already
    if (activeServerId && !joined.has(activeServerId)) {
      joined.add(activeServerId)
      joinServer(activeServerId)
    }

    sock.on("connect", () => {
      const id = useServerStore.getState().activeServerId
      if (id && !joined.has(id)) {
        joined.add(id)
        joinServer(id)
      }
    })

    return () => {
      disconnectSocket()
      joined.clear()
    }
  }, [accessToken, isAuthenticated])

  // ── leave old + join new when switching servers ──
  useEffect(() => {
    const joined = joinedServers.current

    if (prevServer.current && prevServer.current !== activeServerId) {
      leaveServer(prevServer.current)
      joined.delete(prevServer.current)
    }

    if (activeServerId && !joined.has(activeServerId)) {
      joined.add(activeServerId)
      joinServer(activeServerId)
    }

    prevServer.current = activeServerId
  }, [activeServerId])

  return <>{children}</>
}
