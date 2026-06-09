"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

import { getServer } from "@/lib/services/servers"
import { useActiveServerStore } from "@/lib/stores/active-server-store"
import { useServerStore } from "@/lib/stores/server-store"

export default function ServerRedirectPage() {
  const router = useRouter()
  const params = useParams()
  const serverId = params.serverId as string
  const setActiveServer = useActiveServerStore((s) => s.setActiveServer)
  const setActiveServerId = useServerStore((s) => s.setActiveServerId)

  useEffect(() => {
    setActiveServerId(serverId)
    getServer(serverId)
      .then(({ data }) => {
        setActiveServer(data)
        const textChannels = data.channels.filter(
          (c: { type: string }) => c.type === "TEXT",
        )
        if (textChannels.length > 0) {
          router.replace(`/server/${serverId}/${textChannels[0].id}`)
        } else {
          router.replace("/dashboard")
        }
      })
      .catch(() => {
        router.replace("/dashboard")
      })
  }, [serverId, router, setActiveServer, setActiveServerId])

  return null
}
