"use client"

import { useEffect, useMemo, useState } from "react"
import { Check, Plus, Search, X } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getRoles, getServerMembers } from "@/lib/services/servers"
import {
  getChannelPermissionOverrides,
  upsertRolePermissionOverride,
  deleteRolePermissionOverride,
  upsertMemberPermissionOverride,
  deleteMemberPermissionOverride,
  type PermissionOverride,
} from "@/lib/services/channels"
import { getChannelPermissionGroups, hasPermission, Permissions, type PermissionKey } from "@/lib/utils/permissions"
import { cn } from "@/lib/utils"

type Role = {
  id: string
  serverId: string
  name: string
  color: string | null
  position: number
  permissions: string
  mentionable: boolean
}

type MemberInfo = {
  id: string
  userId: string
  serverId: string
  joinedAt: string
  role: string
  user: {
    id: string
    username: string
    displayName: string
    avatar: string | null
  }
}

type ChannelPermissionsContentProps = Readonly<{
  channelId: string
  serverId: string
  channelType: "TEXT" | "VOICE"
}>

function computeOverrideState(
  overrides: PermissionOverride[],
  groups: ReturnType<typeof getChannelPermissionGroups>,
): Map<string, Record<string, "allow" | "deny" | null>> {
  const state = new Map<string, Record<string, "allow" | "deny" | null>>()
  for (const ov of overrides) {
    const id = ov.roleId ?? ov.memberId
    if (!id) continue
    const perms: Record<string, "allow" | "deny" | null> = {}
    const allowBits = BigInt(ov.allow || "0")
    const denyBits = BigInt(ov.deny || "0")
    for (const group of groups) {
      for (const key of group.keys) {
        const bit = Permissions[key]
        if (hasPermission(allowBits, bit)) {
          perms[key] = "allow"
        } else if (hasPermission(denyBits, bit)) {
          perms[key] = "deny"
        } else {
          perms[key] = null
        }
      }
    }
    state.set(id, perms)
  }
  return state
}

function hasSavedOverride(overrides: PermissionOverride[], id: string): boolean {
  const ov = overrides.find((o) => o.roleId === id || o.memberId === id)
  if (!ov) return false
  return BigInt(ov.allow || "0") !== 0n || BigInt(ov.deny || "0") !== 0n
}

type OverrideEntry = {
  id: string
  name: string
  color: string | null
  subtext: string | null
  avatar: string | null
  isRole: boolean
}

export function ChannelPermissionsContent({ channelId, serverId, channelType }: ChannelPermissionsContentProps) {
  const [roles, setRoles] = useState<Role[]>([])
  const [members, setMembers] = useState<MemberInfo[]>([])
  const [overrides, setOverrides] = useState<PermissionOverride[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [savingId, setSavingId] = useState<string | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  const permissionGroups = useMemo(() => getChannelPermissionGroups(channelType), [channelType])

  const [localState, setLocalState] = useState<Map<string, Record<string, "allow" | "deny" | null>>>(new Map())

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [rolesRes, membersRes, overridesRes] = await Promise.all([
          getRoles(serverId),
          getServerMembers(serverId),
          getChannelPermissionOverrides(channelId),
        ])
        if (!cancelled) {
          setRoles(rolesRes.data)
          setMembers(membersRes.data)
          setOverrides(overridesRes.data)
          setLocalState(computeOverrideState(overridesRes.data, permissionGroups))
        }
      } catch {
        if (!cancelled) toast.error("Failed to load permissions")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [serverId, channelId, permissionGroups])

  const overrideIds = useMemo(() => new Set(overrides.map((o) => o.roleId ?? o.memberId)), [overrides])

  const allItems = useMemo(() => {
    const roleItems: OverrideEntry[] = roles
      .filter((r) => overrideIds.has(r.id))
      .map((r) => ({ id: r.id, name: r.name, color: r.color, subtext: null, avatar: null, isRole: true }))
    const memberItems: OverrideEntry[] = members
      .filter((m) => overrideIds.has(m.id))
      .map((m) => ({
        id: m.id,
        name: m.user.displayName || m.user.username,
        color: null,
        subtext: `@${m.user.username}`,
        avatar: m.user.avatar,
        isRole: false,
      }))
    return [...roleItems, ...memberItems]
  }, [roles, members, overrideIds])

  const filteredItems = useMemo(() => {
    if (!search.trim()) return allItems
    const q = search.toLowerCase()
    return allItems.filter((item) => item.name.toLowerCase().includes(q) || (item.subtext?.toLowerCase().includes(q)))
  }, [allItems, search])

  const selectedItem = useMemo(
    () => allItems.find((i) => i.id === selectedId) ?? null,
    [allItems, selectedId],
  )

  const availableRoles = useMemo(
    () => roles.filter((r) => !overrideIds.has(r.id)).sort((a, b) => a.position - b.position),
    [roles, overrideIds],
  )

  const availableMembers = useMemo(
    () => members.filter((m) => !overrideIds.has(m.id)),
    [members, overrideIds],
  )

  function handleToggle(id: string, key: PermissionKey, value: "allow" | "deny" | null) {
    setLocalState((prev) => {
      const next = new Map(prev)
      const current = next.get(id) ?? {}
      const updated = { ...current, [key]: value }
      if (value === null) delete updated[key]
      next.set(id, updated)
      return next
    })
  }

  async function handleSave(id: string, isRole: boolean) {
    setSavingId(id)
    try {
      const state = localState.get(id) ?? {}
      let allow = 0n
      let deny = 0n
      for (const [key, value] of Object.entries(state)) {
        if (value === "allow") allow |= Permissions[key as PermissionKey]
        else if (value === "deny") deny |= Permissions[key as PermissionKey]
      }
      const hasAny = allow !== 0n || deny !== 0n

      if (isRole) {
        if (hasAny) {
          await upsertRolePermissionOverride(channelId, id, { allow: allow.toString(), deny: deny.toString() })
        } else {
          await deleteRolePermissionOverride(channelId, id)
        }
      } else {
        if (hasAny) {
          await upsertMemberPermissionOverride(channelId, id, { allow: allow.toString(), deny: deny.toString() })
        } else {
          await deleteMemberPermissionOverride(channelId, id)
        }
      }

      const res = await getChannelPermissionOverrides(channelId)
      setOverrides(res.data)
      setLocalState(computeOverrideState(res.data, permissionGroups))
      toast.success("Permissions saved")
    } catch {
      toast.error("Failed to save permissions")
    } finally {
      setSavingId(null)
    }
  }

  async function handleAdd(id: string, isRole: boolean) {
    const empty = computeOverrideState([], permissionGroups)
    setLocalState((prev) => {
      const next = new Map(prev)
      if (!next.has(id)) next.set(id, {})
      return next
    })
    setOverrides((prev) => [
      ...prev,
      { id: "", channelId, roleId: isRole ? id : null, memberId: isRole ? null : id, allow: "0", deny: "0" },
    ])
    setSelectedId(id)
    setAddDialogOpen(false)
  }

  async function handleRemoveOverride(id: string) {
    const isRole = roles.some((r) => r.id === id)
    try {
      if (isRole) {
        await deleteRolePermissionOverride(channelId, id)
      } else {
        await deleteMemberPermissionOverride(channelId, id)
      }
      const res = await getChannelPermissionOverrides(channelId)
      setOverrides(res.data)
      setLocalState(computeOverrideState(res.data, permissionGroups))
      if (selectedId === id) setSelectedId(null)
      toast.success("Override removed")
    } catch {
      toast.error("Failed to remove override")
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 min-h-0">
      <div>
        <h2 className="font-heading text-lg font-semibold">Channel Permissions</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Add roles or members to set permission overrides for this channel.
        </p>
      </div>

      <div className="flex flex-1 gap-0 overflow-hidden rounded-lg border min-h-0">
        {/* Sidebar */}
        <aside className="flex w-60 shrink-0 flex-col border-r bg-muted/20 min-h-0">
          <div className="border-b p-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search roles or members"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9 text-sm"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-0.5 p-2">
              {filteredItems.length === 0 ? (
                <div className="px-2 py-8 text-center text-xs text-muted-foreground">
                  {search ? "No results found" : "No overrides yet"}
                </div>
              ) : (
                filteredItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors",
                      selectedId === item.id
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {item.avatar ? (
                      <Avatar className="size-6 shrink-0">
                        <AvatarImage src={item.avatar} />
                        <AvatarFallback className="text-[10px]">{item.name[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="size-3 shrink-0 rounded-full" style={{ backgroundColor: item.color ?? "#78716c" }} />
                    )}
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium leading-tight">{item.name}</span>
                      {item.subtext && (
                        <span className="truncate text-[11px] leading-tight text-muted-foreground">{item.subtext}</span>
                      )}
                    </div>
                    {hasSavedOverride(overrides, item.id) && (
                      <Badge variant="secondary" className="shrink-0 text-[10px] px-1 py-0 h-4">
                        Modified
                      </Badge>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
          <div className="border-t p-3">
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full gap-1.5 text-sm">
                  <Plus className="size-4" />
                  Add Override
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Override</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                  {availableRoles.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Roles</h4>
                      <div className="flex flex-col gap-1">
                        {availableRoles.map((r) => (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => handleAdd(r.id, true)}
                            className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors hover:bg-muted"
                          >
                            <div className="size-3 shrink-0 rounded-full" style={{ backgroundColor: r.color ?? "#78716c" }} />
                            <span>{r.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {availableMembers.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Members</h4>
                      <div className="flex flex-col gap-1">
                        {availableMembers.map((m) => (
                          <button
                            key={m.userId}
                            type="button"
                            onClick={() => handleAdd(m.id, false)}
                            className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors hover:bg-muted"
                          >
                            <Avatar className="size-6 shrink-0">
                              <AvatarImage src={m.user.avatar ?? undefined} />
                              <AvatarFallback className="text-[10px]">{m.user.displayName[0]?.toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col leading-tight">
                              <span className="text-sm font-medium">{m.user.displayName || m.user.username}</span>
                              <span className="text-[11px] text-muted-foreground">@{m.user.username}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {availableRoles.length === 0 && availableMembers.length === 0 && (
                    <p className="text-sm text-muted-foreground">All roles and members already have overrides.</p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </aside>

        {/* Detail panel */}
        <main className="flex flex-1 flex-col min-h-0">
          {selectedId && selectedItem ? (
            <PermissionDetailPanel
              item={selectedItem}
              state={localState.get(selectedId) ?? {}}
              permissionGroups={permissionGroups}
              saving={savingId === selectedId}
              onToggle={(key, value) => handleToggle(selectedId, key, value)}
              onSave={() => handleSave(selectedId, selectedItem.isRole)}
              onRemove={() => handleRemoveOverride(selectedId)}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
                <p className="text-base font-medium">Select a role or member</p>
                <p>Choose from the sidebar to view or edit permissions</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

type PermissionDetailPanelProps = Readonly<{
  item: OverrideEntry
  state: Record<string, "allow" | "deny" | null>
  permissionGroups: ReturnType<typeof getChannelPermissionGroups>
  saving: boolean
  onToggle: (key: PermissionKey, value: "allow" | "deny" | null) => void
  onSave: () => void
  onRemove: () => void
}>

function PermissionDetailPanel({ item, state, permissionGroups, saving, onToggle, onSave, onRemove }: PermissionDetailPanelProps) {
  return (
    <div className="flex flex-1 flex-col min-h-0">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-3">
          {item.avatar ? (
            <Avatar className="size-8">
              <AvatarImage src={item.avatar} />
              <AvatarFallback>{item.name[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="size-4 rounded-full" style={{ backgroundColor: item.color ?? "#78716c" }} />
          )}
          <div>
            <h3 className="text-base font-semibold">{item.name}</h3>
            {item.subtext && <p className="text-xs text-muted-foreground">{item.subtext}</p>}
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={onRemove}>
          <X className="size-4 mr-1" />
          Remove
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col divide-y px-6">
          {permissionGroups.map((group) => (
            <div key={group.label} className="py-4">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {group.label}
              </h4>
              <div className="flex flex-col gap-0.5">
                {group.keys.map((key) => (
                  <PermissionToggleRow key={key} label={key} value={state[key] ?? null} onToggle={(v) => onToggle(key, v)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 border-t px-6 py-3">
        <Button variant="outline" size="sm" onClick={onRemove}>
          Remove Override
        </Button>
        <Button size="sm" onClick={onSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}

type PermissionToggleRowProps = Readonly<{
  label: string
  value: "allow" | "deny" | null
  onToggle: (value: "allow" | "deny" | null) => void
}>

function PermissionToggleRow({ label, value, onToggle }: PermissionToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted/50">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onToggle("allow")}
          className={cn(
            "flex size-7 items-center justify-center rounded-md border text-xs transition-colors",
            value === "allow"
              ? "border-green-500 bg-green-500/10 text-green-500"
              : "border-transparent text-muted-foreground hover:border-muted-foreground/30",
          )}
          title="Allow"
        >
          <Check className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => onToggle("deny")}
          className={cn(
            "flex size-7 items-center justify-center rounded-md border text-xs transition-colors",
            value === "deny"
              ? "border-red-500 bg-red-500/10 text-red-500"
              : "border-transparent text-muted-foreground hover:border-muted-foreground/30",
          )}
          title="Deny"
        >
          <X className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => onToggle(null)}
          className={cn(
            "flex size-7 items-center justify-center rounded-md border text-xs transition-colors",
            value === null
              ? "border-muted-foreground/30 bg-muted/50 text-muted-foreground"
              : "border-transparent text-muted-foreground hover:border-muted-foreground/30",
          )}
          title="Inherit"
        >
          <div className="size-2 rounded-full bg-current" />
        </button>
      </div>
    </div>
  )
}
