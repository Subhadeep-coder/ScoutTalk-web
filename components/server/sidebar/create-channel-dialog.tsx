"use client"

import { useState, type ReactNode } from "react"
import { Hash, Volume2, Smile, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { EmojiPicker } from "@/components/server/emoji-picker"
import { createChannel } from "@/lib/services/channels"

type CreateChannelDialogProps = Readonly<{
  children: ReactNode
  categoryName: string
  categoryId: string
  serverId: string
  onCreated?: () => void
}>

export function CreateChannelDialog({ children, categoryName, categoryId, serverId, onCreated }: CreateChannelDialogProps) {
  const [open, setOpen] = useState(false)
  const [channelType, setChannelType] = useState<"TEXT" | "VOICE">("TEXT")
  const [name, setName] = useState("")
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [creating, setCreating] = useState(false)

  function handleEmojiSelect(emoji: string) {
    setName((prev) => prev + emoji)
    setEmojiOpen(false)
  }

  async function handleCreate() {
    if (!name.trim() || creating) return
    setCreating(true)
    try {
      await createChannel({
        name: name.trim().toLowerCase().replace(/\s+/g, "-"),
        serverId,
        categoryId,
        type: channelType,
      })
      onCreated?.()
      toast.success("Channel created")
    } catch {
      toast.error("Failed to create channel")
    } finally {
      setChannelType("TEXT")
      setName("")
      setOpen(false)
      setCreating(false)
    }
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setChannelType("TEXT")
      setName("")
    }
    setOpen(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Channel</DialogTitle>
          <DialogDescription>in {categoryName}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <Label className="text-sm font-medium">Channel Type</Label>
            <RadioGroup value={channelType} onValueChange={(v) => setChannelType(v as "TEXT" | "VOICE")}>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-3 has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                <RadioGroupItem value="TEXT" className="mt-0.5" />
                <Hash className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">Text</span>
                  <span className="text-xs text-muted-foreground">Post messages, images, and files in a text channel</span>
                </div>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-3 has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                <RadioGroupItem value="VOICE" className="mt-0.5" />
                <Volume2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">Voice</span>
                  <span className="text-xs text-muted-foreground">Hang out and talk in a voice channel</span>
                </div>
              </label>
            </RadioGroup>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Channel Name</Label>
            <div className="relative">
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                {channelType === "TEXT" ? (
                  <Hash className="size-4 text-muted-foreground" />
                ) : (
                  <Volume2 className="size-4 text-muted-foreground" />
                )}
              </div>
              <Input
                placeholder="new-channel"
                value={name}
                onChange={(e) => setName(e.target.value.toLowerCase())}
                className="pl-9"
              />
              <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                  >
                    <Smile className="size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="top" align="end" className="w-auto p-0 border-0">
                  <EmojiPicker
                    onSelect={handleEmojiSelect}
                    onClose={() => setEmojiOpen(false)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim() || creating}>
            {creating ? <Loader2 className="size-4 animate-spin" /> : "Create Channel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
