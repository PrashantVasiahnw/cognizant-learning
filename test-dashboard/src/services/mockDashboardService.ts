import type {
  ChartDefinition,
  ChartPoint,
  DashboardPageParams,
  DashboardRecordDetail,
  DashboardRecordsPage,
  DashboardRecordStatus,
  DashboardRecordSummary,
} from '../types/dashboard'

const owners = ['Avery Clark', 'Jordan Singh', 'Noah Bennett', 'Priya Patel']
const regions = ['North America', 'EMEA', 'APAC', 'LATAM']
const statuses: DashboardRecordStatus[] = ['Healthy', 'Warning', 'Critical']
const chartPalette = ['#0d6efd', '#fd7e14', '#198754', '#dc3545', '#20c997']

const createDate = (index: number): string => {
  const date = new Date('2026-01-01T08:00:00.000Z')
  date.setDate(date.getDate() + index)
  return date.toISOString()
}

export const mockDashboardRecords: DashboardRecordSummary[] = Array.from(
  { length: 180 },
  (_, index) => ({
    id: `record-${index + 1}`,
    name: `Pipeline Segment ${index + 1}`,
    status: statuses[index % statuses.length],
    owner: owners[index % owners.length],
    region: regions[index % regions.length],
    createdAt: createDate(index),
    score: 62 + ((index * 7) % 34),
    trend: ((index % 9) - 4) * 2.6,
    volume: 820 + index * 23,
  }),
)

const monthlySeries = (seed: number): ChartPoint[] => {
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((label, index) => ({
    label,
    actual: 40 + seed + index * 4,
    target: 38 + seed + index * 3,
    forecast: 43 + seed + index * 3.4,
  }))
}

const stackedSeries = (seed: number): ChartPoint[] => {
  return ['Queue', 'Processing', 'Resolved', 'Escalated'].map((label, index) => ({
    label,
    current: 20 + seed + index * 6,
    prior: 12 + seed + index * 5,
  }))
}

const pieSeries = (seed: number): ChartPoint[] => {
  return [
    { label: 'Adopted', value: 44 + seed, fill: chartPalette[0] },
    { label: 'Pending', value: 26 + seed / 2, fill: chartPalette[1] },
    { label: 'Blocked', value: 12 + seed / 3, fill: chartPalette[3] },
    { label: 'Churn Risk', value: 18 + seed / 4, fill: chartPalette[4] },
  ]
}

const createChart = (recordIndex: number): ChartDefinition => {
  const seed = (recordIndex % 11) + 6

  switch (recordIndex % 4) {
    case 0:
      return {
        type: 'line',
        title: 'Conversion momentum',
        subtitle: 'Actual vs target throughput over the last six checkpoints.',
        xKey: 'label',
        data: monthlySeries(seed),
        series: [
          { key: 'actual', label: 'Actual', color: chartPalette[0] },
          { key: 'target', label: 'Target', color: chartPalette[1] },
          { key: 'forecast', label: 'Forecast', color: chartPalette[2] },
        ],
      }
    case 1:
      return {
        type: 'bar',
        title: 'Stage throughput',
        subtitle: 'Current period compared with the previous period.',
        xKey: 'label',
        data: stackedSeries(seed),
        series: [
          { key: 'current', label: 'Current', color: chartPalette[0] },
          { key: 'prior', label: 'Previous', color: chartPalette[1] },
        ],
      }
    case 2:
      return {
        type: 'area',
        title: 'Backlog pressure',
        subtitle: 'Rolling movement between forecast and actual backlog.',
        xKey: 'label',
        data: monthlySeries(seed),
        series: [
          { key: 'forecast', label: 'Forecast', color: chartPalette[4] },
          { key: 'actual', label: 'Actual', color: chartPalette[0] },
        ],
      }
    default:
      return {
        type: 'pie',
        title: 'Portfolio share',
        subtitle: 'Distribution returned directly from the backend payload.',
        xKey: 'label',
        data: pieSeries(seed),
        series: [{ key: 'value', label: 'Share', color: chartPalette[0] }],
      }
  }
}

export const buildMockRecordDetail = (recordId: string): DashboardRecordDetail => {
  const recordIndex = Math.max(
    0,
    mockDashboardRecords.findIndex((record) => record.id === recordId),
  )

  const summary = mockDashboardRecords[recordIndex]

  return {
    id: summary.id,
    description:
      'This detail view keeps server state in TanStack Query while the modal remains a reusable, controlled UI component.',
    lastUpdated: new Date(Date.now() - recordIndex * 60_000 * 19).toISOString(),
    tags: [summary.region, summary.status, summary.owner.split(' ')[0]],
    metrics: [
      { label: 'Health score', value: `${summary.score}/100`, tone: 'success' },
      { label: 'Volume', value: `${summary.volume}`, tone: 'neutral' },
      { label: 'Trend', value: `${summary.trend > 0 ? '+' : ''}${summary.trend.toFixed(1)}%`, tone: summary.trend >= 0 ? 'success' : 'warning' },
      { label: 'SLA risk', value: `${12 + (recordIndex % 8)}%`, tone: summary.status === 'Critical' ? 'danger' : 'warning' },
    ],
    chart: createChart(recordIndex),
  }
}

const withLatency = async <T,>(value: T): Promise<T> => {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(value), 350)
  })
}

export const fetchMockDashboardRecords = async (
  params: DashboardPageParams,
): Promise<DashboardRecordsPage> => {
  const { offset, limit } = params
  const items = mockDashboardRecords.slice(offset, offset + limit)
  const nextOffset = offset + limit < mockDashboardRecords.length ? offset + limit : null

  return withLatency({
    items,
    total: mockDashboardRecords.length,
    limit,
    nextOffset,
  })
}

export const fetchMockDashboardRecordDetail = async (
  recordId: string,
): Promise<DashboardRecordDetail> => {
  const matchingRecord = mockDashboardRecords.find((record) => record.id === recordId)

  if (!matchingRecord) {
    throw new Error('The requested record could not be found.')
  }

  return withLatency(buildMockRecordDetail(recordId))
}