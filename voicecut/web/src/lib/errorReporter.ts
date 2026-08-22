export type ErrorPayload = {
  context: string
  message: string
  timestamp: string
}

type ErrorListener = (payload: ErrorPayload) => void

const listeners = new Set<ErrorListener>()

function toMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string' && error.trim()) return error
  return 'Unknown error'
}

export function subscribeErrors(listener: ErrorListener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function reportError(context: string, error: unknown): ErrorPayload {
  const payload: ErrorPayload = {
    context,
    message: toMessage(error),
    timestamp: new Date().toISOString(),
  }
  // Structured JSON for operators; a tracker can subscribe later.
  console.info(JSON.stringify({ level: 'error', ...payload }))
  listeners.forEach((listener) => listener(payload))
  return payload
}
