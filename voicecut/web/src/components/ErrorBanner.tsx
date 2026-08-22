import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { subscribeErrors } from '../lib/errorReporter'

export function ErrorBanner() {
  const [text, setText] = useState<string | null>(null)

  useEffect(() => {
    return subscribeErrors((payload) => {
      setText(`${payload.context}: ${payload.message}`)
    })
  }, [])

  if (!text) return null

  return (
    <div
      role="alert"
      className="shrink-0 flex items-center justify-between gap-3 px-4 py-2 bg-red-950/80 border-b border-red-900 text-red-200 text-sm"
    >
      <span>{text}</span>
      <button
        type="button"
        aria-label="Dismiss error"
        onClick={() => setText(null)}
        className="p-1 rounded hover:bg-red-900/60"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
