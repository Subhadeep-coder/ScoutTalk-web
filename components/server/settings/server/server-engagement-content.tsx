"use client"

import { useEffect, useState } from "react"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { useActiveServerStore } from "@/lib/stores/active-server-store"
import {
  getServerSettings,
  updateServerSettings,
  getWelcomeMessages,
  createWelcomeMessage,
  updateWelcomeMessage,
  deleteWelcomeMessage,
} from "@/lib/services/servers"
import { ServerSettingsLayout } from "@/components/server/settings/server/server-settings-layout"

type ServerEngagementContentProps = Readonly<{
  serverId: string
}>

type ServerEngagementConfig = {
  id: string
  serverId: string
  systemChannelId: string | null
  welcomeEnabled: boolean
  welcomeSelectionStrategy: "single" | "round_robin" | "random"
  stickerPromptEnabled: boolean
  boostMessageEnabled: boolean
}

type WelcomeMessage = {
  id: string
  serverId: string
  content: string
  isEnabled: boolean
  displayOrder: number | null
}

const defaultConfig: ServerEngagementConfig = {
  id: "",
  serverId: "",
  systemChannelId: null,
  welcomeEnabled: false,
  welcomeSelectionStrategy: "single",
  stickerPromptEnabled: false,
  boostMessageEnabled: false,
}

export function ServerEngagementContent({ serverId }: ServerEngagementContentProps) {
  const channels = useActiveServerStore((s) => s.activeServer?.channels ?? [])
  const textChannels = channels.filter((c) => c.type === "TEXT")

  const [config, setConfig] = useState<ServerEngagementConfig>(defaultConfig)
  const [originalConfig, setOriginalConfig] = useState<ServerEngagementConfig>(defaultConfig)
  const [welcomeMessages, setWelcomeMessages] = useState<WelcomeMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")

  const hasChanges =
    config.systemChannelId !== originalConfig.systemChannelId ||
    config.welcomeEnabled !== originalConfig.welcomeEnabled ||
    config.welcomeSelectionStrategy !== originalConfig.welcomeSelectionStrategy ||
    config.stickerPromptEnabled !== originalConfig.stickerPromptEnabled ||
    config.boostMessageEnabled !== originalConfig.boostMessageEnabled

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const [settingsRes, messagesRes] = await Promise.all([
          getServerSettings(serverId),
          getWelcomeMessages(serverId),
        ])
        if (!mounted) return
        setConfig(settingsRes.data ?? defaultConfig)
        setOriginalConfig(settingsRes.data ?? defaultConfig)
        setWelcomeMessages(messagesRes.data ?? [])
      } catch {
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [serverId])

  async function reload() {
    setLoading(true)
    try {
      const [settingsRes, messagesRes] = await Promise.all([
        getServerSettings(serverId),
        getWelcomeMessages(serverId),
      ])
      setConfig(settingsRes.data ?? defaultConfig)
      setOriginalConfig(settingsRes.data ?? defaultConfig)
      setWelcomeMessages(messagesRes.data ?? [])
    } catch {
    } finally {
      setLoading(false)
    }
  }

  async function saveSettings() {
    setSaving(true)
    try {
      await updateServerSettings(serverId, {
        systemChannelId: config.systemChannelId,
        welcomeEnabled: config.welcomeEnabled,
        welcomeSelectionStrategy: config.welcomeEnabled ? config.welcomeSelectionStrategy : undefined,
        stickerPromptEnabled: config.stickerPromptEnabled,
        boostMessageEnabled: config.boostMessageEnabled,
      })
    } catch {
    } finally {
      setSaving(false)
    }
  }

  async function addMessage() {
    if (!newMessage.trim()) return
    try {
      const res = await createWelcomeMessage(serverId, { content: newMessage.trim(), isEnabled: true, displayOrder: welcomeMessages.length })
      setWelcomeMessages((prev) => [...prev, res.data])
      setNewMessage("")
    } catch {
    }
  }

  function startEdit(msg: WelcomeMessage) {
    setEditingId(msg.id)
    setEditContent(msg.content)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditContent("")
  }

  async function saveEdit(msg: WelcomeMessage) {
    if (!editContent.trim()) return
    try {
      await updateWelcomeMessage(serverId, msg.id, { content: editContent.trim() })
      setWelcomeMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, content: editContent.trim() } : m)))
      setEditingId(null)
      setEditContent("")
    } catch {
    }
  }

  async function toggleEnabled(msg: WelcomeMessage) {
    try {
      await updateWelcomeMessage(serverId, msg.id, { isEnabled: !msg.isEnabled })
      setWelcomeMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, isEnabled: !m.isEnabled } : m)))
    } catch {
    }
  }

  async function removeMessage(msgId: string) {
    try {
      await deleteWelcomeMessage(serverId, msgId)
      setWelcomeMessages((prev) => prev.filter((m) => m.id !== msgId))
    } catch {
    }
  }

  if (loading) {
    return (
      <div className="flex size-full items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <ServerSettingsLayout
      title="Engagement"
      description="Configure how your server welcomes and engages new members."
    >
      <div className="flex flex-col gap-3">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          System Messages Channel
        </Label>
        <p className="text-xs text-muted-foreground">
          Select the channel where system messages (like welcome messages) are sent.
        </p>
        <Select
          value={config.systemChannelId ?? ""}
          onValueChange={(val) => setConfig((prev) => ({ ...prev, systemChannelId: val || null }))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a channel" />
          </SelectTrigger>
          <SelectContent>
            {textChannels.map((ch) => (
              <SelectItem key={ch.id} value={ch.id}>
                # {ch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="flex flex-col gap-5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Welcome Messages
        </Label>

        <label className="flex items-center justify-between gap-3 cursor-pointer">
          <span className="text-sm">Send welcome message when someone joins</span>
          <Switch
            checked={config.welcomeEnabled}
            onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, welcomeEnabled: checked }))}
          />
        </label>

        {config.welcomeEnabled && (
          <div className="ml-7">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">
              Selection Strategy
            </Label>
            <RadioGroup
              value={config.welcomeSelectionStrategy}
              onValueChange={(val) => setConfig((prev) => ({ ...prev, welcomeSelectionStrategy: val as "single" | "round_robin" | "random" }))}
            >
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-3 has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                <RadioGroupItem value="single" className="mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">Single</span>
                  <span className="text-xs text-muted-foreground">Always send the same welcome message</span>
                </div>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-3 has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                <RadioGroupItem value="round_robin" className="mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">Round Robin</span>
                  <span className="text-xs text-muted-foreground">Cycle through messages in order</span>
                </div>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-3 has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                <RadioGroupItem value="random" className="mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">Random</span>
                  <span className="text-xs text-muted-foreground">Pick a random message each time</span>
                </div>
              </label>
            </RadioGroup>
          </div>
        )}

        <label className="flex items-center justify-between gap-3 cursor-pointer">
          <span className="text-sm">Prompt to reply with a sticker</span>
          <Switch
            checked={config.stickerPromptEnabled}
            onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, stickerPromptEnabled: checked }))}
          />
        </label>

        <label className="flex items-center justify-between gap-3 cursor-pointer">
          <span className="text-sm">Send a message when server is boosted</span>
          <Switch
            checked={config.boostMessageEnabled}
            onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, boostMessageEnabled: checked }))}
          />
        </label>
      </div>

      {hasChanges && (
        <>
          <Separator />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={async () => { setConfig(structuredClone(originalConfig)); await reload() }} disabled={saving}>
              Reset
            </Button>
            <Button size="sm" onClick={saveSettings} disabled={saving}>
              {saving && <Loader2 className="size-3.5 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </>
      )}

      <Separator />

      <div className="flex flex-col gap-3">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Welcome Messages List
        </Label>
        <p className="text-xs text-muted-foreground">
          Use <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{`{user}`}</code> as a placeholder for the new member&apos;s name.
        </p>

        <div className="flex flex-col gap-2">
          {welcomeMessages.length === 0 && (
            <p className="text-sm text-muted-foreground">No welcome messages yet. Add one below.</p>
          )}
          {welcomeMessages.map((msg) => (
            <div
              key={msg.id}
              className="flex items-center gap-3 rounded-md border bg-card px-3 py-2"
            >
              <Switch
                checked={msg.isEnabled}
                onCheckedChange={() => toggleEnabled(msg)}
                size="sm"
              />
              {editingId === msg.id ? (
                <div className="flex flex-1 items-center gap-2">
                  <Input
                    type="text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="h-8 text-sm"
                    autoFocus
                  />
                  <Button size="sm" variant="ghost" onClick={() => saveEdit(msg)} disabled={!editContent.trim()}>
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={cancelEdit}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <span className={cn("flex-1 text-sm", !msg.isEnabled && "text-muted-foreground line-through")}>
                    {msg.content}
                  </span>
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => startEdit(msg)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-red-500" onClick={() => removeMessage(msg.id)}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder='e.g. "Welcome {user}! 👋"'
            className="h-9 text-sm"
          />
          <Button size="sm" onClick={addMessage} disabled={!newMessage.trim()}>
            <Plus className="size-3.5" />
            Add
          </Button>
        </div>
      </div>
    </ServerSettingsLayout>
  )
}
