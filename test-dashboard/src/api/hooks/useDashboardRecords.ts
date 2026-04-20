import {
  type InfiniteData,
  useInfiniteQuery,
} from '@tanstack/react-query'
import { dashboardQueryKeys } from '../queryKeys'
import { fetchDashboardRecords } from '../../services/dashboardService'
import type { DashboardRecordsPage } from '../../types/dashboard'
import { env } from '../../utils/env'

export const useDashboardRecords = () => {
  const query = useInfiniteQuery<
    DashboardRecordsPage,
    Error,
    InfiniteData<DashboardRecordsPage>,
    typeof dashboardQueryKeys.all,
    number
  >({
    queryKey: dashboardQueryKeys.all,
    queryFn: ({ pageParam }) =>
      fetchDashboardRecords({
        offset: pageParam,
        limit: env.pageSize,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
  })

  return {
    ...query,
    rows: query.data?.pages.flatMap((page) => page.items) ?? [],
    total: query.data?.pages[0]?.total ?? 0,
  }
}