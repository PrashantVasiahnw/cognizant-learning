export const dashboardQueryKeys = {
  all: ['dashboard-records'] as const,
  detail: (recordId: string) => ['dashboard-record-detail', recordId] as const,
}