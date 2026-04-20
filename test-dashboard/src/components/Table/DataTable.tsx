import type { KeyboardEvent } from 'react'
import type { ColumnDefinition, DataTableProps } from './types'

export type { ColumnDefinition, DataTableProps } from './types'

export const DataTable = <T extends { id: string }>({
  caption,
  columns,
  rows,
  isLoading,
  isFetchingMore,
  hasNextPage,
  emptyMessage,
  onRowClick,
  onLoadMore,
  autoLoadRef,
}: DataTableProps<T>) => {
  const handleRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, row: T) => {
    if ((event.key === 'Enter' || event.key === ' ') && onRowClick) {
      event.preventDefault()
      onRowClick(row)
    }
  }

  return (
    <section className="glass-panel rounded-4 p-3 p-lg-4 shadow-sm">
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-2 mb-3">
        <div>
          <h2 className="fs-4 fw-semibold mb-1">Operational pipeline</h2>
          <p className="text-secondary mb-0">Click a row to inspect server-fetched details and chart payloads.</p>
        </div>
        <span className="badge rounded-pill text-bg-light border px-3 py-2">{rows.length} loaded</span>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0 dashboard-table">
          <caption className="visually-hidden">{caption}</caption>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.id} className={column.className} scope="col">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="text-center py-5 text-secondary" colSpan={columns.length}>
                  <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  Loading the first records...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="text-center py-5 text-secondary" colSpan={columns.length}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className={onRowClick ? 'table-row-action' : undefined}
                  tabIndex={onRowClick ? 0 : -1}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  onKeyDown={(event) => handleRowKeyDown(event, row)}
                >
                  {columns.map((column) => (
                    <td key={column.id} className={column.className}>
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {rows.length > 0 ? (
        <div className="d-flex flex-column align-items-center gap-3 pt-4">
          <div ref={autoLoadRef} className="infinite-sentinel" aria-hidden="true" />
          {hasNextPage ? (
            <button
              type="button"
              className="btn btn-outline-dark rounded-pill px-4"
              onClick={onLoadMore}
              disabled={isFetchingMore}
            >
              {isFetchingMore ? 'Loading the next 50...' : 'Load the next 50'}
            </button>
          ) : (
            <span className="small text-secondary">You have reached the end of the dataset.</span>
          )}
        </div>
      ) : null}
    </section>
  )
}