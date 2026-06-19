"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Loader2, Link, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getServerInvites, deleteInvite } from "@/lib/services/servers"

type Invite = {
  id: string
  code: string
  serverId: string
  createdBy: string
  channelId: string | null
  expiresAt: string
  maxUses: number | null
  useCount: number
  createdAt: string
  creator: {
    id: string
    username: string
    displayName: string
    avatar: string | null
  }
  inviteUrl: string
}

type ServerInvitesContentProps = Readonly<{
  serverId: string
}>

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function CountdownCell({ expiresAt }: Readonly<{ expiresAt: string | null }>) {
  const [now, setNow] = useState(Date.now())
  const timer = useRef<ReturnType<typeof setInterval>>(undefined)

  useEffect(() => {
    if (!expiresAt) return
    timer.current = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer.current)
  }, [expiresAt])

  if (!expiresAt) return <span className="text-sm text-muted-foreground">Never</span>

  const diff = new Date(expiresAt).getTime() - now
  if (diff <= 0) return <span className="text-sm text-destructive">Expired</span>

  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)

  const pad = (n: number) => n.toString().padStart(2, "0")

  return (
    <span className="text-sm text-muted-foreground whitespace-nowrap font-mono">
      {days}:{pad(hours)}:{pad(minutes)}:{pad(seconds)}
    </span>
  )
}

export function ServerInvitesContent({ serverId }: ServerInvitesContentProps) {
  const [invites, setInvites] = useState<Invite[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await getServerInvites(serverId)
      setInvites(data ?? [])
    } catch {
      toast.error("Failed to load invites")
    } finally {
      setLoading(false)
    }
  }, [serverId])

  useEffect(() => {
    load()
  }, [load])

  const sorted = useMemo(
    () => [...invites].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [invites],
  )

  async function handleRevoke(inviteId: string) {
    try {
      await deleteInvite(serverId, inviteId)
      setInvites((prev) => prev.filter((i) => i.id !== inviteId))
      toast.success("Invite revoked")
    } catch {
      toast.error("Failed to revoke invite")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 pb-4">
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-20 text-sm text-muted-foreground">
          <Link className="size-8" />
          <p className="text-base font-medium">No invites yet</p>
        </div>
      ) : (
        <ScrollArea className="max-h-[55vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Inviter</TableHead>
                <TableHead>Invite Code</TableHead>
                <TableHead>Uses</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((invite) => (
                <TableRow key={invite.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-9 shrink-0">
                        {invite.creator.avatar ? (
                          <AvatarImage src={invite.creator.avatar} />
                        ) : (
                          <AvatarFallback className="text-xs">
                            {invite.creator.displayName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-medium leading-tight">
                          {invite.creator.displayName}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          @{invite.creator.username}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{invite.code}</TableCell>
                  <TableCell className="text-sm">
                    {invite.maxUses ? `${invite.useCount} / ${invite.maxUses}` : invite.useCount}
                  </TableCell>
                  <TableCell>
                    <CountdownCell expiresAt={invite.expiresAt} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(invite.createdAt)}
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeleteId(invite.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Revoke Invite</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to revoke this invite? Anyone with this link will no longer be able to join.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            variant="destructive"
                            onClick={() => handleRevoke(invite.id)}
                          >
                            Revoke
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
    </div>
  )
}
