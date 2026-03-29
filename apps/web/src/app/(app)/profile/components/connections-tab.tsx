import PageLoadingIndicator from '@/components/page-loading-indicator'
import { ShadowCard } from '@/components/shadow-card'
import { CardContent } from '@/components/ui/card'
import { FollowerData, FollowingData } from '@/lib/user-requests'

import ConnectionsFilters, {
  ConnectionsFilterMode,
} from './connections-filters'
import UserConnectionCard from './user-connection-card'

type Props = {
  followers: FollowerData[] | undefined
  following: FollowingData[] | undefined
  mode: ConnectionsFilterMode
  setMode: (mode: ConnectionsFilterMode) => void
}

/**
 * Followers and following users connection tab contents.
 * @param followers Follower users.
 * @param following Following users.
 * @param mode Whether a "Followers" or "Following" connections tab is being viewed.
 * @param setMode Callback to set the connections tab mode.
 */
export default function ConnectionsTab({
  followers,
  following,
  mode,
  setMode,
}: Props) {
  /** Renders the list of user cards */
  function renderUsersList() {
    return mode === 'FOLLOWERS' ? (
      followers === undefined ? (
        <PageLoadingIndicator className="py-3" />
      ) : followers.length === 0 ? (
        <p className="text-muted-foreground my-3 text-center">
          You don&apos;t have any followers.
        </p>
      ) : (
        followers.map((follower) => (
          <UserConnectionCard
            key={follower.id}
            className="py-3 max-[420px]:gap-2"
            isMyConnectionsPage={true}
            userConnectionData={follower}
            mode={mode}
          />
        ))
      )
    ) : following === undefined ? (
      <PageLoadingIndicator className="py-3" />
    ) : following.length === 0 ? (
      <p className="text-muted-foreground my-3 text-center">
        You don&apos;t have any followers.
      </p>
    ) : (
      following.map((following) => (
        <UserConnectionCard
          key={following.id}
          className="py-3 max-[420px]:gap-2"
          isMyConnectionsPage={true}
          userConnectionData={following}
          mode={mode}
        />
      ))
    )
  }

  return (
    <>
      {/* Followers vs Following filter modes */}
      <ConnectionsFilters
        className="px-2 pb-2 md:px-0 md:pb-px"
        mode={mode}
        setMode={setMode}
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
