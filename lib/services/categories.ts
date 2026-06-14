import apiClient from "@/lib/api-client"

export function createCategory(data: {
  name: string
  serverId: string
}) {
  return apiClient.post("/categories", data)
}

export function reorderCategories(data: {
  serverId: string
  order: string[]
}) {
  return apiClient.patch("/categories/reorder", data)
}
