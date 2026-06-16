"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Link } from "lucide-react"
import { useActiveServerStore } from "@/lib/stores/active-server-store"

export function ServerTagContent() {
  const activeServer = useActiveServerStore((s) => s.activeServer)

  const [vanityCode, setVanityCode] = useState("")
  const [saving, setSaving] = useState(false)

  const hasChanges = vanityCode !== ""

  async function handleSave() {
    if (!vanityCode.trim() || saving) return
    setSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch {
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex gap-8">
      <div className="flex w-full max-w-160 flex-col gap-5 pb-4">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Vanity URL Code
          </Label>
          <p className="text-xs text-muted-foreground">
            Customize your server invite link. Members will be able to join at <span className="font-mono text-foreground">scouttalk.to/{vanityCode || "your-code"}</span>
          </p>
          <div className="relative mt-1">
            <Link className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              value={vanityCode}
              onChange={(e) => setVanityCode(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))}
              className="pl-9"
              placeholder="your-vanity-url"
            />
          </div>
        </div>

        {hasChanges && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setVanityCode("")}
              disabled={saving}
            >
              Reset
            </Button>
            <Button size="sm" onClick={handleSave} disabled={!vanityCode.trim() || saving}>
              {saving && <Loader2 className="size-3.5 animate-spin" />}
              Save Changes
            </Button>
          </div>
        )}
      </div>
      <div className="hidden w-70 shrink-0 lg:block">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {activeServer?.name ?? "Server"}
        </p>
        <div className="overflow-hidden rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              <Link className="size-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Vanity URL</span>
              <span className="text-xs text-muted-foreground">scouttalk.to/{vanityCode || "your-code"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
