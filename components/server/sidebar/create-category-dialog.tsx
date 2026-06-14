"use client"

import { useState, type ReactNode } from "react"
import { Loader2 } from "lucide-react"
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
import { createCategory } from "@/lib/services/categories"
import { getServer } from "@/lib/services/servers"
import { useActiveServerStore } from "@/lib/stores/active-server-store"

type CreateCategoryDialogProps = Readonly<{
  children: ReactNode
  onCreated?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}>

export function CreateCategoryDialog({ children, onCreated, open: controlledOpen, onOpenChange: controlledOnOpenChange }: CreateCategoryDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  function setOpen(value: boolean) {
    if (isControlled) {
      controlledOnOpenChange?.(value)
    } else {
      setInternalOpen(value)
    }
  }
  const [name, setName] = useState("")
  const [creating, setCreating] = useState(false)
  const activeServer = useActiveServerStore((s) => s.activeServer)
  const setActiveServer = useActiveServerStore((s) => s.setActiveServer)

  async function handleCreate() {
    if (!name.trim() || !activeServer || creating) return
    setCreating(true)
    try {
      await createCategory({ name: name.trim(), serverId: activeServer.id })
      const { data } = await getServer(activeServer.id)
      setActiveServer(data)
      toast.success("Category created")
    } catch {
      toast.error("Failed to create category")
    } finally {
      setName("")
      setOpen(false)
      setCreating(false)
    }
  }

  function handleOpenChange(open: boolean) {
    if (!open) setName("")
    setOpen(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
          <DialogDescription>Add a new category to organize channels</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium">Category Name</Label>
          <Input
            placeholder="New Category"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate()
            }}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim() || creating}>
            {creating ? <Loader2 className="size-4 animate-spin" /> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
