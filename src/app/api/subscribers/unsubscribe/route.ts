import { NextResponse } from 'next/server'

import { getPayloadClient } from '@/lib/payload'
import { verifyUnsubscribeToken } from '@/lib/unsubscribe'

export const runtime = 'nodejs'

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(`${SITE_URL}/unsubscribed?status=invalid`)
  }

  const email = verifyUnsubscribeToken(token)
  if (!email) {
    return NextResponse.redirect(`${SITE_URL}/unsubscribed?status=invalid`)
  }

  try {
    const payload = await getPayloadClient()
    const found = await payload.find({
      collection: 'subscribers',
      where: { email: { equals: email } },
      limit: 1,
    })

    if (found.docs.length > 0) {
      await payload.update({
        collection: 'subscribers',
        id: found.docs[0].id,
        data: { active: false },
      })
    }

    return NextResponse.redirect(`${SITE_URL}/unsubscribed?status=ok`)
  } catch (error) {
    console.error('[UNSUBSCRIBE]', error)
    return NextResponse.redirect(`${SITE_URL}/unsubscribed?status=error`)
  }
}
