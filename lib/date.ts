export function formatDateISO(dateInput: string | number | Date): string {
  const d = new Date(dateInput)
  return d.toISOString().slice(0, 10)
}

export function formatDateHuman(dateInput: string | number | Date, locale: 'en-GB' | 'en-US' = 'en-GB'): string {
  // Use fixed locale to avoid hydration mismatch. Default to en-GB => DD/MM/YYYY
  const d = new Date(dateInput)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return locale === 'en-US' ? `${mm}/${dd}/${yyyy}` : `${dd}/${mm}/${yyyy}`
}


