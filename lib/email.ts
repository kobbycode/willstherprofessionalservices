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

  let fellBack = false
  const fallback = () => {
    if (fellBack) return
    fellBack = true
    window.location.href = webUrl
  }

  const timer = setTimeout(fallback, 1000)

  const onVisibility = () => {
    const hidden = document.hidden || document.visibilityState === 'hidden'
    if (!hidden) {
      clearTimeout(timer)
    }
  }
  document.addEventListener('visibilitychange', onVisibility)

  try {
    window.location.href = `googlegmail:///co?${params.toString()}`
  } catch {
    clearTimeout(timer)
    document.removeEventListener('visibilitychange', onVisibility)
    fallback()
  }
}