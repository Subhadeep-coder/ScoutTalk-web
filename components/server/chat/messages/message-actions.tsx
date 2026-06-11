"use client"

import { useState } from "react"
import { Ellipsis, Pencil, Reply, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useReplyStore } from "@/lib/stores/reply-store"
import { deleteMessage } from "@/lib/services/messages"
import { useMessageStore } from "@/lib/stores/message-store"

type MessageActionsProps = Readonly<{
  channelId: string
  messageId: string
  authorId: string
  authorName: string
  content: string | null
}>

export default function MessageActions({ channelId, messageId, authorId, authorName, content }: MessageActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const currentUser = useAuthStore((s) => s.user)
  const setReplyTo = useReplyStore((s) => s.setReplyTo)
  const fetchMessages = useMessageStore((s) => s.fetchMessages)
  const isMine = currentUser?.id === authorId

  return (
    <>
      <div className="absolute -top-3 right-2 z-10 flex items-center gap-0.5 rounded-lg border bg-popover p-0.5 shadow-sm opacity-0 transition-opacity group-hover:opacity-100">
        <TooltipWrapper label="Reply" side="top">
          <Button variant="ghost" size="icon-sm" onClick={() => setReplyTo({ messageId, authorName, content })}>
            <Reply />
          </Button>
        </TooltipWrapper>
        {isMine && content && (
          <TooltipWrapper label="Edit" side="top">
            <Button variant="ghost" size="icon-sm">
              <Pencil />
            </Button>
          </TooltipWrapper>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8}>
            <DropdownMenuItem onClick={() => setReplyTo({ messageId, authorName, content })}>
              <Reply />
              Reply
            </DropdownMenuItem>
            {isMine && content && (
              <DropdownMenuItem>
                <Pencil />
                Edit
              </DropdownMenuItem>
            )}
            {isMine && (
              <DropdownMenuItem className="text-destructive" onClick={() => setShowDeleteConfirm(true)}>
                <Trash2 />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete message</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                try {
                  await deleteMessage(channelId, messageId)
                  toast.success("Message deleted")
                  fetchMessages(channelId)
                } catch {
                  toast.error("Failed to delete message")
                }
                setShowDeleteConfirm(false)
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
