import { create } from "zustand"

type Server = {
  id: string
  name: string
  ownerId: string
  avatar?: string
  createdAt: string
}

type ServerState = {
  servers: Server[]
  activeServerId: string | null
  pendingVoiceChatChannelId: string | null
  setServers: (servers: Server[]) => void
  addServer: (server: Server) => void
  setActiveServerId: (id: string | null) => void
  setPendingVoiceChatChannelId: (id: string | null) => void
}

export const useServerStore = create<ServerState>((set) => ({
  servers: [],
  activeServerId: null,
  pendingVoiceChatChannelId: null,
  setServers: (servers) => set({ servers }),
  addServer: (server) => set((state) => ({ servers: [...state.servers, server] })),
  setActiveServerId: (id) => set({ activeServerId: id }),
  setPendingVoiceChatChannelId: (id) => set({ pendingVoiceChatChannelId: id }),
}))
