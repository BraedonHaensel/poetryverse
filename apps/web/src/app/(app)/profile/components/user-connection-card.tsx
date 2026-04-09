'use client'

import { UserMinus, UserPlus, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import { Button } from '@/components/ui/button'
import { FollowerData, FollowingData } from '@/lib/user-requests'
import { cn } from '@/lib/utils'

import { ConnectionsFilterMode } from './connections-filters'

type Props = {
  className?: string
  isMyPage: boolean
  isGuest: boolean
  userConnectionData: FollowerData | FollowingData
  filterMode: ConnectionsFilterMode
  sendFollow: (userId: string) => void
  sendUnfollow: (userId: string) => void
}

/**
 * Card to display each user connection.
 * @param className Optional additional className values to apply.
 * @param isMyPage Whether the user is viewing their own page.
 * @param isGuest Whether the current user is a guest.
 * @param userConnectionData Data of the user in the connection.
 * @param filterMode Whether a "Followers" or "Following" connections tab is being viewed.
 * @param sendFollow Callback to follow a user.
 * @param sendUnfollow Callback to unfollow a user.
 */
export default function UserConnectionCard({
  className = '',
  isMyPage,
  isGuest,
  userConnectionData,
  filterMode,
  sendFollow,
  sendUnfollow,
}: Props) {
  const session = useSession()
  const myUserId = session.data?.user.id

  const stats = userConnectionData._count

  // Determine the type of button to display
  const buttonData = (() => {
    if (filterMode === 'FOLLOWERS') {
      // On the Followers tab
      return userConnectionData.isFollowingUser
        ? { icon: Users, text: 'Following' }
        : {
            icon: UserPlus,
            text: isMyPage ? 'Follow Back' : 'Follow',
            onClick: sendFollow,
          }
    }

    // On the Following tab
    return userConnectionData.isFollowingUser
      ? isMyPage
        ? { icon: UserMinus, text: 'Unfollow', onClick: sendUnfollow }
        : { icon: Users, text: 'Following' }
      : { icon: UserPlus, text: 'Follow', onClick: sendFollow }
  })()

  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      {/* Left side */}
      <Link
        className="flex flex-1 cursor-pointer items-center gap-4 hover:opacity-70 max-[420px]:gap-2"
        // On click, redirect to the user's profile page
        href={`/profile?userId=${userConnectionData.id}`}
      >
        <div className="relative aspect-square h-12">
          <Image
            className="rounded-full border-2 border-black object-cover"
            src={userConnectionData.image}
            loading="eager"
            alt="Profile picture"
            sizes="48px"
            fill
          />
        </div>

        <div className="flex flex-col">
          <span className="break-all">{`@${userConnectionData.username}`}</span>
          <span className="text-sm wrap-break-word">
            {stats.authoredPoems} Poems · {stats.followers} Followers
          </span>
        </div>
      </Link>

      {/* Right side */}
      {!isGuest && userConnectionData.id !== myUserId && (
        <Button
          className={cn(
            'w-33 justify-start',
            buttonData.onClick === sendFollow
              ? 'cursor-pointer'
              : cn(
                  'bg-off-white hover:bg-off-white border border-black text-black',
                  buttonData.onClick !== undefined &&
                    'cursor-pointer hover:bg-gray-300'
                )
          )}
          onClick={() => buttonData.onClick?.(userConnectionData.id)}
        >
          <buttonData.icon />
          <span>{buttonData.text}</span>
        </Button>
      )}
    </div>
  )
}
