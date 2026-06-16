"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ServerRoleDeleteDialog } from "@/components/server/settings/server/roles/server-role-delete-dialog"
import { ServerRoleDisplayTab } from "@/components/server/settings/server/roles/server-role-display-tab"
import { ServerRolePermissionsTab } from "@/components/server/settings/server/roles/server-role-permissions-tab"
import { ServerRoleMembersTab } from "@/components/server/settings/server/roles/server-role-members-tab"
import { ServerRoleAddMembersDialog } from "@/components/server/settings/server/roles/server-role-add-members-dialog"
import { getRoleMembers, deleteRole, updateRole } from "@/lib/services/servers"
import { Permissions, hasPermission } from "@/lib/utils/permissions"
import type { PermissionKey } from "@/lib/utils/permissions"

type Role = {
  id: string
  serverId: string
  name: string
  color: string | null
  position: number
  permissions: string
  mentionable: boolean
}

type Member = {
  id: string
  userId: string
  user: {
    id: string
    displayName: string
    username: string
    avatar: string | null
  }
}

type DetailTab = "display" | "permissions" | "manage-members"

type ServerRoleDetailPanelProps = Readonly<{
  role: Role
  serverId: string
  onBack: () => void
  onRoleUpdated: (role: Role) => void
  onRoleDeleted: (roleId: string) => void
}>

export function ServerRoleDetailPanel({ role, serverId, onBack, onRoleUpdated, onRoleDeleted }: ServerRoleDetailPanelProps) {
  const [detailTab, setDetailTab] = useState<DetailTab>("display")

  const [detailName, setDetailName] = useState(role.name)
  const [detailColor, setDetailColor] = useState(role.color ?? "#78716c")
  const [detailMentionable, setDetailMentionable] = useState(role.mentionable)
  const [detailPermissions, setDetailPermissions] = useState<Record<string, boolean>>(() => {
    const bits = BigInt(role.permissions)
    const perms: Record<string, boolean> = {}
    for (const key of Object.keys(Permissions) as PermissionKey[]) {
      perms[key] = hasPermission(bits, Permissions[key])
    }
    return perms
  })
  const [detailMembers, setDetailMembers] = useState<Member[]>([])
  const [detailSaving, setDetailSaving] = useState(false)
  const [detailMembersLoading, setDetailMembersLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [memberSearch, setMemberSearch] = useState("")
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  useEffect(() => {
    if (detailTab !== "manage-members") return
    let mounted = true
    async function load() {
      setDetailMembersLoading(true)
      try {
        const res = await getRoleMembers(serverId, role.id)
        if (!mounted) return
        setDetailMembers(res.data ?? [])
      } catch {
      } finally {
        if (mounted) setDetailMembersLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [detailTab, serverId, role.id])

  async function saveRoleDetails() {
    if (!detailName.trim() || detailSaving) return
    setDetailSaving(true)
    try {
      const enabledKeys = (Object.keys(detailPermissions) as PermissionKey[]).filter((k) => detailPermissions[k])
      const bits = enabledKeys.reduce((acc, k) => acc | Permissions[k], 0n)
      const res = await updateRole(serverId, role.id, {
        name: detailName.trim(),
        color: detailColor,
        mentionable: detailMentionable,
        permissions: bits.toString(),
      })
      onRoleUpdated(res.data)
    } catch {
    } finally {
      setDetailSaving(false)
    }
  }

  async function removeSelectedRole() {
    try {
      await deleteRole(serverId, role.id)
      onRoleDeleted(role.id)
    } catch {
    }
  }

  const hasDetailChanges =
    detailName !== role.name ||
    detailColor !== (role.color ?? "#78716c") ||
    detailMentionable !== role.mentionable ||
    (Object.keys(detailPermissions) as PermissionKey[]).some(
      (k) => detailPermissions[k] !== hasPermission(BigInt(role.permissions), Permissions[k])
    )

  function resetDisplay() {
    setDetailName(role.name)
    setDetailColor(role.color ?? "#78716c")
    setDetailMentionable(role.mentionable)
    const bits = BigInt(role.permissions)
    const perms: Record<string, boolean> = {}
    for (const key of Object.keys(Permissions) as PermissionKey[]) {
      perms[key] = hasPermission(bits, Permissions[key])
    }
    setDetailPermissions(perms)
  }

  return (
    <div className="flex w-full max-w-160 flex-1 min-h-0 flex-col gap-5 pb-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="size-8" onClick={onBack}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full" style={{ backgroundColor: detailColor }} />
          <span className="text-base font-semibold">{role.name}</span>
        </div>
        {role.name !== "@everyone" && role.name !== "Admin" && (
          <>
            <Button variant="ghost" size="icon" className="ml-auto size-8 text-red-500" onClick={() => setDeleteDialogOpen(true)}>
              <Trash2 className="size-4" />
            </Button>
            <ServerRoleDeleteDialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
              roleName={role.name}
              onConfirm={removeSelectedRole}
            />
          </>
        )}
      </div>

      <Tabs value={detailTab} onValueChange={(v) => setDetailTab(v as DetailTab)} className="flex min-h-0 flex-1 flex-col gap-4">
        <TabsList variant="line" className="w-full justify-start">
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="manage-members">Manage Members</TabsTrigger>
        </TabsList>

        <ServerRoleDisplayTab
          name={detailName}
          color={detailColor}
          mentionable={detailMentionable}
          onNameChange={setDetailName}
          onColorChange={setDetailColor}
          onMentionableChange={setDetailMentionable}
        />

        <ServerRolePermissionsTab
          permissions={detailPermissions}
          onToggle={(key, checked) => setDetailPermissions((prev) => ({ ...prev, [key]: checked }))}
        />

        <ServerRoleMembersTab
          members={detailMembers}
          loading={detailMembersLoading}
          search={memberSearch}
          onSearchChange={setMemberSearch}
          onAddMember={() => setAddDialogOpen(true)}
          onRemoveMember={(userId) => setDetailMembers((prev) => prev.filter((m) => m.userId !== userId))}
        />

        {(detailTab === "display" || detailTab === "permissions") && hasDetailChanges && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetDisplay} disabled={detailSaving}>
              Reset
            </Button>
            <Button size="sm" onClick={saveRoleDetails} disabled={!detailName.trim() || detailSaving}>
              {detailSaving && <Loader2 className="size-3.5 animate-spin" />}
              Save Changes
            </Button>
          </div>
        )}
      </Tabs>

      <ServerRoleAddMembersDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        serverId={serverId}
        roleId={role.id}
        existingMemberUserIds={detailMembers.map((m) => m.userId)}
        onMembersAdded={(members) => setDetailMembers(members)}
      />
    </div>
  )
}
