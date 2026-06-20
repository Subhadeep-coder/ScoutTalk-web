import { useActiveServerStore } from "@/lib/stores/active-server-store"
import { Permissions, hasPermission, type PermissionKey } from "@/lib/utils/permissions"

export function usePermissions() {
  const activeServer = useActiveServerStore((s) => s.activeServer)

  function serverBits(): bigint | null {
    if (!activeServer?.memberPermissions) return null
    try {
      return BigInt(activeServer.memberPermissions)
    } catch {
      return null
    }
  }

  function can(permission: PermissionKey): boolean {
    const bits = serverBits()
    if (bits === null) return false
    return hasPermission(bits, Permissions[permission])
  }

  function getChannelBits(channelId: string): bigint | null {
    const channelPerms = activeServer?.channelPermissions?.[channelId]
    if (channelPerms) {
      try {
        return BigInt(channelPerms)
      } catch {
        return null
      }
    }
    return serverBits()
  }

  function canInChannel(channelId: string, permission: PermissionKey): boolean {
    const bits = getChannelBits(channelId)
    if (bits === null) return false
    return hasPermission(bits, Permissions[permission])
  }

  return { can, canInChannel }
}
