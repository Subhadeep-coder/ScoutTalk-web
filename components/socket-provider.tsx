"use client"

import { useEffect, useRef } from "react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useServerStore } from "@/lib/stores/server-store"
import { connectSocket, disconnectSocket, joinServer } from "@/lib/socket"

export default function SocketProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const accessToken = useAuthStore((s) => s.accessToken)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const joinedServers = useRef<Set<string>>(new Set())

  useEffect(() => {
    const joined = joinedServers.current

    if (!accessToken || !isAuthenticated) {
      disconnectSocket()
      joined.clear()
      return
    }

    const sock = connectSocket(accessToken)

    sock.on("reconnect", () => {
      const activeServerId = useServerStore.getState().activeServerId
      if (activeServerId && !joined.has(activeServerId)) {
        joined.add(activeServerId)
        joinServer(activeServerId)
      }
    })

    return () => {
      disconnectSocket()
      joined.clear()
    }
  }, [accessToken, isAuthenticated])

  return <>{children}</>
}
