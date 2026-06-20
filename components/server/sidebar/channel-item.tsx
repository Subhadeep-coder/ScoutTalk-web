"use client"

import { Hash, MessageCircle, Settings, Volume2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { useServerStore } from "@/lib/stores/server-store"

type ChannelItemProps = Readonly<{
  id: string
  name: string
  type: "TEXT" | "VOICE"
  serverId: string
  isActive: boolean
  showSettings?: boolean
  onSettingsClick?: () => void
}>

export function ChannelItem({ id, name, type, serverId, isActive, showSettings, onSettingsClick }: ChannelItemProps) {
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
      <div className="flex items-center gap-2">
        {type === "VOICE" && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              useServerStore.getState().setPendingVoiceChatChannelId(id)
              router.push(`/server/${serverId}/${id}`)
            }}
            className="cursor-pointer opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
          >
            <MessageCircle className="size-4" />
          </button>
        )}
        {showSettings && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onSettingsClick?.()
            }}
            className="cursor-pointer opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
          >
            <Settings className="size-4" />
          </button>
        )}
      </div>
    </div>
  )
}
