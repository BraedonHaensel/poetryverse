'use client'

import { UserMinus, UserPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import MobilePageHeader from '@/components/mobile-page-header'
import PageLoadingIndicator from '@/components/page-loading-indicator'
import { PoemFilterMode } from '@/components/poem-filters'
import SignInRequiredDialog from '@/components/sign-in-required-dialog'
import { Button } from '@/components/ui/button'
import { api, displayApiError } from '@/lib/api'
import {
  filterPoems,
  getPoemById,
  getUserPoems,
  isPendingApproval,
  likePoem,
  PoemData,
  unlikePoem,
} from '@/lib/poem-requests'
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
  viewingUserId: string
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

  const [poems, setPoems] = useState<PoemData[]>()
  const [filteredPoems, setFilteredPoems] = useState<PoemData[]>([])
  const [poemFilterMode, setPoemFilterMode] = useState<PoemFilterMode>('ALL')

  const [viewingUserData, setViewingUserData] = useState<UserData>()
  const [followers, setFollowers] = useState<FollowerData[]>()
  const [following, setFollowing] = useState<FollowingData[]>()

  const pendingPoemIdsRef = useRef<string[]>([])
  const [pendingPoemIds, setPendingPoemIds] = useState<string[]>([])
  
  const [showSignInDialog, setShowSignInDialog] = useState(false)

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
  const refreshUserData = useCallback(() => {
    getUserData(viewingUserId).then(setViewingUserData)
    getUserFollowers(viewingUserId).then(setFollowers)
    getUserFollowing(viewingUserId).then(setFollowing)
  }, [viewingUserId])

  // Fetch all data on mount and on viewing user ID changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setViewingUserData(undefined)
    reset()
    refreshUserData()
    getUserPoems(viewingUserId).then((poems) => {
      setPoems(poems)
      setPendingPoemIds(
        poems
          .filter((poem) => isPendingApproval(poem.approvalStatus))
          .map((poem) => poem.id)
      )
    })
  }, [viewingUserId, refreshUserData])

  useEffect(() => {
    pendingPoemIdsRef.current = pendingPoemIds
  }, [pendingPoemIds])

  /** Periodically check the status of poems pending approval. */
  useEffect(() => {
    if (pendingPoemIds.length === 0) return

    // Check the status of each pending poem
    const checkPendingPoems = () => {
      pendingPoemIdsRef.current.forEach((poemId) => {
        getPoemById(poemId).then((poem) => {
          if (poem === undefined) return
          if (!isPendingApproval(poem.approvalStatus)) {
            // Poem is no longer pending approval
            setPendingPoemIds((prev) => prev.filter((id) => id !== poem.id))
            setPoems((prev) => {
              if (prev === undefined) return undefined
              return prev.map((prevPoem) =>
                prevPoem.id === poemId ? poem : prevPoem
              )
            })
            if (poem.approvalStatus === 'APPROVED') {
              console.log(`Poem '${poem.title}' approved`)
              toast.success(`Poem '${poem.title}' approved`)
            }
          }
        })
      })
    }

    // Start the periodic check interval
    const refreshPoemsInterval = setInterval(checkPendingPoems, 3000)
    return () => clearInterval(refreshPoemsInterval)
  }, [pendingPoemIds])

  // Update the filtered poems to display
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilteredPoems(
      poems === undefined ? [] : filterPoems(poems, poemFilterMode)
    )
  }, [poems, poemFilterMode])

  // Display a loading indicator until the user data and poems have been loaded
  if (viewingUserData === undefined || poems === undefined)
    return <PageLoadingIndicator />

  /** Sets the visibility of a poem to public. */
  function setPublic(poemId: string) {
    api
      .patch(`/api/poems/${poemId}`, { isPublic: true })
      .then((res) => {
        const poem: PoemData = res.data
        setPoems((prev) => {
          if (prev === undefined) return undefined
          return prev.map((prevPoem) =>
            prevPoem.id === poemId ? poem : prevPoem
          )
        })

        // Check if the poem is pending approval
        if (isPendingApproval(poem.approvalStatus)) {
          setPendingPoemIds((prev) =>
            // Add pending check for the poem, if not already included
            prev.includes(poem.id) ? prev : [...prev, poem.id]
          )
        }

        console.log('Poem visibility updated to public:', poemId)
        toast.success('Poem visibility updated')
      })
      .catch((error) => {
        displayApiError(error, 'Failed to update visibility')
      })
  }

  /** Sets the visibility of a poem to private. */
  function setPrivate(poemId: string) {
    api
      .patch(`/api/poems/${poemId}`, { isPublic: false })
      .then((res) => {
        const poem: PoemData = res.data
        setPoems((prev) => {
          if (prev === undefined) return undefined
          return prev.map((prevPoem) =>
            prevPoem.id === poemId ? poem : prevPoem
          )
        })

        // Remove any pending approval checks for the poem
        setPendingPoemIds((prev) => prev.filter((id) => id !== poem.id))

        console.log('Poem visibility updated to private:', poemId)
        toast.success('Poem visibility updated')
      })
      .catch((error) => {
        displayApiError(error, 'Failed to update visibility')
      })
  }

  /** Deletes a user's poem */
  function deletePoem(poemId: string) {
    api
      .delete(`/api/poems/${poemId}`)
      .then(() => {
        setPendingPoemIds((prev) => prev.filter((id) => id !== poemId))
        setPoems((prev) => {
          if (prev === undefined) return undefined
          return prev.filter((poem) => poem.id !== poemId)
        })
        console.log('Poem deleted:', poemId)
        toast.success('Poem deleted')
      })
      .catch((error) => {
        displayApiError(error, 'Failed to delete poem')
      })
  }

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
        // Refresh the user's data
        refreshUserData()
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
        // Refresh the user's data
        refreshUserData()
      })
  }

  /** Handles liking or removing a like from a poem. */
  function handleToggleLike(poemId: string, isLike: boolean) {
    if (isGuest) {
      setShowSignInDialog(true)
      return
    }

    // Send the like or unlike request to the API
    if (isLike) {
      likePoem(poemId)
    } else {
      unlikePoem(poemId)
    }

    // Update the poem data for the like or unlike
    setPoems((prev) => {
      if (prev === undefined) return undefined
      return prev.map((poem) =>
        poem.id === poemId
          ? {
              ...poem,
              isLikedByCurrentUser: isLike,
              _count: {
                likes: isLike ? poem._count.likes + 1 : poem._count.likes - 1,
              },
            }
          : poem
      )
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
      <SignInRequiredDialog
        isOpen={showSignInDialog}
        onClose={() => setShowSignInDialog(false)}
      />

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
                'w-fit cursor-pointer justify-start min-[420px]:w-35',
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
              <span className="hidden min-[360px]:block">
                {viewingUserData.isFollowingUser ? 'Unfollow' : 'Follow'}
              </span>
            </Button>
          )}
        </MobilePageHeader>

        {/* Main contents */}
        {pageTab === 'MY_POEMS' ? (
          <PoemsTab
            isMyPage={isMyPage}
            isGuest={isGuest}
            profileStats={profileStats}
            filterMode={poemFilterMode}
            setFilterMode={setPoemFilterMode}
            filteredPoems={filteredPoems}
            onSetPublic={setPublic}
            onSetPrivate={setPrivate}
            onDeletePoem={deletePoem}
            onToggleLike={handleToggleLike}
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
                  isGuest={isGuest}
                  profileStats={profileStats}
                  filterMode={poemFilterMode}
                  setFilterMode={setPoemFilterMode}
                  filteredPoems={filteredPoems}
                  onSetPublic={setPublic}
                  onSetPrivate={setPrivate}
                  onDeletePoem={deletePoem}
                  onToggleLike={handleToggleLike}
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
