import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { DynamicChart } from '../Chart/DynamicChart'
import type { DetailModalProps } from './types'
import { formatDate, getErrorMessage } from '../../utils/formatters'

export type { DetailModalProps } from './types'

export const DetailModal = ({
  show,
  summary,
  detail,
  isLoading,
  error,
  onClose,
}: DetailModalProps) => {
  useEffect(() => {
    if (!show) {
      return undefined
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, show])

  if (!show || !summary) {
    return null
  }

  return createPortal(
    <>
      <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
          <div className="modal-content border-0 rounded-5 overflow-hidden">
            <div className="modal-header border-0 px-4 px-lg-5 pt-4 pt-lg-5 pb-3">
              <div>
                <p className="text-uppercase small text-secondary fw-semibold mb-2">Record detail</p>
                <h2 className="modal-title fs-3 fw-semibold mb-1">{summary.name}</h2>
                <p className="text-secondary mb-0">
                  {summary.owner} in {summary.region} · Created {formatDate(summary.createdAt)}
                </p>
              </div>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>

            <div className="modal-body px-4 px-lg-5 pb-5">
              {isLoading ? (
                <div className="d-flex align-items-center justify-content-center min-vh-25 text-secondary">
                  <div className="spinner-border me-3" role="status" aria-hidden="true" />
                  Loading record detail...
                </div>
              ) : error ? (
                <div className="alert alert-danger mb-0" role="alert">
                  {getErrorMessage(error)}
                </div>
              ) : detail ? (
                <div className="d-flex flex-column gap-4">
                  <div className="glass-subpanel rounded-4 p-4">
                    <p className="text-secondary mb-3">{detail.description}</p>
                    <div className="d-flex flex-wrap gap-2 mb-4">
                      {detail.tags.map((tag) => (
                        <span key={tag} className="badge rounded-pill text-bg-light border px-3 py-2">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="row g-3">
                      {detail.metrics.map((metric) => (
                        <div key={metric.label} className="col-12 col-md-6">
                          <article className={`metric-card metric-${metric.tone ?? 'neutral'} rounded-4 p-3 h-100`}>
                            <p className="text-secondary small text-uppercase fw-semibold mb-2">{metric.label}</p>
                            <p className="fs-3 fw-semibold mb-0">{metric.value}</p>
                          </article>
                        </div>
                      ))}
                    </div>
                  </div>
                  <DynamicChart chart={detail.chart} height={320} />
                </div>
              ) : (
                <div className="alert alert-secondary mb-0" role="alert">
                  No detail payload was returned for this record.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={onClose} />
    </>,
    document.body,
  )
}