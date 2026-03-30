import { getAuthSession } from '@/lib/nextauth'

import ProfilePageContents from './page-contents'

type Props = {
  searchParams: Promise<{
    userId?: string
  }>
}

/**
 * Profile page.
 */
export default async function Profile({ searchParams }: Props) {
  // Optional user ID to view a specific user's profile page
  const { userId } = await searchParams

  // Check the user ID being used by the auth session.
  const session = await getAuthSession()
  const sessionUserId = session?.user.id

  return (
    <ProfilePageContents
      userId={userId ?? sessionUserId}
      isMe={!userId || userId === sessionUserId}
    />
  )
}
