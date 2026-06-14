"use client"

import { type ReactNode } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"

type SortableItemProps = Readonly<{
  id: string
  children: ReactNode
  className?: string
}>

export function SortableItem({ id, children, className }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(isDragging && "opacity-0", className)}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  )
}
