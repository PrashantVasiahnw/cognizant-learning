import { useState } from 'react'
import { useDashboardRecordDetail } from '../../api/hooks/useDashboardRecordDetail'
import { useDashboardRecords } from '../../api/hooks/useDashboardRecords'
import { DetailModal } from '../../components/Modal/DetailModal'
import {
  DataTable,
  type ColumnDefinition,
} from '../../components/Table/DataTable'
import { useInfiniteScrollSentinel } from '../../hooks/useInfiniteScrollSentinel'
import type { DashboardRecordSummary } from '../../types/dashboard'
import {
  formatDate,
  formatNumber,
  formatPercent,
  getErrorMessage,
} from '../../utils/formatters'

const columns: ColumnDefinition<DashboardRecordSummary>[] = [
  {
    id: 'segment',
    header: 'Segment',
    render: (row) => (
      <div>
        <p className="fw-semibold mb-1">{row.name}</p>
        <p className="text-secondary mb-0 small">{row.id}</p>
      </div>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    render: (row) => <span className={`badge rounded-pill status-pill status-${row.status.toLowerCase()}`}>{row.status}</span>,
  },
  {
    id: 'owner',
    header: 'Owner',
    render: (row) => row.owner,
  },
  {
    id: 'region',
    header: 'Region',
    render: (row) => row.region,
  },
  {
    id: 'createdAt',
    header: 'Created',
    render: (row) => formatDate(row.createdAt),
  },
  {
    id: 'score',
    header: 'Score',
    className: 'text-end',
    render: (row) => <span className="fw-semibold">{row.score}</span>,
  },
  {
    id: 'trend',
    header: 'Trend',
    className: 'text-end',
    render: (row) => <span className={row.trend >= 0 ? 'text-success' : 'text-warning'}>{formatPercent(row.trend)}</span>,
  },
]

export const DashboardPage = () => {
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)
  const {
    rows,
    total,
    error,
    isError,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useDashboardRecords()
  const selectedSummary = rows.find((row) => row.id === selectedRecordId) ?? null
  const detailQuery = useDashboardRecordDetail(selectedRecordId)
  const sentinelRef = useInfiniteScrollSentinel({
    enabled: Boolean(hasNextPage) && !isFetchingNextPage,
    onIntersect: () => {
      void fetchNextPage()
    },
  })

  const healthyCount = rows.filter((row) => row.status === 'Healthy').length
  const warningCount = rows.filter((row) => row.status === 'Warning').length
  const criticalCount = rows.filter((row) => row.status === 'Critical').length

  return (
    <main className="dashboard-shell py-4 py-lg-5">
      <div className="container-xl">
        <section className="hero-panel rounded-5 p-4 p-lg-5 mb-4 mb-lg-5">
          <div className="row align-items-end g-4">
            <div className="col-12 col-lg-7">
              <p className="eyebrow mb-3">React 18 · Vite · TanStack Query · Storybook</p>
              <h1 className="headline-display mb-3">Operational telemetry with typed server-state and reusable UI.</h1>
              <p className="lead text-secondary mb-0">
                The dashboard loads records in batches of 50, opens on-demand modal detail queries, and renders chart definitions returned by the backend payload.
              </p>
            </div>
            <div className="col-12 col-lg-5">
              <div className="row g-3">
                <div className="col-6">
                  <article className="glass-subpanel rounded-4 p-3 h-100">
                    <p className="small text-uppercase text-secondary fw-semibold mb-2">Loaded records</p>
                    <p className="fs-2 fw-semibold mb-0">{formatNumber(rows.length)}</p>
                  </article>
                </div>
                <div className="col-6">
                  <article className="glass-subpanel rounded-4 p-3 h-100">
                    <p className="small text-uppercase text-secondary fw-semibold mb-2">Total available</p>
                    <p className="fs-2 fw-semibold mb-0">{formatNumber(total)}</p>
                  </article>
                </div>
                <div className="col-4">
                  <article className="metric-card metric-success rounded-4 p-3 h-100">
                    <p className="small text-uppercase fw-semibold mb-2">Healthy</p>
                    <p className="fs-4 fw-semibold mb-0">{healthyCount}</p>
                  </article>
                </div>
                <div className="col-4">
                  <article className="metric-card metric-warning rounded-4 p-3 h-100">
                    <p className="small text-uppercase fw-semibold mb-2">Warning</p>
                    <p className="fs-4 fw-semibold mb-0">{warningCount}</p>
                  </article>
                </div>
                <div className="col-4">
                  <article className="metric-card metric-danger rounded-4 p-3 h-100">
                    <p className="small text-uppercase fw-semibold mb-2">Critical</p>
                    <p className="fs-4 fw-semibold mb-0">{criticalCount}</p>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </section>

        {isError ? (
          <div className="alert alert-danger d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3" role="alert">
            <span>{getErrorMessage(error)}</span>
            <button type="button" className="btn btn-outline-danger" onClick={() => void refetch()}>
              Retry
            </button>
          </div>
        ) : null}

        <DataTable
          caption="Dashboard records"
          columns={columns}
          rows={rows}
          isLoading={isLoading}
          isFetchingMore={isFetchingNextPage}
          hasNextPage={Boolean(hasNextPage)}
          emptyMessage="No records matched the current view."
          onRowClick={(row) => setSelectedRecordId(row.id)}
          onLoadMore={() => void fetchNextPage()}
          autoLoadRef={sentinelRef}
        />

        <DetailModal
          show={Boolean(selectedRecordId)}
          summary={selectedSummary}
          detail={detailQuery.data}
          isLoading={detailQuery.isLoading}
          error={detailQuery.error}
          onClose={() => setSelectedRecordId(null)}
        />
      </div>
    </main>
  )
}