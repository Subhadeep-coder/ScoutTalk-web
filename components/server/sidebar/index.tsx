"use client"

import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SortableItem } from "@/components/server/sidebar/sortable-item"
import { CategorySection } from "@/components/server/sidebar/category-section"
import { ServerHeader } from "@/components/server/sidebar/server-header"
import { useActiveServerStore } from "@/lib/stores/active-server-store"
import { reorderCategories } from "@/lib/services/categories"

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
  const setActiveServer = useActiveServerStore((s) => s.setActiveServer)
  const activeServer = useActiveServerStore((s) => s.activeServer)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )
  const sortedCategories = [...categories].sort((a, b) => a.position - b.position)
  const categoryIds = sortedCategories.map((c) => c.id)

  function handleCategoryDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = sortedCategories.findIndex((c) => c.id === active.id)
    const newIndex = sortedCategories.findIndex((c) => c.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = [...sortedCategories]
    const [moved] = reordered.splice(oldIndex, 1)
    reordered.splice(newIndex, 0, moved)
    const updated = reordered.map((cat, i) => ({ ...cat, position: i }))

    if (!activeServer) return
    setActiveServer({ ...activeServer, categories: updated })

    reorderCategories({
      serverId,
      categoryIds: updated.map((c) => c.id),
    }).catch(() => {
      setActiveServer({ ...activeServer })
    })
  }

  return (
    <div className="flex h-full w-72 flex-col bg-muted/30">
      <ServerHeader serverName={serverName} onCreated={onChannelCreated} />
      <ScrollArea className="flex-1 px-3 py-3">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCategoryDragEnd}>
          <SortableContext items={categoryIds} strategy={verticalListSortingStrategy}>
            {sortedCategories.map((category) => (
              <SortableItem key={category.id} id={category.id} className="mb-5">
                <CategorySection
                  category={category}
                  channels={channels}
                  serverId={serverId}
                  activeChannelId={activeChannelId}
                  onChannelCreated={onChannelCreated}
                />
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </ScrollArea>
    </div>
  )
}
