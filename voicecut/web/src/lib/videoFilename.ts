export function extractVideoFilename(path: string | null | undefined): string | null {
  if (!path) {
    return null;
  }
  const base = path.split(/[\\/]/).pop();
  return base && base.length > 0 ? base : null;
}

export function formatVideoFilename(path: string | null | undefined): string {
  const name = extractVideoFilename(path);
  return name ? `Filename: ${name}` : 'Filename: unknown';
}
