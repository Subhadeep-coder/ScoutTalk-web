import { useTypingStore } from "@/lib/stores/typing-store"

type TypingIndicatorProps = Readonly<{
  channelId: string
}>

export default function TypingIndicator({ channelId }: TypingIndicatorProps) {
  const typingUsers = useTypingStore((s) => s.typingByChannel[channelId])

  if (!typingUsers || typingUsers.length === 0) return null

  const names = typingUsers.map((u) => u.displayName ?? u.username)

  let text: string
  if (names.length === 1) {
    text = `${names[0]} is typing...`
  } else if (names.length === 2) {
    text = `${names[0]} and ${names[1]} are typing...`
  } else {
    text = `${names[0]}, ${names[1]} and ${names.length - 2} more are typing...`
  }

  return (
    <div className="flex items-center gap-1.5 px-4 py-1 text-xs text-muted-foreground">
      <span className="flex gap-0.5">
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
      </span>
      <span>{text}</span>
    </div>
  )
}
