export function composeEmailHref(to: string, subject?: string, body?: string): string {
  const params = new URLSearchParams()
  if (subject) params.set('subject', subject)
  if (body) params.set('body', body)
  const query = params.toString()
  return `mailto:${encodeURIComponent(to)}${query ? `?${query}` : ''}`
}

export function gmailComposeHref(to: string, subject?: string, body?: string): string {
  const params = new URLSearchParams()
  params.set('view', 'cm')
  params.set('fs', '1')
  if (to) params.set('to', to)
  if (subject) params.set('su', subject)
  if (body) params.set('body', body)
  return `https://mail.google.com/mail/?${params.toString()}`
}

export function openEmailCompose(to: string, subject?: string, body?: string): void {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

  if (isMobile) {
    window.location.href = composeEmailHref(to, subject, body)
    return
  }

  window.open(gmailComposeHref(to, subject, body), '_blank', 'noopener,noreferrer')
}