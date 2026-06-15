import { create } from "zustand"

type Category = {
  id: string
  name: string
  position: number
}

type Channel = {
  id: string
  name: string
  categoryId: string
  type: "TEXT" | "VOICE"
  position: number
}

export type ActiveServer = {
  id: string
  name: string
  avatar?: string | null
  banner?: string | null
  description?: string | null
  categories: Category[]
  channels: Channel[]
}

type ActiveServerState = {
  activeServer: ActiveServer | null
  setActiveServer: (server: ActiveServer | null) => void
  activeChannelId: string | null
  setActiveChannelId: (id: string | null) => void
}

export const useActiveServerStore = create<ActiveServerState>((set) => ({
  activeServer: null,
  setActiveServer: (server) => set({ activeServer: server }),
  activeChannelId: null,
  setActiveChannelId: (id) => set({ activeChannelId: id }),
}))
