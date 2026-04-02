'use client'

import { UserMinus, UserPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'

import MobilePageHeader from '@/components/mobile-page-header'
import PageLoadingIndicator from '@/components/page-loading-indicator'
import { PoemFilterMode } from '@/components/poem-filters'
import { Button } from '@/components/ui/button'
import { api, displayApiError } from '@/lib/api'
import {
  FollowerData,
  FollowingData,
  getUserData,
  getUserFollowers,
  getUserFollowing,
  UserData,
} from '@/lib/user-requests'
import { cn } from '@/lib/utils'

import { ConnectionsFilterMode } from './components/connections-filters'
import ConnectionsTab from './components/connections-tab'
import PoemsTab from './components/poems-tab'
import { ProfileSidebarDesktop } from './components/profile-sidebar-desktop'

export type ProfilePageTab = 'MY_POEMS' | 'CONNECTIONS'

export type ProfileStat = {
  title: string
  count: number
  onClick: () => void
}

type Props = {
  viewingUserId: string | undefined
  isMyPage: boolean
}

/**
 * Profile page contents.
 * @param viewingUserId ID of the user's page being viewed.
 * @param isMyPage Whether the user is viewing their own page.
 */
export default function ProfilePageContents({
  viewingUserId: viewingUserId,
  isMyPage,
}: Props) {
  const [pageTab, setPageTab] = useState<ProfilePageTab>('MY_POEMS')

  const [connectionsFilterMode, setConnectionsFilterMode] =
    useState<ConnectionsFilterMode>('FOLLOWERS')

  const [poemFilterMode, setPoemFilterMode] = useState<PoemFilterMode>('ALL')

  const [viewingUserData, setViewingUserData] = useState<UserData>()
  const [followers, setFollowers] = useState<FollowerData[]>()
  const [following, setFollowing] = useState<FollowingData[]>()

  const session = useSession()
  const isGuest = session.status === 'unauthenticated'

  const router = useRouter()

  /** Resets the page state. Used when switching between different users' profile pages. */
  function reset() {
    setPageTab('MY_POEMS')
    setConnectionsFilterMode('FOLLOWERS')
    setPoemFilterMode('ALL')
  }

  /** Refreshes the user's data. */
  const refreshData = useCallback(() => {
    getUserData(viewingUserId).then(setViewingUserData)
    getUserFollowers(viewingUserId).then(setFollowers)
    getUserFollowing(viewingUserId).then(setFollowing)
  }, [viewingUserId])

  // Refresh the user's data on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    reset()
    refreshData()
  }, [viewingUserId, refreshData])

  // Display a loading indicator until the user data has loaded
  if (viewingUserData === undefined) return <PageLoadingIndicator />

  /** Sends a follow request for the user connection */
  function sendFollow(userId: string | undefined) {
    if (!userId) return

    setFollowers(undefined)
    setFollowing(undefined)
    api
      .put(`/api/users/me/following/${userId}`)
      .then(() => {
        console.log('Successfully followed', userId)
      })
      .catch((error) => {
        displayApiError(error, 'Failed to follow user')
      })
      .finally(() => {
        // Refresh the list of followers/following users
        getUserFollowers(viewingUserId).then(setFollowers)
        getUserFollowing(viewingUserId).then(setFollowing)
      })
  }

  /** Sends an unfollow request for the user connection */
  function sendUnfollow(userId: string | undefined) {
    if (!userId) return

    setFollowers(undefined)
    setFollowing(undefined)
    api
      .delete(`/api/users/me/following/${userId}`)
      .then(() => {
        console.log('Successfully unfollowed', userId)
      })
      .catch((error) => {
        displayApiError(error, 'Failed to unfollow user')
      })
      .finally(() => {
        // Refresh the list of followers/following users
        getUserFollowers(viewingUserId).then(setFollowers)
        getUserFollowing(viewingUserId).then(setFollowing)
      })
  }

  // Get the profile stats to display
  const profileStats: ProfileStat[] = [
    {
      title: 'Poems',
      count: viewingUserData._count.authoredPoems,
      onClick: () => setPageTab('MY_POEMS'),
    },
    {
      title: 'Followers',
      count: viewingUserData._count.followers,
      onClick: () => {
        setConnectionsFilterMode('FOLLOWERS')
        setPageTab('CONNECTIONS')
      },
    },
    {
      title: 'Following',
      count: viewingUserData._count.following,
      onClick: () => {
        setConnectionsFilterMode('FOLLOWING')
        setPageTab('CONNECTIONS')
      },
    },
  ]

  return (
    <>
      {/* Mobile layout */}
      <div className="flex flex-1 flex-col gap-2 divide-y-2 divide-gray-300 md:hidden">
        {/* Header */}
        <MobilePageHeader
          showBackButton={pageTab === 'CONNECTIONS' || !isMyPage}
          onBackButton={() => {
            if (isMyPage || pageTab !== 'MY_POEMS') setPageTab('MY_POEMS')
            else router.push('/profile') // return to my profile page
          }}
          title={`@${viewingUserData.username}`}
        >
          {!isMyPage && !isGuest && (
            <Button
              className={cn(
                'w-35 cursor-pointer justify-start',
                viewingUserData.isFollowingUser &&
                  'bg-off-white border border-black text-black hover:bg-gray-300'
              )}
              onClick={() =>
                viewingUserData.isFollowingUser
                  ? sendUnfollow(viewingUserId)
                  : sendFollow(viewingUserId)
              }
            >
              {viewingUserData.isFollowingUser ? <UserMinus /> : <UserPlus />}
              <span>
                {viewingUserData.isFollowingUser ? 'Unfollow' : 'Follow'}
              </span>
            </Button>
          )}
        </MobilePageHeader>

        {/* Main contents */}
        {pageTab === 'MY_POEMS' ? (
          <PoemsTab
            isMyPage={isMyPage}
            profileStats={profileStats}
            filterMode={poemFilterMode}
            setFilterMode={setPoemFilterMode}
          />
        ) : (
          <ConnectionsTab
            isMyPage={isMyPage}
            followers={followers}
            following={following}
            filterMode={connectionsFilterMode}
            setFilterMode={setConnectionsFilterMode}
            sendFollow={sendFollow}
            sendUnfollow={sendUnfollow}
          />
        )}
      </div>

      {/* Desktop layout */}
      <div className="hidden min-h-0 w-full flex-1 md:flex">
        {/* Sidebar */}
        <ProfileSidebarDesktop
          viewingUserId={viewingUserId}
          viewingUserData={viewingUserData}
          profileStats={profileStats}
          isMyPage={isMyPage}
          isGuest={isGuest}
          sendFollow={sendFollow}
          sendUnfollow={sendUnfollow}
          pageTab={pageTab}
          setPageTab={setPageTab}
        />

        {/* Main contents */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex min-h-full flex-col px-4 py-4 xl:px-10">
            <div className="flex flex-1 flex-col gap-4 divide-y-2 divide-gray-300">
              {pageTab === 'MY_POEMS' ? (
                <PoemsTab
                  isMyPage={isMyPage}
                  profileStats={profileStats}
                  filterMode={poemFilterMode}
                  setFilterMode={setPoemFilterMode}
                />
              ) : (
                <ConnectionsTab
                  isMyPage={isMyPage}
                  followers={followers}
                  following={following}
                  filterMode={connectionsFilterMode}
                  setFilterMode={setConnectionsFilterMode}
                  sendFollow={sendFollow}
                  sendUnfollow={sendUnfollow}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
