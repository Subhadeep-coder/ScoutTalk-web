"use client"

import { Hash, Settings, Volume2 } from "lucide-react"
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
        "group grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-md px-2 py-1.5 text-base transition-colors",
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className="size-5" />
      <span className="truncate">{name}</span>
      <span
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation()
          // TODO: open channel settings
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.stopPropagation()
          }
        }}
        className="ml-3 cursor-pointer opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
      >
        <Settings className="size-4" />
      </span>
    </Link>
  )
}
