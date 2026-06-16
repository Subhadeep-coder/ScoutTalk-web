"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { TabsContent } from "@/components/ui/tabs"
import { ColorPicker } from "@/components/ui/color-picker"

type ServerRoleDisplayTabProps = Readonly<{
  name: string
  color: string
  mentionable: boolean
  onNameChange: (name: string) => void
  onColorChange: (color: string) => void
  onMentionableChange: (mentionable: boolean) => void
}>

export function ServerRoleDisplayTab({
  name,
  color,
  mentionable,
  onNameChange,
  onColorChange,
  onMentionableChange,
}: ServerRoleDisplayTabProps) {
  return (
    <TabsContent value="display" className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Role Name
        </Label>
        <Input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="h-9"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Role Color
        </Label>
        <ColorPicker value={color} onChange={onColorChange} />
      </div>

      <label className="flex items-center justify-between gap-3 cursor-pointer">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">Mentionable</span>
          <span className="text-xs text-muted-foreground">Allow this role to be mentioned with @role</span>
        </div>
        <Switch
          checked={mentionable}
          onCheckedChange={onMentionableChange}
        />
      </label>
    </TabsContent>
  )
}
