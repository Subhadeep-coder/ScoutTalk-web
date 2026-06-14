"use client"

import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type ChannelSettingsOverviewProps = Readonly<{
  editedName: string
  savedName: string
  saving: boolean
  onNameChange: (name: string) => void
  onReset: () => void
  onSave: () => void
}>

export function ChannelSettingsOverview({
  editedName,
  savedName,
  saving,
  onNameChange,
  onReset,
  onSave,
}: ChannelSettingsOverviewProps) {
  const hasChanges = editedName !== savedName

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-heading text-lg font-semibold">Overview</h2>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Channel Name</label>
        <input
          type="text"
          value={editedName}
          onChange={(e) => onNameChange(e.target.value)}
          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      {hasChanges && (
        <div className="flex gap-3">
          <Button variant="outline" onClick={onReset} disabled={saving}>
            Reset
          </Button>
          <Button onClick={onSave} disabled={!editedName.trim() || saving}>
            {saving && <Loader2 className="size-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      )}
    </div>
  )
}
