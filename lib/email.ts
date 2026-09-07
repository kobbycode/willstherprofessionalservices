export function composeEmailHref(to: string, subject?: string, body?: string): string {
  const params = new URLSearchParams()
  if (subject) params.set('subject', subject)
  if (body) params.set('body', body)
  const query = params.toString()
  return `mailto:${encodeURIComponent(to)}${query ? `?${query}` : ''}`
}