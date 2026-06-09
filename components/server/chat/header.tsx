"use client"

import { Hash } from "lucide-react"

type ChatHeaderProps = Readonly<{
  channelName: string
}>

export default function ChatHeader({ channelName }: ChatHeaderProps) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4 font-medium">
      <Hash className="size-5 text-muted-foreground" />
      {channelName}
    </header>
  )
}
