'use client'

import axios from 'axios'
import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'

import { ShadowCard } from '@/components/shadow-card'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { api, displayApiError } from '@/lib/api'

interface PoemData {
  id: string
  title: string
  authorUsername: string
  category?: string
  lines: string[]
  linecount: string
  rating?: number
}

// Dummy poem data for development/preview
const DUMMY_POEM: PoemData = {
  id: '1',
  title: 'Sonnet 1',
  authorUsername: 'User 2',
  category: 'Sonnet · Romance',
  lines: [
    'Beneath the velvet cloak of silver night,',
    'I find my world reflected in your eyes,',
    'A soft and steady, soul-consuming light,',
    'That steals the breath of all my weary sighs,',
    'The winter frost may chill the hollow air,',
    'And summer blooms may wither in the sun,',
    'But nothing dims the grace of what we share,',
    'Two separate paths that are joined and beat as one',
    'No gilded crown could ever hold the worth,',
    'Of quiet moments whispered in the dark,',
    'For you have been my anchor to the Earth,',
    'And to my soul, you are the living spark,',
    'Though time may drift as tide pulls us from the shore,',
    "I'll love you now, and then forevermore."
  ],
  linecount: '14',
  rating: 7,
}

const USE_DUMMY_DATA = true
const LINES_TO_SHOW = 8

export default function PoemOfTheDay() {
  const [poem, setPoemData] = useState<PoemData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [fullPoemOpen, setFullPoemOpen] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  // Fetch poem data on component mount
  useEffect(() => {
    const fetchPoem = async () => {
      try {
        setIsLoading(true)
        if (USE_DUMMY_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500))
          setPoemData(DUMMY_POEM)
        } else {
          const response = await api.get('/poems/poem-of-the-day')
          setPoemData(response.data)
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          displayApiError(error, 'Failed to load poem of the day')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchPoem()
  }, [])

  if (isLoading) {
    return (
      <ShadowCard className="mx-auto w-full max-w-2xl">
        <CardContent className="flex h-96 items-center justify-center">
          <p className="text-muted-foreground">Loading poem of the day...</p>
        </CardContent>
      </ShadowCard>
    )
  }

  if (!poem) {
    return (
      <ShadowCard className="mx-auto w-full max-w-2xl">
        <CardContent className="flex h-96 items-center justify-center">
          <p className="text-muted-foreground">
            No poem available at the moment
          </p>
        </CardContent>
      </ShadowCard>
    )
  }

  return (
    <ShadowCard className="mx-auto w-full max-w-2xl">
      <CardHeader className="pb-0">
        <div className="space-y-2 pb-2 border-b">
          <div>
            <div className="mb-1 inline-block rounded-full bg-yellow-400 px-3 py-0.5 text-xs font-semibold text-black">
              TODAY&#39;S FEATURED POEM
            </div>
            <CardTitle className="text-xl font-bold md:text-2xl">
              {poem.title}
            </CardTitle>
          </div>

          {/* Author info with category */}
          <p className="text-xs font-medium text-muted-foreground md:text-sm">
            {poem.authorUsername}
            {poem.category && ` · ${poem.category}`}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 py-0">
        {/* Poem lines */}
        <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
          <div className="space-y-0.5">
            {poem.lines.slice(0, LINES_TO_SHOW).map((line, index) => (
              <p
                key={index}
                className="leading-snug text-sm text-foreground md:text-base"
              >
                {line}
              </p>
            ))}
            {poem.lines.length > LINES_TO_SHOW && (
              <button
                onClick={() => setFullPoemOpen(true)}
                className="text-sm text-gray-400 hover:text-gray-500 transition-colors"
              >
                ... Read more
              </button>
            )}
          </div>
        </div>

        {/* Poem metadata and rating */}
        <div className="flex items-center justify-between border-t pt-2">
          {poem.rating !== undefined && (
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="flex items-center gap-2 border border-black p-1 pr-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <Star
                size={28}
                className="text-black"
                fill={isLiked ? '#fbbf24' : 'none'}
              />
              <span className="text-lg font-semibold">{poem.rating}</span>
            </button>
          )}
          <p className="text-xs text-muted-foreground">{poem.linecount} lines</p>
        </div>
      </CardContent>

      {/* Full poem modal */}
      <Dialog open={fullPoemOpen} onOpenChange={setFullPoemOpen}>
        <DialogContent className="!max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{poem.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground mb-4">
              {poem.authorUsername}
              {poem.category && ` · ${poem.category}`}
            </p>
            <div className="space-y-1 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
              {poem.lines.map((line, index) => (
                <p
                  key={index}
                  className="leading-relaxed text-foreground md:text-lg"
                >
                  {line}
                </p>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="flex items-center gap-2 border border-black p-1 pr-2 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <Star
                  size={28}
                  className="text-black"
                  fill={isLiked ? '#fbbf24' : 'none'}
                />
                <span className="text-lg font-semibold">{poem.rating}</span>
              </button>
              <span className="text-sm text-muted-foreground">
                {poem.linecount} lines
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ShadowCard>
  )
}
