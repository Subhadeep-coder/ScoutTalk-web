"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type MessageAvatarProps = Readonly<{
  avatar: string | null
  firstName: string
  lastName: string
}>

export default function MessageAvatar({ avatar, firstName, lastName }: MessageAvatarProps) {
  const initials = `${firstName[0]}${lastName[0]}`

  return (
    <Avatar size="sm" className="size-9">
      {avatar && <AvatarImage src={avatar} alt={initials} />}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  )
}
