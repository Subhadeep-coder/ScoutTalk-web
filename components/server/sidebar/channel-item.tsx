"use client"

import { Hash, Settings, Volume2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"

type ChannelItemProps = Readonly<{
  id: string
  name: string
  type: "TEXT" | "VOICE"
  serverId: string
  isActive: boolean
  onSettingsClick?: () => void
}>

export function ChannelItem({ id, name, type, serverId, isActive, onSettingsClick }: ChannelItemProps) {
  const router = useRouter()
  const Icon = type === "TEXT" ? Hash : Volume2

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/server/${serverId}/${id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          router.push(`/server/${serverId}/${id}`)
        }
      }}
      className={cn(
        "group grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-2 rounded-md px-2 py-1.5 text-base transition-colors",
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className="size-5" />
      <span className="truncate">{name}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onSettingsClick?.()
        }}
        className="ml-3 cursor-pointer opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
      >
        <Settings className="size-4" />
      </button>
    </div>
  )
}
