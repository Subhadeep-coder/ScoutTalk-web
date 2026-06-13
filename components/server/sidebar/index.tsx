"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { CategorySection } from "@/components/server/sidebar/category-section"
import { ServerHeader } from "@/components/server/sidebar/server-header"

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

type ServerSidebarProps = Readonly<{
  serverId: string
  activeChannelId: string
  serverName: string
  categories: Category[]
  channels: Channel[]
  onChannelCreated?: () => void
}>

export function ServerSidebar({ serverId, activeChannelId, serverName, categories, channels, onChannelCreated }: ServerSidebarProps) {
  const sortedCategories = [...categories].sort((a, b) => a.position - b.position)

  return (
    <div className="flex h-full w-72 flex-col bg-muted/30">
      <ServerHeader serverName={serverName} />
      <ScrollArea className="flex-1 px-3 py-3">
        {sortedCategories.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            channels={channels}
            serverId={serverId}
            activeChannelId={activeChannelId}
            onChannelCreated={onChannelCreated}
          />
        ))}
      </ScrollArea>
    </div>
  )
}
