"use client"

import { useCallback, useRef, useState } from "react"
import { Camera, Maximize2, Plus, Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper"
import { useAuthStore } from "@/lib/stores/auth-store"
import { createServer, uploadServerAvatar } from "@/lib/services/servers"

type CreateServerDialogProps = Readonly<{
  onCreated?: () => void
}>

export function CreateServerDialog({ onCreated }: CreateServerDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [creating, setCreating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const user = useAuthStore((s) => s.user)

  const [isDragging, setIsDragging] = useState(false)
  const dragCounter = useRef(0)

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return
    setAvatarFile(file)
    const dataUrl = await readFileAsDataURL(file)
    setAvatarPreview(dataUrl)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }, [processFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
  }, [])

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current++
    if (dragCounter.current === 1) setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    dragCounter.current--
    if (dragCounter.current === 0) setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current = 0
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }, [processFile])

  const resetForm = useCallback(() => {
    setOpen(false)
    setName("")
    setAvatarPreview(null)
    setAvatarFile(null)
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!name.trim() || creating) return

      setCreating(true)
      try {
        const { data: server } = await createServer(name.trim())

        if (avatarFile) {
          await uploadServerAvatar(server.id, avatarFile)
        }

        onCreated?.()
        resetForm()
      } catch {
        // TODO: show error toast
      } finally {
        setCreating(false)
      }
    },
    [name, avatarFile, creating, onCreated, resetForm],
  )

  return (
    <SidebarMenuItem className="flex justify-center">
      <Dialog open={open} onOpenChange={(isOpen) => {
        if (isOpen) {
          const base = user?.displayName || user?.firstName || "User"
          setName(`${base}'s server`)
          setOpen(true)
        } else {
          resetForm()
        }
      }}>
        <DialogTrigger asChild>
          <SidebarMenuButton tooltip="Add Server" className="justify-center">
            <Plus className="size-6" />
          </SidebarMenuButton>
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create a Server</DialogTitle>
              <DialogDescription>
                Give your server a name and avatar to get started.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-center gap-3">
                <div
                  className="group relative cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Avatar className={cn("size-20 scale-100 transition-all duration-200", isDragging && "scale-110 ring-2 ring-primary ring-offset-2")}>
                    {avatarPreview && <AvatarImage src={avatarPreview} />}
                    <AvatarFallback>
                      <Camera className="size-6 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <Camera className="size-6 text-white" />
                  </div>
                </div>
                {avatarPreview && (
                  <div className="flex flex-col gap-1">
                    <TooltipWrapper label="Remove" side="right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setAvatarPreview(null)
                          setAvatarFile(null)
                          if (fileInputRef.current) fileInputRef.current.value = ""
                        }}
                        className="size-8 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TooltipWrapper>
                    <TooltipWrapper label="Coming soon" side="right" disabled>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled
                        className="size-8 text-muted-foreground hover:text-foreground"
                      >
                        <Maximize2 className="size-4" />
                      </Button>
                    </TooltipWrapper>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="server-name">Server name</Label>
                <Input
                  id="server-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Server"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!name.trim() || creating}>
                {creating ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </SidebarMenuItem>
  )
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
