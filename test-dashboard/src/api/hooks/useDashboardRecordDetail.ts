import { useQuery } from '@tanstack/react-query'
import { dashboardQueryKeys } from '../queryKeys'
import { fetchDashboardRecordDetail } from '../../services/dashboardService'

export const useDashboardRecordDetail = (recordId: string | null) => {
  return useQuery({
    queryKey: recordId ? dashboardQueryKeys.detail(recordId) : ['dashboard-record-detail-idle'],
    queryFn: () => fetchDashboardRecordDetail(recordId as string),
    enabled: Boolean(recordId),
  })
}