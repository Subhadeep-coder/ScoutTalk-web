"use client"

import { Loader2, Search, UserPlus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

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

type ServerRoleMembersTabProps = Readonly<{
  members: Member[]
  loading: boolean
  search: string
  onSearchChange: (search: string) => void
  onAddMember: () => void
  onRemoveMember: (memberId: string) => void
}>

export function ServerRoleMembersTab({
  members,
  loading,
  search,
  onSearchChange,
  onAddMember,
  onRemoveMember,
}: ServerRoleMembersTabProps) {
  const filtered = members.filter((m) =>
    m.user.displayName.toLowerCase().includes(search.toLowerCase()) ||
    m.user.username.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <TabsContent value="manage-members" className="flex min-h-0 flex-1 flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search members..."
            className="h-9 pl-8"
          />
        </div>
        <Button size="sm" onClick={onAddMember}>
          <UserPlus className="size-4" />
          Add Member
        </Button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <ScrollArea className="min-h-0 flex-1">
          <div className="flex flex-col gap-2">
            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No members match your search.</p>
            ) : (
              filtered.map((member) => (
                <div key={member.id} className="flex items-center gap-3 rounded-md border bg-card px-3 py-2">
                  {member.user.avatar ? (
                    <img src={member.user.avatar} alt="" className="size-8 rounded-full object-cover" />
                  ) : (
                    <div className="size-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                      {member.user.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{member.user.displayName}</span>
                    <span className="text-xs text-muted-foreground">@{member.user.username}</span>
                  </div>
                  <Button variant="ghost" size="icon" className="ml-auto size-7 text-muted-foreground hover:text-red-500" onClick={() => onRemoveMember(member.userId)}>
                    <X className="size-3.5" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      )}
    </TabsContent>
  )
}
