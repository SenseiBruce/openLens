export function formatInitialPrompt(prompt: string | null | undefined): string {
  const trimmed = (prompt || '').trim();
  if (!trimmed) {
    return 'Custom prompt: none';
  }
  return `Custom prompt: ${trimmed}`;
}
