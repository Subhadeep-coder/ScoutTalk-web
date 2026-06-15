import type { ServerSettingsTab } from "@/components/server/settings/server/server-settings-sidebar"

export const tabMeta: Record<ServerSettingsTab, { title: string; description: string }> = {
  "server-profile": {
    title: "Server Profile",
    description: "Tell us about your server. This information will be shown to anyone who visits your server.",
  },
  "server-tag": {
    title: "Server Tag",
    description: "Set a vanity URL for your server so members can join using a custom link.",
  },
  engagement: {
    title: "Engagement",
    description: "Configure how your server welcomes and engages new members.",
  },
  emoji: { title: "Emoji", description: "Manage custom emoji." },
  stickers: { title: "Stickers", description: "Manage server stickers." },
  members: { title: "Members", description: "Manage server members." },
  roles: { title: "Roles", description: "Manage roles and permissions." },
  invites: { title: "Invites", description: "Manage server invites." },
  access: { title: "Access", description: "Configure server access." },
  "audit-log": { title: "Audit Log", description: "View moderation logs." },
  automod: { title: "AutoMod", description: "Configure automated moderation." },
}
