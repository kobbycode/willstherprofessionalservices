import { NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    const db = await getAdminDb()
    let snap
    try {
      snap = await db.collection('posts').orderBy('createdAt', 'desc').limit(50).get()
    } catch {
      snap = await db.collection('posts').limit(50).get()
    }
    const posts = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    return NextResponse.json({ posts })
  } catch (e) {
    console.error('Failed to load posts (admin):', e)
    return NextResponse.json({ error: 'Failed to load posts' }, { status: 500 })
  }
}


