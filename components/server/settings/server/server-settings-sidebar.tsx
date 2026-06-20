"use client"

import { Fragment, useMemo } from "react"
import { BarChart3, FileText, Gavel, Info, Key, Settings, Shield, Smile, Sticker, Tag, Users, UserPlus } from "lucide-react"
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

export type ServerSettingsTab =
  | "server-profile"
  | "server-tag"
  | "engagement"
  | "emoji"
  | "stickers"
  | "members"
  | "roles"
  | "invites"
  | "access"
  | "audit-log"
  | "automod"

type Section = {
  header: string
  items: { id: ServerSettingsTab; label: string }[]
}

type ServerSettingsSidebarProps = Readonly<{
  serverName: string
  tab: ServerSettingsTab
  onTabChange: (tab: ServerSettingsTab) => void
  canManageRoles?: boolean
  canManageMembers?: boolean
  canViewAuditLog?: boolean
}>

export function ServerSettingsSidebar({ serverName, tab, onTabChange, canManageRoles, canManageMembers, canViewAuditLog }: ServerSettingsSidebarProps) {
  const sections: Section[] = useMemo(() => [
    {
      header: serverName,
      items: [
        { id: "server-profile", label: "Server Profile" },
        { id: "server-tag", label: "Server Tag" },
        { id: "engagement", label: "Engagement" },
      ],
    },
    {
      header: "Expression",
      items: [
        { id: "emoji", label: "Emoji" },
        { id: "stickers", label: "Stickers" },
      ],
    },
    {
      header: "People",
      items: [
        ...(canManageMembers ? [{ id: "members" as const, label: "Members" }] : []),
        ...(canManageRoles ? [{ id: "roles" as const, label: "Roles" }] : []),
        { id: "invites" as const, label: "Invites" },
        { id: "access" as const, label: "Access" },
      ],
    },
    {
      header: "Moderation",
      items: [
        ...(canViewAuditLog ? [{ id: "audit-log" as const, label: "Audit Log" }] : []),
        { id: "automod" as const, label: "AutoMod" },
      ],
    },
  ], [serverName, canManageRoles, canManageMembers, canViewAuditLog])

  const iconMap: Record<ServerSettingsTab, typeof Info> = {
    "server-profile": Info,
    "server-tag": Tag,
    engagement: BarChart3,
    emoji: Smile,
    stickers: Sticker,
    members: Users,
    roles: UserPlus,
    invites: Key,
    access: Shield,
    "audit-log": FileText,
    automod: Gavel,
  }

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r">
      <div className="flex items-center gap-2 px-4 py-4">
        <Settings className="size-5 text-muted-foreground" />
        <span className="truncate text-sm font-semibold">{serverName}</span>
      </div>
      <SidebarContent className="gap-0">
        {sections.map((section, i) => (
          <Fragment key={i}>
            {i > 0 && <SidebarSeparator />}
            <SidebarGroup className="pb-2">
              <SidebarGroupLabel>{section.header}</SidebarGroupLabel>
              <SidebarMenu>
                {section.items.map((item) => {
                  const Icon = iconMap[item.id]
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton isActive={tab === item.id} onClick={() => onTabChange(item.id)}>
                        <Icon className="size-4" />
                        {item.label}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroup>
          </Fragment>
        ))}
      </SidebarContent>
    </aside>
  )
}
