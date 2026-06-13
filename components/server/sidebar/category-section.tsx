"use client"

import { Plus } from "lucide-react"

import { ChannelItem } from "@/components/server/sidebar/channel-item"
import { CreateChannelDialog } from "@/components/server/sidebar/create-channel-dialog"

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

  return (
    <div className="mb-5">
      <div className="mb-1 flex items-center px-2">
        <span className="text-sm font-semibold text-muted-foreground">
          {category.name}
        </span>
        <CreateChannelDialog categoryName={category.name}>
          <span className="ml-auto flex size-5 cursor-pointer items-center justify-center text-muted-foreground hover:text-foreground">
            <Plus className="size-4" />
          </span>
        </CreateChannelDialog>
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
