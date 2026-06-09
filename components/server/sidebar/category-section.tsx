"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ChannelItem } from "@/components/server/sidebar/channel-item"

type Category = {
  id: string
  name: string
  position: number
}

type Channel = {
  id: string
  name: string
  categoryId: string
  type: "TEXT" | "VOICE"
  position: number
}

type CategorySectionProps = Readonly<{
  category: Category
  channels: Channel[]
  serverId: string
  activeChannelId: string
}>

export function CategorySection({ category, channels, serverId, activeChannelId }: CategorySectionProps) {
  const sortedChannels = [...channels]
    .filter((c) => c.categoryId === category.id)
    .sort((a, b) => a.position - b.position)

  if (sortedChannels.length === 0) return null

  return (
    <div className="mb-4">
      <div className="mb-1 flex items-center px-2">
        <span className="text-xs font-semibold text-muted-foreground">
          {category.name}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="ml-auto size-4 text-muted-foreground hover:text-foreground"
        >
          <Plus className="size-3" />
        </Button>
      </div>
      {sortedChannels.map((channel) => (
        <ChannelItem
          key={channel.id}
          id={channel.id}
          name={channel.name}
          type={channel.type}
          serverId={serverId}
          isActive={channel.id === activeChannelId}
        />
      ))}
    </div>
  )
}
