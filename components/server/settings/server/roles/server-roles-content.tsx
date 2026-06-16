"use client"

import { useEffect, useState } from "react"
import { ChevronRight, Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ColorPicker } from "@/components/ui/color-picker"
import { ServerRoleDetailPanel } from "@/components/server/settings/server/roles/server-role-detail-panel"
import { getRoles, createRole } from "@/lib/services/servers"

type Role = {
  id: string
  serverId: string
  name: string
  color: string | null
  position: number
  permissions: string
  mentionable: boolean
}

type ServerRolesContentProps = Readonly<{
  serverId: string
}>

export function ServerRolesContent({ serverId }: ServerRolesContentProps) {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState("")
  const [newColor, setNewColor] = useState("#78716c")
  const [creating, setCreating] = useState(false)

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const res = await getRoles(serverId)
        if (!mounted) return
        setRoles(res.data ?? [])
      } catch {
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [serverId])

  async function addRole() {
    if (!newName.trim()) return
    setCreating(true)
    try {
      const res = await createRole(serverId, { name: newName.trim(), color: newColor, mentionable: true })
      setRoles((prev) => [...prev, res.data])
      setNewName("")
      setNewColor("#78716c")
    } catch {
    } finally {
      setCreating(false)
    }
  }

  function selectRole(role: Role) {
    setSelectedRoleId(role.id)
  }

  function backToList() {
    setSelectedRoleId(null)
  }

  const selectedRole = roles.find((r) => r.id === selectedRoleId)
  const sortedRoles = [...roles].sort((a, b) => a.position - b.position)

  if (loading) {
    return (
      <div className="flex size-full items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (selectedRole) {
    return (
      <ServerRoleDetailPanel
        key={selectedRole.id}
        role={selectedRole}
        serverId={serverId}
        onBack={backToList}
        onRoleUpdated={(updated) => setRoles((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))}
        onRoleDeleted={(roleId) => setRoles((prev) => prev.filter((r) => r.id !== roleId))}
      />
    )
  }

  return (
    <div className="flex w-full max-w-160 flex-col gap-5 pb-4">
      <div className="flex flex-col gap-3">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Create a Role
        </Label>
        <p className="text-xs text-muted-foreground">
          Roles let you group members and assign permissions.
        </p>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Role name"
              className="h-9"
            />
            <ColorPicker value={newColor} onChange={setNewColor} />
            <Button size="sm" onClick={addRole} disabled={!newName.trim() || creating}>
              {creating ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
              Add
            </Button>
          </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Roles ({roles.length})
        </Label>
        {roles.length === 0 && (
          <p className="text-sm text-muted-foreground">No roles yet.</p>
        )}
        <div className="flex flex-col gap-1">
          {sortedRoles.map((role) => (
            <button
              key={role.id}
              type="button"
              className="flex w-full items-center gap-3 rounded-md border bg-card px-3 py-2.5 text-left transition-colors hover:bg-accent/50 cursor-pointer"
              onClick={() => selectRole(role)}
            >
              <div className="size-3 rounded-full shrink-0" style={{ backgroundColor: role.color ?? "#78716c" }} />
              <span className="flex-1 text-sm font-medium">{role.name}</span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
