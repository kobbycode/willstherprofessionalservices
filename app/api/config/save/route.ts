import { NextRequest, NextResponse } from 'next/server'
import { cookies, headers } from 'next/headers'
import { getAdminDb, verifyIdToken } from '@/lib/firebase-admin'

export async function POST(req: NextRequest) {
  try {
    const authHeader = headers().get('authorization') || ''
    const cookieStore = cookies()
    const sessionToken = cookieStore.get('session')?.value

    const idToken = authHeader.startsWith('Bearer ')
      ? authHeader.substring('Bearer '.length)
      : sessionToken || ''

    if (!idToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await verifyIdToken(idToken)

    const body = await req.json()
    const heroSlides = Array.isArray(body?.heroSlides) ? body.heroSlides : []

    const db = getAdminDb()
    await db.doc('config/site').set({ heroSlides }, { merge: true })

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('Save config API error:', error)
    return NextResponse.json({ error: error?.message || 'Internal error' }, { status: 500 })
  }
}


