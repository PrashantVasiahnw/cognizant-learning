import { useEffect, useState } from 'react'
import type { UseInfiniteScrollSentinelOptions } from './types'

export type { UseInfiniteScrollSentinelOptions } from './types'

export const useInfiniteScrollSentinel = ({
  enabled,
  onIntersect,
}: UseInfiniteScrollSentinelOptions) => {
  const [element, setElement] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!enabled || !element) {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onIntersect()
        }
      },
      {
        rootMargin: '220px 0px',
      },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [element, enabled, onIntersect])

  return setElement
}