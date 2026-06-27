import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { error: 'Invalid configuration data' },
        { status: 400 }
      )
    }

    const db = await getAdminDb()

    const savePath = db.collection('config').doc('site')

    const { _merge, ...configData } = data

    if (_merge) {
      await savePath.set(
        { ...configData, updatedAt: new Date().toISOString() },
        { merge: true }
      )
    } else {
      await savePath.set({
        ...configData,
        updatedAt: new Date().toISOString()
      })
    }

    return NextResponse.json({ success: true, savedAt: new Date().toISOString(), data: configData })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save configuration' },
      { status: 500 }
    )
  }
}


