'use client'

import axios from 'axios'
import { Star } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import MobilePageHeader from '@/components/mobile-page-header'
import PageLoadingIndicator from '@/components/page-loading-indicator'
import { ShadowCard } from '@/components/shadow-card'
import SignInRequiredDialog from '@/components/sign-in-required-dialog'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { api, displayApiError } from '@/lib/api'
import { type PoemData } from '@/lib/poem-requests'

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
  count: {
    likes: 2,
  },
  isPublic: true,
  isAIAssisted: false,
  aiLikelihoonScore: 0.26,
  poemTags: [],
  createdAt: new Date('2026-03-15T03:09:16.151Z'),
  updatedAt: new Date('2026-03-15T03:09:16.151Z'),
}

const USE_DUMMY_DATA = true
const LINES_TO_SHOW = 8

export default function PoemOfTheDay() {
  const { data: session } = useSession()
  const isGuest = !session
  const [poem, setPoemData] = useState<PoemData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [fullPoemOpen, setFullPoemOpen] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [showSignInDialog, setShowSignInDialog] = useState(false)

  const toggleLike = () => {
    if (isGuest) {
      setShowSignInDialog(true)
      return
    }
    setIsLiked(!isLiked)
  }

  // Fetch poem data on component mount
  useEffect(() => {
    const fetchPoem = async () => {
      try {
        setIsLoading(true)
        if (USE_DUMMY_DATA) {
          await new Promise((resolve) => setTimeout(resolve, 500))
          setPoemData(DUMMY_POEM)
        } else {
          const response = await api.get('/poems/poem-of-the-day')
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

  if (isLoading) {
    return (
      <>
        <div className="flex flex-1 flex-col gap-4 md:hidden">
          <MobilePageHeader
            title="Poem of the Day"
            showLogo={true}
            showGuestSignIn={true}
          />
          <PageLoadingIndicator />
        </div>

        <div className="hidden md:flex">
          <PageLoadingIndicator />
        </div>
      </>
    )
  }

  if (!poem) {
    return (
      <>
        <div className="flex flex-1 flex-col gap-4 md:hidden">
          <MobilePageHeader
            title="Poem of the Day"
            showLogo={true}
            showGuestSignIn={true}
          />
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
      {/* Mobile layout */}
      <div className="flex flex-1 flex-col gap-4 md:hidden">
        <MobilePageHeader
          title="Poem of the Day"
          showLogo={false}
          showGuestSignIn={true}
        />

        <div className="flex flex-col gap-2 px-2 pb-2">
          <ShadowCard>
            <CardHeader className="pb-2 text-center">
              <div className="mb-1 block w-full rounded-full bg-yellow-400 px-3 py-0.5 text-xs font-semibold text-black">
                ✨ TODAY&#39;S FEATURED POEM ✨
              </div>
              <CardTitle className="text-2xl font-bold">{poem.title}</CardTitle>
              <p className="text-muted-foreground text-sm font-medium">
                {poem.author.username}
              </p>
            </CardHeader>

            <CardContent className="flex flex-col gap-2">
              <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                <div className="space-y-0.5">
                  {poem.body
                    .split('\n')
                    .slice(0, LINES_TO_SHOW)
                    .map((line, index) => (
                      <p
                        key={index}
                        className="text-foreground text-sm leading-snug"
                      >
                        {line}
                      </p>
                    ))}
                  {poem.body.split('\n').length > LINES_TO_SHOW && (
                    <button
                      onClick={() => setFullPoemOpen(true)}
                      className="cursor-pointer text-sm text-gray-400 transition-colors hover:text-gray-500"
                    >
                      ... Read more
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t pt-2">
                <button
                  onClick={toggleLike}
                  className="flex cursor-pointer items-center gap-2 border border-black p-1 pr-2 transition-opacity hover:opacity-80"
                >
                  <Star
                    size={20}
                    className="text-black"
                    fill={isLiked ? '#fbbf24' : 'none'}
                  />
                  <span className="text-sm font-semibold">{poem.count.likes}</span>
                </button>
                <p className="text-muted-foreground text-xs">
                  {poem.body.split('\n').length} lines
                </p>
              </div>
            </CardContent>
          </ShadowCard>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="my-auto hidden md:flex">
        <ShadowCard className="mx-auto w-full max-w-2xl">
          <CardHeader className="pb-0 text-center">
            <div className="space-y-2 border-b pb-2">
              <div>
                <div className="mb-1 block w-full rounded-full bg-yellow-400 px-3 py-0.5 text-xs font-semibold text-black">
                  ✨ TODAY&#39;S FEATURED POEM ✨
                </div>
                <CardTitle className="text-2xl font-bold md:text-3xl">
                  {poem.title}
                </CardTitle>
              </div>

              {/* Author info */}
              <p className="text-muted-foreground text-sm font-medium md:text-base">
                {poem.author.username}
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 py-0">
            {/* Poem lines */}
            <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
              <div className="space-y-0.5">
                {poem.body
                  .split('\n')
                  .slice(0, LINES_TO_SHOW)
                  .map((line, index) => (
                    <p
                      key={index}
                      className="text-foreground text-sm leading-snug md:text-base"
                    >
                      {line}
                    </p>
                  ))}
                {poem.body.split('\n').length > LINES_TO_SHOW && (
                  <button
                    onClick={() => setFullPoemOpen(true)}
                    className="cursor-pointer text-sm text-gray-400 transition-colors hover:text-gray-500"
                  >
                    ... Read more
                  </button>
                )}
              </div>
            </div>

            {/* Poem metadata and likes */}
            <div className="flex items-center justify-between border-t pt-2">
              <button
                onClick={toggleLike}
                className="flex cursor-pointer items-center gap-2 border border-black p-1 pr-2 transition-opacity hover:opacity-80"
              >
                <Star
                  size={28}
                  className="text-black"
                  fill={isLiked ? '#fbbf24' : 'none'}
                />
                <span className="text-lg font-semibold">{poem.count.likes}</span>
              </button>
              <p className="text-muted-foreground text-xs">
                {poem.body.split('\n').length} lines
              </p>
            </div>
          </CardContent>
        </ShadowCard>
      </div>

      {/* Full poem modal */}
      <Dialog open={fullPoemOpen} onOpenChange={setFullPoemOpen}>
        <DialogContent className="max-h-[80vh] max-w-2xl! overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{poem.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-1">
            <p className="text-muted-foreground mb-4 text-sm">
              {poem.author.username}
            </p>
            <div className="space-y-1 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
              {poem.body.split('\n').map((line, index) => (
                <p
                  key={index}
                  className="text-foreground leading-relaxed md:text-lg"
                >
                  {line}
                </p>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={toggleLike}
                className="flex cursor-pointer items-center gap-2 border border-black p-1 pr-2 transition-opacity hover:opacity-80"
              >
                <Star
                  size={28}
                  className="text-black"
                  fill={isLiked ? '#fbbf24' : 'none'}
                />
                <span className="text-lg font-semibold">
                  {poem.count.likes}
                </span>
              </button>
              <span className="text-muted-foreground text-sm">
                {poem.body.split('\n').length} lines
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SignInRequiredDialog
        isOpen={showSignInDialog}
        onClose={() => setShowSignInDialog(false)}
      />
    </>
  )
}
