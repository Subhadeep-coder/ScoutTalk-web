"use client"

import { useEffect, useMemo, useState } from "react"
import { Link, Loader2, MoreVertical, Search, SlidersVertical, Users } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getServerMembers } from "@/lib/services/servers"

type MemberRole = {
  id: string
  memberId: string
  roleId: string
  assignedAt: string
  role: {
    name: string
    color: string | null
  }
}

type Member = {
  id: string
  userId: string
  serverId: string
  role: "OWNER" | "MEMBER"
  joinedAt: string
  joinedViaInviteId: string | null
  invite: {
    code: string
    creator: {
      id: string
      displayName: string
      avatar: string | null
    }
  } | null
  user: {
    id: string
    username: string
    firstName: string
    lastName: string
    displayName: string
    avatar: string | null
  }
  memberRoles: MemberRole[]
}

type ServerMembersContentProps = Readonly<{
  serverId: string
}>

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days < 1) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  if (months === 1) return "1 month ago"
  if (months < 12) return `${months} months ago`
  const years = Math.floor(months / 12)
  return `${years} year${years > 1 ? "s" : ""} ago`
}

export function ServerMembersContent({ serverId }: ServerMembersContentProps) {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getServerMembers(serverId)
      .then((res) => {
        if (!cancelled) setMembers(res.data ?? [])
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [serverId])

  const sorted = useMemo(
    () => [...members].sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()),
    [members],
  )

  const filtered = useMemo(
    () =>
      sorted.filter(
        (m) =>
          m.user.displayName.toLowerCase().includes(search.toLowerCase()) ||
          m.user.username.toLowerCase().includes(search.toLowerCase()),
      ),
    [sorted, search],
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="relative max-w-80">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {members.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-20 text-sm text-muted-foreground">
          <Users className="size-8" />
          <p className="text-base font-medium">No members</p>
        </div>
      ) : (
        <ScrollArea className="max-h-[55vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead><span className="inline-flex items-center gap-1">Member Since <SlidersVertical className="size-4 text-muted-foreground/50" /></span></TableHead>
                <TableHead><span className="inline-flex items-center gap-1">Joined <SlidersVertical className="size-4 text-muted-foreground/50" /></span></TableHead>
                <TableHead><span className="inline-flex items-center gap-1">Joining Method <SlidersVertical className="size-4 text-muted-foreground/50" /></span></TableHead>
                <TableHead><span className="inline-flex items-center gap-1">Roles <SlidersVertical className="size-4 text-muted-foreground/50" /></span></TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    No members match your search
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-9 shrink-0">
                          {member.user.avatar ? (
                            <AvatarImage src={member.user.avatar} />
                          ) : (
                            <AvatarFallback className="text-xs">
                              {member.user.displayName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate text-sm font-medium leading-tight">
                            {member.user.displayName}
                          </span>
                          <span className="truncate text-xs text-muted-foreground">
                            @{member.user.username}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatDate(member.joinedAt)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {relativeTime(member.joinedAt)}
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {member.role === "OWNER" ? (
                        <span className="text-yellow-500">Created Server</span>
                      ) : member.invite ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="secondary"
                              className="cursor-pointer text-xs font-normal"
                            >
                              <Link className="mr-1 size-3" />
                              {member.invite.code}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent side="top" sideOffset={8} align="center" hideArrow className="flex items-center gap-2 border bg-popover text-popover-foreground">
                            <span className="text-xs">Invited by</span>
                            <Avatar className="size-5">
                              {member.invite.creator.avatar ? (
                                <AvatarImage src={member.invite.creator.avatar} />
                              ) : (
                                <AvatarFallback className="text-[10px]">
                                  {member.invite.creator.displayName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <span className="text-xs font-medium">{member.invite.creator.displayName}</span>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <span>Direct</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {member.memberRoles
                          .filter((mr) => mr.role.name !== "@everyone")
                          .map((mr) => (
                            <Badge
                              key={mr.id}
                              variant="secondary"
                              className="text-xs font-normal"
                              style={mr.role.color ? { color: mr.role.color, borderColor: mr.role.color } : undefined}
                            >
                              {mr.role.name}
                            </Badge>
                          ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button type="button" variant="ghost" size="icon" className="size-8">
                        <MoreVertical className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
    </div>
  )
}
