export type BackendHealth = 'live' | 'degraded' | 'offline'

export function formatBackendHealth(health: BackendHealth): string {
  return `Backend status: ${health}`
}
