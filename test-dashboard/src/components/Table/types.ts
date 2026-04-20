import type { ReactNode } from 'react'

export interface ColumnDefinition<T> {
  id: string
  header: string
  className?: string
  render: (row: T) => ReactNode
}

export interface DataTableProps<T extends { id: string }> {
  caption: string
  columns: ColumnDefinition<T>[]
  rows: T[]
  isLoading: boolean
  isFetchingMore: boolean
  hasNextPage: boolean
  emptyMessage: string
  onRowClick?: (row: T) => void
  onLoadMore?: () => void
  autoLoadRef?: (node: HTMLDivElement | null) => void
}