export function formatProjectDate(createdAt: string | null | undefined): string {
  if (!createdAt) {
    return 'Created: unknown';
  }
  const stamp = new Date(createdAt);
  if (Number.isNaN(stamp.getTime())) {
    return 'Created: unknown';
  }
  return `Created: ${stamp.toISOString().slice(0, 10)}`;
}
