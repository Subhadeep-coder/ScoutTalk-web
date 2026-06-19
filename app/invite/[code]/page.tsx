"use client"

import { useCallback, useEffect, useState } from "react"
import { Loader2, LogIn } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { acceptInvite, getInvite } from "@/lib/services/servers"

type InviteData = {
  server: {
    id: string
    name: string
    ownerId: string
    avatar: string | null
    banner: string | null
    description: string | null
    inviteCode: string
  }
  creator: {
    id: string
    username: string
    displayName: string
    avatar: string | null
  }
  inviteUrl: string
  memberCount: number
  expiresAt: string
}

export default function InvitePage() {
  const { code } = useParams<{ code: string }>()
  const router = useRouter()
  const [data, setData] = useState<InviteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getInvite(code)
      .then(({ data }) => {
        if (!cancelled) setData(data)
      })
      .catch(() => {
        if (!cancelled) setError("This invite link is invalid or has expired.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [code])

  const handleJoin = useCallback(async () => {
    if (!data || joining) return
    setJoining(true)
    try {
      await acceptInvite(code)
      router.push(`/server/${data.server.id}`)
    } catch {
      setError("Failed to join server. The invite may have expired.")
      setJoining(false)
    }
  }, [data, code, joining, router])

  if (loading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-gradient-to-b from-background to-muted">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex h-dvh items-center justify-center bg-gradient-to-b from-background to-muted">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="size-16 rounded-full bg-muted flex items-center justify-center">
            <LogIn className="size-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium">Invite Invalid</p>
          <p className="text-sm text-muted-foreground max-w-sm">
            {error ?? "This invite link is invalid or has expired."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-dvh items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-xl border bg-card shadow-2xl">
        {/* Banner */}
        <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5">
          {data.server.banner ? (
            <img
              src={data.server.banner}
              alt=""
              className="size-full object-cover"
            />
          ) : null}
        </div>

        {/* Avatar */}
        <div className="relative px-6">
          <div className="absolute -top-12">
            <Avatar className="size-20 border-4 border-card shadow-lg">
              {data.server.avatar ? (
                <AvatarImage src={data.server.avatar} />
              ) : (
                <AvatarFallback className="bg-primary text-3xl font-bold text-primary-foreground">
                  {data.server.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
        </div>

        {/* Body */}
        <div className="mt-12 space-y-4 px-6 pb-6">
          <div>
            <h1 className="text-xl font-bold">{data.server.name}</h1>
            {data.server.description && (
              <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">
                {data.server.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="size-3 rounded-full bg-green-500" />
            <span>{data.memberCount} Member{data.memberCount !== 1 ? "s" : ""}</span>
          </div>

          <p className="text-xs text-muted-foreground/60">
            Invited by <span className="font-medium text-foreground/80">{data.creator.displayName}</span>
          </p>

          <Button
            className="w-full"
            size="lg"
            onClick={handleJoin}
            disabled={joining}
          >
            {joining ? <Loader2 className="size-5 animate-spin" /> : null}
            {joining ? "Joining..." : "Accept Invite"}
          </Button>
        </div>
      </div>
    </div>
  )
}
