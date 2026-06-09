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
  setServers: (servers: Server[]) => void
  addServer: (server: Server) => void
  setActiveServerId: (id: string | null) => void
}

export const useServerStore = create<ServerState>((set) => ({
  servers: [],
  activeServerId: null,
  setServers: (servers) => set({ servers }),
  addServer: (server) => set((state) => ({ servers: [...state.servers, server] })),
  setActiveServerId: (id) => set({ activeServerId: id }),
}))
