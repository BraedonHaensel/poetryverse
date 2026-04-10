'use client'

import axios from 'axios'
import { Star } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'

import { FullPoemDialog } from '@/components/full-poem-dialog'
import MobilePageHeader from '@/components/mobile-page-header'
import OtherUserPoemMenu from '@/components/other-user-poem-menu'
import PageLoadingIndicator from '@/components/page-loading-indicator'
import { ShadowCard } from '@/components/shadow-card'
import SignInRequiredDialog from '@/components/sign-in-required-dialog'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api, displayApiError } from '@/lib/api'
import { likePoem, type PoemData, unlikePoem } from '@/lib/poem-requests'

// Dummy poem data for development/preview
const DUMMY_POEM: PoemData = {
  id: 'poem1',
  title: 'Sonnet 1',
  authorId: 'cmn5hpdln000104kzfbg941tb',
  author: {
    username: 'User 2',
  },
  type: {
    id: 'type-sonnet',
    name: 'Sonnet',
  },
  body: "Beneath the velvet cloak of silver night,\nI find my world reflected in your eyes,\nA soft and steady, soul-consuming light,\nThat steals the breath of all my weary sighs,\nThe winter frost may chill the hollow air,\nAnd summer blooms may wither in the sun,\nBut nothing dims the grace of what we share,\nTwo separate paths that are joined and beat as one\nNo gilded crown could ever hold the worth,\nOf quiet moments whispered in the dark,\nFor you have been my anchor to the Earth,\nAnd to my soul, you are the living spark,\nThough time may drift as tide pulls us from the shore,\nI'll love you now, and then forevermore.",
  _count: {
    likes: 2,
  },
  isPublic: true,
  isAIAssisted: false,
  aiLikelihoonScore: 0.26,
  poemTags: [],
  createdAt: new Date('2026-03-15T03:09:16.151Z'),
  updatedAt: new Date('2026-03-15T03:09:16.151Z'),
  approvalStatus: 'APPROVED',
  isLikedByCurrentUser: true,
}

const USE_DUMMY_DATA = false

export default function PoemOfTheDay() {
  const [poem, setPoemData] = useState<PoemData>()
  const [isLoading, setIsLoading] = useState(true)

  const [showSignInDialog, setShowSignInDialog] = useState(false)

  const session = useSession()
  const isGuest = session.status === 'unauthenticated'

  const mobileTextClampRef = useRef<HTMLParagraphElement>(null)
  const [mobileHasReadMore, setMobileHasReadMore] = useState(false)
  const desktopTextClampRef = useRef<HTMLParagraphElement>(null)
  const [desktopHasReadMore, setDesktopHasReadMore] = useState(false)
  const [isReadMoreOpen, setIsReadMoreOpen] = useState(false)

  const router = useRouter()

  // Fetch poem data on component mount
  useEffect(() => {
    const fetchPoem = async () => {
      try {
        setIsLoading(true)
        if (USE_DUMMY_DATA) {
          await new Promise((resolve) => setTimeout(resolve, 500))
          setPoemData(DUMMY_POEM)
        } else {
          const response = await api.get('/api/poems/daily-poem')
          console.log('Daily poem:', response.data.data)
          setPoemData(response.data.data)
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          displayApiError(error, 'Failed to load Poem of the Day')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchPoem()
  }, [])

  // Check if the "Read more" button needs to be displayed on mobile
  useEffect(() => {
    const el = mobileTextClampRef.current
    if (!el) return

    // Check if the poem line height exceeds the permitted space
    const checkClamp = () => {
      setMobileHasReadMore(el.scrollHeight > el.clientHeight)
    }
    checkClamp()

    // Set an observer to react to size changes
    const observer = new ResizeObserver(checkClamp)
    observer.observe(el)

    return () => observer.disconnect()
  }, [poem])

  // Check if the "Read more" button needs to be displayed on desktop
  useEffect(() => {
    const el = desktopTextClampRef.current
    if (!el) return

    // Check if the poem line height exceeds the permitted space
    const checkClamp = () => {
      setDesktopHasReadMore(el.scrollHeight > el.clientHeight)
    }
    checkClamp()

    // Set an observer to react to size changes
    const observer = new ResizeObserver(checkClamp)
    observer.observe(el)

    return () => observer.disconnect()
  }, [poem])

  /** Handles liking or removing a like from a poem. */
  const handleToggleLike = (poemId: string, isLike: boolean) => {
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
    setPoemData((prev) => {
      if (prev === undefined) return undefined
      return {
        ...prev,
        isLikedByCurrentUser: isLike,
        _count: {
          likes: isLike ? prev._count.likes + 1 : prev._count.likes - 1,
        },
      }
    })
  }

  if (isLoading || !poem) {
    return (
      <>
        <div className="flex flex-1 flex-col gap-4 md:hidden">
          <MobilePageHeader title="Poem of the Day" showGuestSignIn={isGuest} />
          <PageLoadingIndicator />
        </div>

        <div className="hidden md:flex">
          <PageLoadingIndicator />
        </div>
      </>
    )
  }

  return (
    <>
      <SignInRequiredDialog
        isOpen={showSignInDialog}
        onClose={() => setShowSignInDialog(false)}
      />

      {/* Dialog after clicking "Read more" */}
      {(mobileHasReadMore || desktopHasReadMore) && (
        <FullPoemDialog
          isOpen={isReadMoreOpen}
          onOpenChange={setIsReadMoreOpen}
          poem={poem}
          onToggleLike={handleToggleLike}
        />
      )}

      {/* Mobile layout */}
      <div className="relative flex flex-1 flex-col gap-4 md:hidden">
        <MobilePageHeader
          title="Poem of the Day"
          showGuestSignIn={isGuest}
          className="text-xl min-[350px]:text-2xl"
        />

        <div className="z-1 flex flex-col gap-2 px-2 pb-2">
          <ShadowCard>
            <CardHeader className="text-center break-normal wrap-anywhere">
              <div className="mb-1 block w-full rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-black">
                ✨ TODAY&#39;S FEATURED POEM ✨
              </div>

              {/* Poem title */}
              <CardTitle className="text-2xl font-bold">{poem.title}</CardTitle>

              {/* Poem details */}
              <p className="text-sm text-gray-600">
                {/* Author's username */}
                <span
                  className="cursor-pointer hover:opacity-70"
                  onClick={() =>
                    router.push(`/profile?userId=${poem.authorId}`)
                  }
                >
                  {`${poem.author.username} · `}
                </span>
                {`${poem.type?.name} · ${poem.poemTags.map((tag) => tag.tag.name).join(', ')}`}
              </p>
            </CardHeader>

            <CardContent className="flex flex-col gap-2">
              {/* Poem contents */}
              <div className="bg-off-white rounded-lg p-3">
                <p
                  ref={mobileTextClampRef}
                  className="line-clamp-10 break-normal wrap-anywhere whitespace-pre-wrap"
                >
                  {poem.body}
                </p>

                {/* Read more button */}
                {mobileHasReadMore && (
                  <button
                    onClick={() => setIsReadMoreOpen(true)}
                    className="w-fit cursor-pointer text-gray-400 transition-colors hover:text-gray-500"
                  >
                    Read more
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between border-t pt-2">
                <button
                  onClick={() =>
                    handleToggleLike(poem.id, !poem.isLikedByCurrentUser)
                  }
                  className="flex min-w-13 cursor-pointer items-center gap-2 border border-black p-1 pr-2 transition-opacity hover:opacity-80"
                >
                  <Star
                    size={20}
                    fill={poem.isLikedByCurrentUser ? '#fbbf24' : 'none'}
                  />
                  <span className="text-sm font-semibold">
                    {poem._count?.likes}
                  </span>
                </button>
                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground text-sm">
                    {poem.body.split('\n').length} lines
                  </p>
                  {/* Dropdown menu for signed-in users */}
                  {!isGuest && <OtherUserPoemMenu poem={poem} />}
                </div>
              </div>
            </CardContent>
          </ShadowCard>
        </div>

        {/* Poem writing hand image */}
        <div className="pointer-events-none absolute bottom-0 left-1/2 aspect-square max-h-70 w-full -translate-x-1/2 overflow-hidden">
          <Image
            className="translate-y-4 object-contain object-bottom"
            src="/poem-writing-hand.svg"
            alt="Hand writing poem"
            priority
            fill
          />
        </div>
      </div>

      {/* Desktop layout */}
      <div className="relative hidden flex-1 items-center md:flex">
        <ShadowCard className="z-1 mx-auto w-full max-w-2xl">
          <CardHeader className="border-b text-center break-normal wrap-anywhere">
            <div>
              <div className="mb-3 block w-full rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-black">
                ✨ TODAY&#39;S FEATURED POEM ✨
              </div>

              {/* Poem title */}
              <CardTitle className="text-3xl font-bold">{poem.title}</CardTitle>
            </div>

            {/* Poem details */}
            <p className="text-base text-gray-600">
              {/* Author's username */}
              <span
                className="cursor-pointer hover:opacity-70"
                onClick={() => router.push(`/profile?userId=${poem.authorId}`)}
              >
                {`${poem.author.username} · `}
              </span>
              {`${poem.type?.name} · ${poem.poemTags.map((tag) => tag.tag.name).join(', ')}`}
            </p>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col gap-2">
            {/* Poem contents */}
            <div className="bg-off-white rounded-lg p-3 text-lg">
              <p
                ref={desktopTextClampRef}
                className="line-clamp-14 break-normal wrap-anywhere whitespace-pre-wrap"
              >
                {poem.body}
              </p>

              {/* Read more button */}
              {desktopHasReadMore && (
                <button
                  onClick={() => setIsReadMoreOpen(true)}
                  className="w-fit cursor-pointer text-gray-400 transition-colors hover:text-gray-500"
                >
                  Read more
                </button>
              )}
            </div>

            {/* Poem metadata and likes */}
            <div className="flex items-center justify-between border-t pt-2">
              <button
                onClick={() =>
                  handleToggleLike(poem.id, !poem.isLikedByCurrentUser)
                }
                className="flex min-w-13 cursor-pointer items-center gap-2 border border-black p-1 pr-2 transition-opacity hover:opacity-80"
              >
                <Star
                  size={28}
                  fill={poem.isLikedByCurrentUser ? '#fbbf24' : 'none'}
                />
                <span className="text-lg font-semibold">
                  {poem._count?.likes}
                </span>
              </button>
              <div className="flex items-center gap-2">
                <p className="text-muted-foreground text-sm">
                  {poem.body.split('\n').length} lines
                </p>
                {/* Dropdown menu for signed-in users */}
                {!isGuest && <OtherUserPoemMenu poem={poem} />}
              </div>
            </div>
          </CardContent>
        </ShadowCard>

        {/* Desktop background image */}
        <div className="pointer-events-none absolute inset-0">
          <Image
            className="mx-auto max-w-6xl object-cover opacity-15"
            src="/potd-desktop-background.png"
            alt="Hands holding pen background"
            priority
            fill
          />
        </div>
      </div>
    </>
  )
}
