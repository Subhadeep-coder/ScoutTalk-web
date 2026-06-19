"use client"

import { useCallback, useEffect, useState, type ReactNode } from "react"
import { Check, Copy } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createInvite } from "@/lib/services/servers"

type InviteDialogProps = Readonly<{
  serverId: string
  children: ReactNode
}>

export function InviteDialog({ serverId, children }: InviteDialogProps) {
  const [open, setOpen] = useState(false)
  const [inviteUrl, setInviteUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!open) {
      setInviteUrl("")
      setCopied(false)
      return
    }

    let cancelled = false
    setLoading(true)
    createInvite(serverId)
      .then(({ data }) => {
        if (!cancelled) setInviteUrl(data.inviteUrl)
      })
      .catch(() => toast.error("Failed to create invite"))
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [open, serverId])

  const handleCopy = useCallback(async () => {
    if (!inviteUrl) return
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Failed to copy to clipboard")
    }
  }, [inviteUrl])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite People</DialogTitle>
          <DialogDescription>
            Share this link with friends to invite them to your server
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <Input
            readOnly
            value={loading ? "Generating invite link..." : inviteUrl}
            className="flex-1"
          />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={handleCopy}
            disabled={!inviteUrl}
          >
            {copied ? <Check className="size-4 text-green-500" /> : <Copy className="size-4" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
