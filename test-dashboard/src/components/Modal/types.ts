import type {
  DashboardRecordDetail,
  DashboardRecordSummary,
} from '../../types/dashboard'

export interface DetailModalProps {
  show: boolean
  summary: DashboardRecordSummary | null
  detail: DashboardRecordDetail | undefined
  isLoading: boolean
  error: unknown
  onClose: () => void
}