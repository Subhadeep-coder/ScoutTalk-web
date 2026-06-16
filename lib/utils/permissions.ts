export const Permissions = {
  VIEW_CHANNEL: 1n << 0n,
  MANAGE_CHANNELS: 1n << 1n,
  MANAGE_ROLES: 1n << 2n,
  CREATE_EXPRESSIONS: 1n << 3n,
  MANAGE_EXPRESSIONS: 1n << 4n,
  VIEW_AUDIT_LOG: 1n << 5n,
  VIEW_SERVER_INSIGHTS: 1n << 6n,
  MANAGE_WEBHOOKS: 1n << 7n,
  MANAGE_GUILD: 1n << 8n,

  CREATE_INSTANT_INVITE: 1n << 9n,
  CHANGE_NICKNAME: 1n << 10n,
  MANAGE_NICKNAMES: 1n << 11n,
  KICK_MEMBERS: 1n << 12n,
  BAN_MEMBERS: 1n << 13n,
  MODERATE_MEMBERS: 1n << 14n,

  SEND_MESSAGES: 1n << 15n,
  EMBED_LINKS: 1n << 16n,
  ATTACH_FILES: 1n << 17n,
  ADD_REACTIONS: 1n << 18n,
  USE_EXTERNAL_EMOJIS: 1n << 19n,
  USE_EXTERNAL_STICKERS: 1n << 20n,
  MENTION_EVERYONE: 1n << 21n,
  MANAGE_MESSAGES: 1n << 22n,
  READ_MESSAGE_HISTORY: 1n << 23n,
  SEND_TTS_MESSAGES: 1n << 24n,

  CONNECT: 1n << 25n,
  SPEAK: 1n << 26n,
  VIDEO: 1n << 27n,
  USE_VAD: 1n << 28n,
  PRIORITY_SPEAKER: 1n << 29n,
  MUTE_MEMBERS: 1n << 30n,
  DEAFEN_MEMBERS: 1n << 31n,
  MOVE_MEMBERS: 1n << 32n,
  SET_VOICE_CHANNEL_STATUS: 1n << 33n,
  REQUEST_TO_SPEAK: 1n << 34n,
  USE_SOUNDBOARD: 1n << 35n,
  USE_EXTERNAL_SOUNDS: 1n << 36n,
} as const

export type PermissionKey = keyof typeof Permissions

export const ALL_PERMISSIONS = (1n << 37n) - 1n

export const EVERYONE_DEFAULT_PERMISSIONS =
  Permissions.VIEW_CHANNEL |
  Permissions.CREATE_INSTANT_INVITE |
  Permissions.CHANGE_NICKNAME |
  Permissions.SEND_MESSAGES |
  Permissions.EMBED_LINKS |
  Permissions.ATTACH_FILES |
  Permissions.ADD_REACTIONS |
  Permissions.READ_MESSAGE_HISTORY |
  Permissions.CONNECT |
  Permissions.SPEAK |
  Permissions.VIDEO |
  Permissions.USE_VAD

export function hasPermission(bits: bigint, required: bigint) {
  return (bits & required) !== 0n
}

export function computePermissions(keys: PermissionKey[]): bigint {
  let bits = 0n
  for (const key of keys) {
    bits |= Permissions[key]
  }
  return bits
}

export const PERMISSION_LABELS: Record<PermissionKey, string> = {
  VIEW_CHANNEL: "View Channels",
  MANAGE_CHANNELS: "Manage Channels",
  MANAGE_ROLES: "Manage Roles",
  CREATE_EXPRESSIONS: "Create Expressions",
  MANAGE_EXPRESSIONS: "Manage Expressions",
  VIEW_AUDIT_LOG: "View Audit Log",
  VIEW_SERVER_INSIGHTS: "View Server Insights",
  MANAGE_WEBHOOKS: "Manage Webhooks",
  MANAGE_GUILD: "Manage Server",
  CREATE_INSTANT_INVITE: "Create Invite",
  CHANGE_NICKNAME: "Change Nickname",
  MANAGE_NICKNAMES: "Manage Nicknames",
  KICK_MEMBERS: "Kick Members",
  BAN_MEMBERS: "Ban Members",
  MODERATE_MEMBERS: "Moderate Members",
  SEND_MESSAGES: "Send Messages",
  EMBED_LINKS: "Embed Links",
  ATTACH_FILES: "Attach Files",
  ADD_REACTIONS: "Add Reactions",
  USE_EXTERNAL_EMOJIS: "Use External Emoji",
  USE_EXTERNAL_STICKERS: "Use External Stickers",
  MENTION_EVERYONE: "Mention @everyone",
  MANAGE_MESSAGES: "Manage Messages",
  READ_MESSAGE_HISTORY: "Read Message History",
  SEND_TTS_MESSAGES: "Send TTS Messages",
  CONNECT: "Connect",
  SPEAK: "Speak",
  VIDEO: "Video",
  USE_VAD: "Use Voice Activity",
  PRIORITY_SPEAKER: "Priority Speaker",
  MUTE_MEMBERS: "Mute Members",
  DEAFEN_MEMBERS: "Deafen Members",
  MOVE_MEMBERS: "Move Members",
  SET_VOICE_CHANNEL_STATUS: "Set Voice Channel Status",
  REQUEST_TO_SPEAK: "Request to Speak",
  USE_SOUNDBOARD: "Use Soundboard",
  USE_EXTERNAL_SOUNDS: "Use External Sounds",
}

export const PERMISSION_GROUPS: { label: string; keys: PermissionKey[] }[] = [
  {
    label: "General",
    keys: [
      "VIEW_CHANNEL", "MANAGE_CHANNELS", "MANAGE_ROLES",
      "CREATE_EXPRESSIONS", "MANAGE_EXPRESSIONS", "VIEW_AUDIT_LOG",
      "VIEW_SERVER_INSIGHTS", "MANAGE_WEBHOOKS", "MANAGE_GUILD",
    ],
  },
  {
    label: "Members",
    keys: ["CREATE_INSTANT_INVITE", "CHANGE_NICKNAME", "MANAGE_NICKNAMES", "KICK_MEMBERS", "BAN_MEMBERS", "MODERATE_MEMBERS"],
  },
  {
    label: "Text",
    keys: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "ADD_REACTIONS", "USE_EXTERNAL_EMOJIS", "USE_EXTERNAL_STICKERS", "MENTION_EVERYONE", "MANAGE_MESSAGES", "READ_MESSAGE_HISTORY", "SEND_TTS_MESSAGES"],
  },
  {
    label: "Voice",
    keys: ["CONNECT", "SPEAK", "VIDEO", "USE_VAD", "PRIORITY_SPEAKER", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "SET_VOICE_CHANNEL_STATUS", "REQUEST_TO_SPEAK", "USE_SOUNDBOARD", "USE_EXTERNAL_SOUNDS"],
  },
]
