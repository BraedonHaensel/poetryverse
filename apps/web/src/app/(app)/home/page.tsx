import { getAuthSession } from '@/lib/nextauth'

export default async function Home() {
  const session = await getAuthSession()

  // TODO just for debugging, this can be removed
  const username = session?.user?.username

  return (
    <div>
      Home page <p>You are {username ? username : 'Guest'}</p>
    </div>
  )
}
