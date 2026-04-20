const parsedPageSize = Number(import.meta.env.VITE_PAGE_SIZE ?? '50')

if (Number.isNaN(parsedPageSize) || parsedPageSize <= 0) {
  throw new Error('VITE_PAGE_SIZE must be a positive number.')
}

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL?.trim() ?? '',
  pageSize: parsedPageSize,
  useMockApi: import.meta.env.VITE_USE_MOCK_API === 'true',
} as const

if (!env.useMockApi && env.apiBaseUrl.length === 0) {
  throw new Error('VITE_API_BASE_URL is required when VITE_USE_MOCK_API is false.')
}