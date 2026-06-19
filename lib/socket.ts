import { io, type Socket } from "socket.io-client"
import { create } from "zustand"

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"

let socket: Socket | null = null

type SocketState = {
  isConnected: boolean
  setIsConnected: (connected: boolean) => void
}

export const useSocketStore = create<SocketState>((set) => ({
  isConnected: false,
  setIsConnected: (connected) => set({ isConnected: connected }),
}))

export function connectSocket(token: string): Socket {
  if (socket?.connected) return socket

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  })

  socket.on("connect", () => {
    useSocketStore.getState().setIsConnected(true)
  })

  socket.on("disconnect", () => {
    useSocketStore.getState().setIsConnected(false)
  })

  socket.on("connect_error", () => {
    useSocketStore.getState().setIsConnected(false)
  })

  return socket
}

export function disconnectSocket(): void {
  socket?.disconnect()
  socket = null
  useSocketStore.getState().setIsConnected(false)
}

export function getSocket(): Socket | null {
  return socket
}

export function joinServer(serverId: string): void {
  socket?.emit("joinServer", serverId)
}

export function leaveServer(serverId: string): void {
  socket?.emit("leaveServer", serverId)
}

export function startTyping(channelId: string, serverId: string): void {
  socket?.emit("typing:start", { channelId, serverId })
}

export function stopTyping(channelId: string, serverId: string): void {
  socket?.emit("typing:stop", { channelId, serverId })
}
