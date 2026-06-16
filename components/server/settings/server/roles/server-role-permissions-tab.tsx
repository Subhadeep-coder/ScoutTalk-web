"use client"

import { Switch } from "@/components/ui/switch"
import { TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PERMISSION_GROUPS, PERMISSION_LABELS } from "@/lib/utils/permissions"
import type { PermissionKey } from "@/lib/utils/permissions"

type ServerRolePermissionsTabProps = Readonly<{
  permissions: Record<string, boolean>
  onToggle: (key: PermissionKey, checked: boolean) => void
}>

export function ServerRolePermissionsTab({ permissions, onToggle }: ServerRolePermissionsTabProps) {
  return (
    <TabsContent value="permissions" className="min-h-0 flex-1">
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-4">
          {PERMISSION_GROUPS.map((group) => (
            <div key={group.label} className="flex flex-col gap-0.5">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground px-1">{group.label}</h3>
              <div className="flex flex-col gap-1">
                {group.keys.map((key) => (
                  <label key={key} className="flex items-center justify-between gap-3 cursor-pointer rounded-md border bg-card px-3 py-2.5">
                    <span className="text-sm font-medium">{PERMISSION_LABELS[key]}</span>
                    <Switch
                      checked={permissions[key] ?? false}
                      onCheckedChange={(checked) => onToggle(key, checked)}
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </TabsContent>
  )
}
