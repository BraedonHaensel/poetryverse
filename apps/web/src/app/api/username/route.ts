//Backend adds a Username to the User table and checks if a username aready exists

import { prisma } from '@/lib/db'
import { getAuthSession } from '@/lib/nextauth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const session = await getAuthSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { username } = await req.json()

  const exists = await prisma.user.findUnique({
    where: { username },
  })

  if (exists) {
    return NextResponse.json(
      { error: 'Username already taken' },
      { status: 400 }
    )
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { username },
  })

  return NextResponse.json({ success: true })
}
