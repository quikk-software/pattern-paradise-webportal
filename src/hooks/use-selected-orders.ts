import { useState } from "react"

export function useSelectedOrders<T extends { id: string }>(items: T[]) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const isSelected = (id: string) => selectedIds.includes(id)
  const isAllSelected = items.length > 0 && items.every((item) => selectedIds.includes(item.id))

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const toggleAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !items.some((item) => item.id === id)))
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...items.map((item) => item.id)])])
    }
  }

  const clearSelection = () => {
    setSelectedIds([])
  }

  return {
    selectedIds,
    isSelected,
    isAllSelected,
    toggleSelection,
    toggleAll,
    clearSelection,
  }
}

