import Link from 'next/link'
import { getAuthSession } from '@/lib/nextauth'
import SignOutButton from '@/components/AuthButtons/SignOutButton'

export default async function Home() {
  const session = await getAuthSession()

  if (!session?.user) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Not signed in</h1>
        <Link className="text-blue-600 underline" href="/signIn">
          Sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between p-6">
      <div>
        <div className="font-semibold">{session.user.username}</div>
        <div className="text-sm text-black/70">{session.user.name}</div>
      </div>
      <SignOutButton text="Sign Out" />
    </div>
  )
}
