"use client"

import { Hash, Volume2 } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"

type ChannelItemProps = Readonly<{
  id: string
  name: string
  type: "TEXT" | "VOICE"
  serverId: string
  isActive: boolean
}>

export function ChannelItem({ id, name, type, serverId, isActive }: ChannelItemProps) {
  const Icon = type === "TEXT" ? Hash : Volume2

  return (
    <Link
      href={`/server/${serverId}/${id}`}
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1.5 text-base transition-colors",
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className="size-5 shrink-0" />
      <span className="truncate">{name}</span>
    </Link>
  )
}
