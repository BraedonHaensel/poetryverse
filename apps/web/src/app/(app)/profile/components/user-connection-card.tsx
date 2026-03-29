import { UserMinus, UserPlus, Users } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { FollowerData, FollowingData } from '@/lib/user-requests'
import { cn } from '@/lib/utils'

import { ConnectionsFilterMode } from './connections-filters'

type Props = {
  className?: string
  isMyConnectionsPage: boolean
  userConnectionData: FollowerData | FollowingData
  mode: ConnectionsFilterMode
}

/**
 * Card to display each user connection.
 * @param className Optional additional className values to apply.
 * @param isMyConnectionPage Whether the currently signed in user's page is being viewed.
 * @param userConnectionData Data of the user in the connection
 * @param mode Whether a "Followers" or "Following" tab is being viewed
 */
export default function UserConnectionCard({
  className = '',
  isMyConnectionsPage,
  userConnectionData,
  mode,
}: Props) {
  const stats = userConnectionData._count

  /** Sends a follow request for the user connection */
  function sendFollow() {
    // TODO send follow request to the API
    console.log('Follow:', userConnectionData.id)
  }

  /** Sends an unfollow request for the user connection */
  function sendUnfollow() {
    // TODO send unfollow request to the API
    console.log('Unfollow:', userConnectionData.id)
  }

  // Determine the type of button to display
  const buttonData = (() => {
    if (mode === 'FOLLOWERS') {
      // On the Followers tab
      return userConnectionData.isFollowingUser
        ? { icon: Users, text: 'Following' }
        : {
            icon: UserPlus,
            text: isMyConnectionsPage ? 'Follow Back' : 'Follow',
            onClick: sendFollow,
          }
    }

    // On the Following tab
    return userConnectionData.isFollowingUser
      ? { icon: UserMinus, text: 'Unfollow', onClick: sendUnfollow }
      : { icon: UserPlus, text: 'Follow', onClick: sendFollow }
  })()

  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      {/* Left side */}
      <div
        className="flex flex-1 cursor-pointer items-center gap-4 hover:opacity-70 max-[420px]:gap-2"
        onClick={() => console.log('Redirect to user page')}
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
      </div>

      {/* Right side */}
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
        onClick={buttonData.onClick}
      >
        <buttonData.icon />
        <span>{buttonData.text}</span>
      </Button>
    </div>
  )
}
