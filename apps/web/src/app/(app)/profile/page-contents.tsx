'use client'

import { BookOpen, UserMinus, UserPlus, Users } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'

import MobilePageHeader from '@/components/mobile-page-header'
import PageLoadingIndicator from '@/components/page-loading-indicator'
import { PoemFilterMode } from '@/components/poem-filters'
import { Button } from '@/components/ui/button'
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

type PageTab = 'MY_POEMS' | 'CONNECTIONS'

export type ProfileStat = {
  title: string
  count: number
  onClick: () => void
}

type Props = {
  userId: string | undefined
  isMyPage: boolean
}

/**
 * Profile page contents.
 * @param userId ID of the user's page being viewed.
 * @param isMyPage Whether the user is viewing their own page.
 */
export default function ProfilePageContents({ userId, isMyPage }: Props) {
  const [pageTab, setPageTab] = useState<PageTab>('MY_POEMS')

  const [connectionsFilterMode, setConnectionsFilterMode] =
    useState<ConnectionsFilterMode>('FOLLOWERS')

  const [poemFilterMode, setPoemFilterMode] = useState<PoemFilterMode>('ALL')

  const [userData, setUserData] = useState<UserData>()
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
    getUserData(userId).then(setUserData)
    getUserFollowers(userId).then(setFollowers)
    getUserFollowing(userId).then(setFollowing)
  }, [userId])

  // Refresh the user's data on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    reset()
    refreshData()
  }, [userId, refreshData])

  // Display a loading indicator until the user data has loaded
  if (userData === undefined) return <PageLoadingIndicator />

  /** Sends a follow request for the user connection */
  function sendFollow(userId: string | undefined) {
    if (!userId) return

    // TODO send follow request to the API
    console.log('Follow:', userId)

    refreshData()
  }

  /** Sends an unfollow request for the user connection */
  function sendUnfollow(userId: string | undefined) {
    if (!userId) return

    // TODO send unfollow request to the API
    console.log('Unfollow:', userId)

    refreshData()
  }

  // Get the profile stats to display
  const profileStats: ProfileStat[] = [
    {
      title: 'Poems',
      count: userData._count.authoredPoems,
      onClick: () => setPageTab('MY_POEMS'),
    },
    {
      title: 'Followers',
      count: userData._count.followers,
      onClick: () => {
        setConnectionsFilterMode('FOLLOWERS')
        setPageTab('CONNECTIONS')
      },
    },
    {
      title: 'Following',
      count: userData._count.following,
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
        <MobilePageHeader
          showBackButton={pageTab === 'CONNECTIONS' || !isMyPage}
          onBackButton={() => {
            if (isMyPage || pageTab !== 'MY_POEMS') setPageTab('MY_POEMS')
            else router.push('/profile') // return to my profile page
          }}
          title={`@${userData.username}`}
        >
          {!isMyPage && !isGuest && (
            <Button
              className={cn(
                'w-35 cursor-pointer justify-start',
                userData.isFollowingUser &&
                  'bg-off-white border border-black text-black hover:bg-gray-300'
              )}
              onClick={() =>
                userData.isFollowingUser
                  ? sendUnfollow(userId)
                  : sendFollow(userId)
              }
            >
              {userData.isFollowingUser ? <UserMinus /> : <UserPlus />}
              <span>{userData.isFollowingUser ? 'Unfollow' : 'Follow'}</span>
            </Button>
          )}
        </MobilePageHeader>

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
        {/* Left sidebar */}
        <div className="w-80 overflow-y-auto border-r-2 border-black/30 lg:w-90">
          <div className="flex min-h-full flex-col">
            {/* Profile picture and username */}
            <div className="flex h-18 items-center gap-2 bg-white px-4 text-2xl font-extrabold">
              <div className="relative aspect-square h-11">
                <Image
                  className="rounded-full border-2 border-black object-cover"
                  src={userData.image}
                  loading="eager"
                  alt="Profile picture"
                  sizes="44px"
                  fill
                />
              </div>
              <h1 className="break-all">{`@${userData.username}`}</h1>{' '}
            </div>

            {/* Profile stats */}
            <div className="border-y border-black/30 bg-gray-200/65 py-4">
              <div className="flex items-center divide-x-2 divide-black/30 px-4">
                {profileStats.map((item, i) => (
                  <div
                    key={item.title}
                    className="flex flex-1 flex-col items-center"
                  >
                    <span className="font-bold">{item.count}</span>
                    <span className="font-medium">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Follow/Unfollow button when viewing another user while signed in */}
            {!isMyPage && !isGuest && (
              <>
                <Button
                  className={cn(
                    'mx-4 my-4 cursor-pointer justify-start',
                    userData.isFollowingUser &&
                      'bg-off-white border border-black text-black hover:bg-gray-300'
                  )}
                  onClick={() =>
                    userData.isFollowingUser
                      ? sendUnfollow(userId)
                      : sendFollow(userId)
                  }
                >
                  {userData.isFollowingUser ? <UserMinus /> : <UserPlus />}
                  <span>
                    {userData.isFollowingUser ? 'Unfollow' : 'Follow'}
                  </span>
                </Button>

                {/* Divider line */}
                <div className="mx-4 h-0.5 bg-gray-300" />
              </>
            )}

            {/* Page tab selectors */}
            <nav className="flex flex-col gap-4 px-4 py-4">
              <Button
                className="cursor-pointer justify-start text-lg font-semibold"
                variant={pageTab === 'MY_POEMS' ? 'default' : 'ghost'}
                onClick={() => setPageTab('MY_POEMS')}
              >
                <BookOpen />
                {isMyPage ? 'My Poems' : 'Poems'}
              </Button>
              <Button
                className="cursor-pointer justify-start text-lg font-semibold"
                variant={pageTab === 'CONNECTIONS' ? 'default' : 'ghost'}
                onClick={() => setPageTab('CONNECTIONS')}
              >
                <Users />
                Connections
              </Button>
            </nav>

            {/* Divider line */}
            <div className="mx-4 h-0.5 bg-gray-300" />

            <div className="relative mt-auto h-60 w-full">
              <Image
                className="object-contain"
                src="/poem-writing-hand.svg"
                alt="Hand writing poem"
                loading="eager"
                fill
              />
            </div>
          </div>
        </div>

        {/* Main page contents */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex min-h-full flex-col px-4 py-4 xl:px-10">
            <div className="flex flex-col gap-4 divide-y-2 divide-gray-300">
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
