export const formatDate = (value: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value)
}

export const formatPercent = (value: number): string => {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong while loading data.'
}