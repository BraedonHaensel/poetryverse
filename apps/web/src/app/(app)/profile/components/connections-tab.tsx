import PageLoadingIndicator from '@/components/page-loading-indicator'
import { ShadowCard } from '@/components/shadow-card'
import { CardContent } from '@/components/ui/card'
import { FollowerData, FollowingData } from '@/lib/user-requests'

import ConnectionsFilters, {
  ConnectionsFilterMode,
} from './connections-filters'
import UserConnectionCard from './user-connection-card'

type Props = {
  isMyPage: boolean
  followers: FollowerData[] | undefined
  following: FollowingData[] | undefined
  filterMode: ConnectionsFilterMode
  setFilterMode: (mode: ConnectionsFilterMode) => void
  sendFollow: (userId: string) => void
  sendUnfollow: (userId: string) => void
}

/**
 * Followers and following users connection tab contents.
 * @param isMyPage Whether the user is viewing their own page.
 * @param followers Follower users.
 * @param following Following users.
 * @param filterMode Whether a "Followers" or "Following" connections tab is being viewed.
 * @param setFilterMode Callback to set the connections tab mode.
 * @param sendFollow Callback to follow a user.
 * @param sendUnfollow Callback to unfollow a user.
 */
export default function ConnectionsTab({
  isMyPage,
  followers,
  following,
  filterMode,
  setFilterMode,
  sendFollow,
  sendUnfollow,
}: Props) {
  /** Renders the list of user cards */
  function renderUsersList() {
    return filterMode === 'FOLLOWERS' ? (
      followers === undefined ? (
        <PageLoadingIndicator />
      ) : followers.length === 0 ? (
        <p className="text-muted-foreground my-3 text-center">
          {isMyPage ? 'You have no followers.' : 'This user has no followers.'}
        </p>
      ) : (
        followers.map((follower) => (
          <UserConnectionCard
            key={follower.id}
            className="py-3 max-[420px]:gap-2"
            isMyPage={true}
            userConnectionData={follower}
            filterMode={filterMode}
            sendFollow={sendFollow}
            sendUnfollow={sendUnfollow}
          />
        ))
      )
    ) : following === undefined ? (
      <PageLoadingIndicator />
    ) : following.length === 0 ? (
      <p className="text-muted-foreground my-3 text-center">
        {isMyPage
          ? 'You are not following anyone.'
          : 'This user is not following anyone.'}
      </p>
    ) : (
      following.map((following) => (
        <UserConnectionCard
          key={following.id}
          className="py-3 max-[420px]:gap-2"
          isMyPage={isMyPage}
          userConnectionData={following}
          filterMode={filterMode}
          sendFollow={sendFollow}
          sendUnfollow={sendUnfollow}
        />
      ))
    )
  }

  return (
    <>
      {/* Followers vs Following filter modes */}
      <ConnectionsFilters
        className="px-2 pb-2 md:px-0 md:pb-px"
        mode={filterMode}
        setMode={setFilterMode}
      />

      {/* Mobile follower/following users list */}
      <div className="-mt-2 flex flex-col divide-y-2 divide-gray-300 bg-white px-2 min-[420px]:px-4 md:hidden">
        {renderUsersList()}
      </div>

      {/* Desktop follower/following users list */}
      <ShadowCard className="hidden px-4 py-0 md:block">
        <CardContent className="flex flex-col divide-y-2 divide-gray-300 p-0">
          {renderUsersList()}
        </CardContent>
      </ShadowCard>
    </>
  )
}
