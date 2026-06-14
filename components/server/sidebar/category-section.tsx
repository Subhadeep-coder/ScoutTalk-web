"use client"

import { useState } from "react"
import { ChevronDown, Hash, Plus, Volume2 } from "lucide-react"
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"

import { SortableItem } from "@/components/server/sidebar/sortable-item"
import { ChannelItem } from "@/components/server/sidebar/channel-item"
import { ChannelSettingsDialog } from "@/components/server/settings/channels/channel-settings-dialog"
import { CreateChannelDialog } from "@/components/server/sidebar/create-channel-dialog"
import { useActiveServerStore } from "@/lib/stores/active-server-store"
import { reorderChannels } from "@/lib/services/channels"
import { cn } from "@/lib/utils"

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
  onChannelCreated?: () => void
}>

export function CategorySection({ category, channels, serverId, activeChannelId, onChannelCreated }: CategorySectionProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [settingsChannelId, setSettingsChannelId] = useState<string | null>(null)
  const setActiveServer = useActiveServerStore((s) => s.setActiveServer)
  const activeServer = useActiveServerStore((s) => s.activeServer)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )
  const sortedChannels = [...channels]
    .filter((c) => c.categoryId === category.id)
    .sort((a, b) => a.position - b.position)
  const channelIds = sortedChannels.map((c) => c.id)

  const activeChannel = activeId
    ? sortedChannels.find((c) => c.id === activeId)
    : null

  const settingsChannel = settingsChannelId
    ? sortedChannels.find((c) => c.id === settingsChannelId)
    : null

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function handleChannelDragEnd(event: DragEndEvent) {
    setActiveId(null)
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = sortedChannels.findIndex((c) => c.id === active.id)
    const newIndex = sortedChannels.findIndex((c) => c.id === over.id)
    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return

    const reordered = [...sortedChannels]
    const [moved] = reordered.splice(oldIndex, 1)
    reordered.splice(newIndex, 0, moved)
    const updatedCategoryChannels = reordered.map((ch, i) => ({ ...ch, position: i }))

    if (!activeServer) return
    const updatedChannels = activeServer.channels.map(
      (ch) => updatedCategoryChannels.find((u) => u.id === ch.id) ?? ch,
    )
    setActiveServer({ ...activeServer, channels: updatedChannels })

    reorderChannels({
      serverId,
      categoryId: category.id,
      order: updatedCategoryChannels.map((ch) => ch.id),
    }).catch(() => {
      setActiveServer({ ...activeServer })
    })
  }

  return (
    <div>
      <div className="mb-1 flex items-center px-2">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          {category.name}
          <ChevronDown
            className={cn(
              "size-3 transition-transform",
              collapsed && "-rotate-90",
            )}
          />
        </button>
        <CreateChannelDialog categoryName={category.name} categoryId={category.id} serverId={serverId} onCreated={onChannelCreated}>
          <span className="ml-auto flex size-5 cursor-pointer items-center justify-center text-muted-foreground hover:text-foreground">
            <Plus className="size-4" />
          </span>
        </CreateChannelDialog>
      </div>
      {!collapsed && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleChannelDragEnd}>
          <SortableContext items={channelIds} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-1">
              {sortedChannels.map((channel) => (
                <SortableItem key={channel.id} id={channel.id}>
                  <ChannelItem
                    id={channel.id}
                    name={channel.name}
                    type={channel.type}
                    serverId={serverId}
                    isActive={channel.id === activeChannelId}
                    onSettingsClick={() => setSettingsChannelId(channel.id)}
                  />
                </SortableItem>
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeChannel ? (
              <div className="w-56 rounded-md bg-muted px-2 py-1.5 text-base shadow-lg">
                <ChannelRow
                  name={activeChannel.name}
                  type={activeChannel.type}
                  isActive={activeChannel.id === activeChannelId}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
      {settingsChannel && (
        <ChannelSettingsDialog
          channelId={settingsChannel.id}
          channelName={settingsChannel.name}
          channelType={settingsChannel.type}
          serverId={serverId}
          open={true}
          onOpenChange={(o) => { if (!o) setSettingsChannelId(null) }}
          onDeleted={() => setSettingsChannelId(null)}
        />
      )}
    </div>
  )
}

function ChannelRow({ name, type, isActive }: Readonly<{ name: string; type: "TEXT" | "VOICE"; isActive: boolean }>) {
  const Icon = type === "TEXT" ? Hash : Volume2
  return (
    <div
      className={cn(
        "grid grid-cols-[auto_1fr] items-center gap-2",
        isActive ? "text-accent-foreground" : "text-muted-foreground",
      )}
    >
      <Icon className="size-5" />
      <span className="truncate">{name}</span>
    </div>
  )
}
