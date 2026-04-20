export type DashboardRecordStatus = 'Healthy' | 'Warning' | 'Critical'
export type SupportedChartType = 'line' | 'bar' | 'area' | 'pie'
export type MetricTone = 'neutral' | 'success' | 'warning' | 'danger'

export interface DashboardRecordSummary {
  id: string
  name: string
  status: DashboardRecordStatus
  owner: string
  region: string
  createdAt: string
  score: number
  trend: number
  volume: number
}

export interface DashboardPageParams {
  offset: number
  limit: number
}

export interface DashboardRecordsPage {
  items: DashboardRecordSummary[]
  total: number
  limit: number
  nextOffset: number | null
}

export interface ChartSeriesDefinition {
  key: string
  label: string
  color: string
  stackId?: string
}

export interface ChartPoint {
  label: string
  fill?: string
  [key: string]: number | string | undefined
}

export interface ChartDefinition {
  type: SupportedChartType
  title: string
  subtitle?: string
  data: ChartPoint[]
  series: ChartSeriesDefinition[]
  xKey: string
}

export interface DashboardMetric {
  label: string
  value: string
  tone?: MetricTone
}

export interface DashboardRecordDetail {
  id: string
  description: string
  lastUpdated: string
  tags: string[]
  metrics: DashboardMetric[]
  chart: ChartDefinition
}