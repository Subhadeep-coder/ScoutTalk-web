"use client"

import { useEffect, useState, type ReactNode } from "react"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SidebarInset, SidebarMenuButton } from "@/components/ui/sidebar"
import { deleteChannel, updateChannel } from "@/lib/services/channels"
import { useActiveServerStore } from "@/lib/stores/active-server-store"
import { ChannelSettingsOverview } from "@/components/server/settings/channels/channel-settings-overview"
import { ChannelSettingsSidebar } from "@/components/server/settings/channels/channel-settings-sidebar"
import { DeleteChannelDialog } from "@/components/server/settings/channels/delete-channel-dialog"

type Tab = "overview" | "permissions" | "invites"

type ChannelSettingsDialogProps = Readonly<{
  children: ReactNode
  channelId: string
  channelName: string
  channelType: "TEXT" | "VOICE"
  serverId: string
  onDeleted?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}>

export function ChannelSettingsDialog({
  children,
  channelId,
  channelName,
  channelType,
  serverId,
  onDeleted,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ChannelSettingsDialogProps) {
  const router = useRouter()
  const activeChannelId = useActiveServerStore((s) => s.activeChannelId)
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

  const [tab, setTab] = useState<Tab>("overview")
  const [savedName, setSavedName] = useState(channelName)
  const [editedName, setEditedName] = useState(channelName)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setTab("overview")
      setSavedName(channelName)
      setEditedName(channelName)
    }
  }, [open, channelName])

  async function handleSave() {
    if (!editedName.trim() || saving) return
    setSaving(true)
    try {
      await updateChannel(channelId, { name: editedName.trim() })
      const activeServer = useActiveServerStore.getState().activeServer
      if (activeServer) {
        const updatedChannels = activeServer.channels.map((ch) =>
          ch.id === channelId ? { ...ch, name: editedName.trim() } : ch,
        )
        useActiveServerStore.getState().setActiveServer({ ...activeServer, channels: updatedChannels })
      }
      setSavedName(editedName.trim())
    } catch {
      // toast handled by interceptor
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    await deleteChannel(channelId)
    const activeServer = useActiveServerStore.getState().activeServer
    if (activeServer) {
      const updatedChannels = activeServer.channels.filter((ch) => ch.id !== channelId)
      useActiveServerStore.getState().setActiveServer({ ...activeServer, channels: updatedChannels })
    }
    setOpen(false)
    onDeleted?.()
    if (channelId === activeChannelId) {
      router.push(`/server/${serverId}`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-[80vh] w-[80vw] !max-w-none gap-0 overflow-hidden p-0">
        <DialogTitle className="sr-only">{editedName} Settings</DialogTitle>
        <div onPointerDown={(e) => e.stopPropagation()} className="flex size-full">
          <ChannelSettingsSidebar
            channelType={channelType}
            editedName={editedName}
            tab={tab}
            onTabChange={setTab}
          >
            <DeleteChannelDialog channelName={savedName} onConfirmDelete={handleDelete}>
              <SidebarMenuButton className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="size-4" />
                Delete Channel
              </SidebarMenuButton>
            </DeleteChannelDialog>
          </ChannelSettingsSidebar>
          <SidebarInset className="flex-1 p-6">
            {tab === "overview" ? (
              <ChannelSettingsOverview
                editedName={editedName}
                savedName={savedName}
                saving={saving}
                onNameChange={setEditedName}
                onReset={() => setEditedName(savedName)}
                onSave={handleSave}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Coming soon
              </div>
            )}
          </SidebarInset>
        </div>
      </DialogContent>
    </Dialog>
  )
}
