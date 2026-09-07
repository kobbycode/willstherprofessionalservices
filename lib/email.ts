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
  const webUrl = gmailComposeHref(to, subject, body)
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

  if (!isMobile) {
    window.open(webUrl, '_blank', 'noopener,noreferrer')
    return
  }

  const params = new URLSearchParams()
  if (to) params.set('to', to)
  if (subject) params.set('subject', subject)
  if (body) params.set('body', body)
  const appUrl = `googlegmail://co?${params.toString()}`

  let settled = false
  let fallbackTimer: number | null = null
  const cleanup = () => {
    if (settled) return
    settled = true
    window.removeEventListener('pagehide', onPageHide)
    document.removeEventListener('visibilitychange', onVisibility)
    if (fallbackTimer !== null) {
      window.clearTimeout(fallbackTimer)
      fallbackTimer = null
    }
  }
  const fallback = () => {
    if (settled) return
    window.location.href = webUrl
  }
  const onVisibility = () => {
    if (document.hidden || document.visibilityState === 'hidden') {
      cleanup()
    }
  }
  const onPageHide = () => cleanup()

  document.addEventListener('visibilitychange', onVisibility)
  window.addEventListener('pagehide', onPageHide)

  try {
    window.location.href = appUrl
  } catch {
    fallback()
  }

  fallbackTimer = window.setTimeout(fallback, 2500)
}