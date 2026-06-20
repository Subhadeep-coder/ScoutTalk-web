"use client"

import { Gift, Info, Pin, UserPlus } from "lucide-react"

type SystemMessageType = "join" | "boost" | "pin" | "default"

type SystemMessageProps = Readonly<{
  content: React.ReactNode
  type?: SystemMessageType
}>

const config: Record<SystemMessageType, { icon: typeof Info; color: string }> = {
  join: { icon: UserPlus, color: "#23a55a" },
  boost: { icon: Gift, color: "#f47fff" },
  pin: { icon: Pin, color: "#72767d" },
  default: { icon: Info, color: "#72767d" },
}

export default function SystemMessage({
  content,
  type = "default",
}: SystemMessageProps) {
  const { icon: Icon, color } = config[type]

  return (
    <div className="flex items-start gap-1 py-0.5 hover:bg-white/3 px-4 rounded">
      <div className="flex w-10 shrink-0 items-center justify-center pt-0.5">
        <Icon className="size-4" style={{ color }} />
      </div>
      <p className="text-[13px] leading-snug text-[#dbdee1]">{content}</p>
    </div>
  )
}
