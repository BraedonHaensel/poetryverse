import { redirect } from 'next/navigation'

import { getAuthSession } from '@/lib/nextauth'

export default async function Home() {
  const session = await getAuthSession()

  if (!session?.user) {
    return redirect('/')
  }

  return (
    <div>
      Home page <p>You are {session?.user?.username}</p>
    </div>
  )
}
