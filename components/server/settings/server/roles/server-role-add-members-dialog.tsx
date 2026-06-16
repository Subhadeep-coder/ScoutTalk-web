"use client"

import { useEffect, useState } from "react"
import { Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getServerMembers, addRoleMembers, getRoleMembers } from "@/lib/services/servers"

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

type ServerRoleAddMembersDialogProps = Readonly<{
  open: boolean
  onOpenChange: (open: boolean) => void
  serverId: string
  roleId: string
  existingMemberUserIds: string[]
  onMembersAdded: (members: Member[]) => void
}>

export function ServerRoleAddMembersDialog({
  open,
  onOpenChange,
  serverId,
  roleId,
  existingMemberUserIds,
  onMembersAdded,
}: ServerRoleAddMembersDialogProps) {
  const [allMembers, setAllMembers] = useState<Member[]>([])
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([])
  const [search, setSearch] = useState("")
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    if (!open) return
    let mounted = true
    async function load() {
      try {
        const res = await getServerMembers(serverId)
        if (!mounted) return
        const existingSet = new Set(existingMemberUserIds)
        setAllMembers((res.data ?? []).filter((m: Member) => !existingSet.has(m.userId)))
      } catch {
      }
    }
    load()
    return () => { mounted = false }
  }, [open, serverId, existingMemberUserIds])

  const filtered = allMembers.filter((m) =>
    m.user.displayName.toLowerCase().includes(search.toLowerCase()) ||
    m.user.username.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setSearch("") }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Members</DialogTitle>
          <DialogDescription>Select members to add to this role.</DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members..."
            className="h-9 pl-8"
          />
        </div>
        {allMembers.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No members available to add.</p>
        ) : (
          <ScrollArea className="max-h-60">
            <div className="flex flex-col gap-1 pr-3">
              {filtered.map((member) => {
                const checked = selectedMemberIds.includes(member.userId)
                return (
                  <label
                    key={member.id}
                    className="flex items-center gap-3 rounded-md px-2 py-2 cursor-pointer hover:bg-accent/50 transition-colors"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => {
                        setSelectedMemberIds((prev) =>
                          checked ? prev.filter((id) => id !== member.userId) : [...prev, member.userId]
                        )
                      }}
                    />
                    {member.user.avatar ? (
                      <img src={member.user.avatar} alt="" className="size-7 rounded-full object-cover" />
                    ) : (
                      <div className="size-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                        {member.user.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{member.user.displayName}</span>
                      <span className="text-xs text-muted-foreground">@{member.user.username}</span>
                    </div>
                  </label>
                )
              })}
            </div>
          </ScrollArea>
        )}
        <DialogFooter className="grid grid-cols-2 gap-2 w-full sm:grid-cols-2">
          <Button variant="outline" className="w-full" onClick={() => { setSelectedMemberIds([]); onOpenChange(false) }}>Cancel</Button>
          <Button className="w-full"
            onClick={async () => {
              if (selectedMemberIds.length === 0 || adding) return
              setAdding(true)
              try {
                await addRoleMembers(serverId, roleId, { memberIds: selectedMemberIds })
                const res = await getRoleMembers(serverId, roleId)
                onMembersAdded(res.data ?? [])
                setSelectedMemberIds([])
                onOpenChange(false)
              } catch {
              } finally {
                setAdding(false)
              }
            }}
            disabled={selectedMemberIds.length === 0 || adding}
          >
            {adding && <Loader2 className="size-3.5 animate-spin" />}
            Add {selectedMemberIds.length > 0 ? `(${selectedMemberIds.length})` : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
