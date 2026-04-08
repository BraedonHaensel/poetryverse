'use client'

import { Globe, Info, LockKeyhole, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, useRef, useState } from 'react'

import { ShadowCard } from '@/components/shadow-card'
import { CardContent, CardHeader } from '@/components/ui/card'
import type { PoemData } from '@/lib/poem-requests'

import { FullPoemDialog } from './full-poem-dialog'

type Props = {
  poem: PoemData
  onToggleLike: (poemId: string, isLike: boolean) => void
  isOnProfilePage?: boolean
  isOnMyProfilePage?: boolean
  children?: ReactNode
}

/**
 * Reusable poem card display component.
 * @param poem Poem to display.
 * @param onToggleLike Toggled liking and removing a like from the poem.
 * @param onReadMore Callback to open a read more viewer.
 * @param isOnProfilePage Whether the poem is being viewed from the profile page.
 * @param isOnMyProfilePage Whether the poem is being viewed from the user's own
 * profile page.
 * @param children Child menu component to display on the poem card.
 */
export default function PoemCard({
  poem,
  onToggleLike,
  isOnProfilePage = false,
  isOnMyProfilePage = false,
  children,
}: Props) {
  const textClampRef = useRef<HTMLParagraphElement>(null)
  const [hasReadMore, setHasReadMore] = useState(false)
  const [isReadMoreOpen, setIsReadMoreOpen] = useState(false)

  const router = useRouter()

  // Check if the "Read more" button needs to be displayed
  useEffect(() => {
    const el = textClampRef.current
    if (!el) return

    // Check if the poem line height exceeds the permitted space
    const checkClamp = () => {
      setHasReadMore(el.scrollHeight > el.clientHeight)
    }
    checkClamp()

    // Set an observer to react to size changes
    const observer = new ResizeObserver(checkClamp)
    observer.observe(el)

    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* Dialog after clicking "Read more" */}
      {hasReadMore && (
        <FullPoemDialog
          isOpen={isReadMoreOpen}
          onOpenChange={setIsReadMoreOpen}
          poem={poem}
          onToggleLike={onToggleLike}
          isOnProfilePage={isOnProfilePage}
          isOnMyProfilePage={isOnMyProfilePage}
        />
      )}

      {/* Poem card */}
      <ShadowCard className="gap-3">
        <CardHeader className="flex items-start justify-between gap-2 break-normal wrap-anywhere">
          <div className="space-y-2">
            {/* Poem title */}
            <div className="flex items-center gap-2">
              {isOnMyProfilePage &&
                // Visibility icon when viewing your own profile page
                (poem.isPublic ? (
                  <Globe size={22} />
                ) : (
                  <LockKeyhole size={22} />
                ))}
              <h3 className="font-bold">{poem.title}</h3>
            </div>

            {/* Poem details */}
            <p className="text-sm text-gray-600">
              {!isOnProfilePage && (
                // Display the auther's username, unless currently on their profile page
                <span
                  className="cursor-pointer hover:opacity-70"
                  onClick={() =>
                    router.push(`/profile?userId=${poem.authorId}`)
                  }
                >
                  {`${poem.author.username} · `}
                </span>
              )}
              {`${poem.type.name} · ${poem.poemTags.map((tag) => tag.tag.name).join(', ')}`}
            </p>
          </div>

          {/* AI Assisted indicator */}
          <div className="flex items-center">
            {poem.isAIAssisted && (
              <span className="rounded-full bg-black px-3 py-1 text-xs font-bold whitespace-nowrap text-white min-[400px]:text-sm">
                AI Assisted
              </span>
            )}
            {children}
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-2">
          {/* Poem contents */}
          <p
            ref={textClampRef}
            className="line-clamp-4 text-sm break-normal wrap-anywhere whitespace-pre-wrap"
          >
            {poem.body}
          </p>

          {/* Read more button */}
          {hasReadMore && (
            <button
              onClick={() => setIsReadMoreOpen(true)}
              className="w-fit cursor-pointer text-sm text-gray-400 transition-colors hover:text-gray-500"
            >
              Read more
            </button>
          )}

          <div className="mt-auto flex items-center justify-between gap-2 border-t pt-2">
            {/* Like button */}
            <button
              onClick={() => onToggleLike(poem.id, !poem.isLikedByCurrentUser)}
              className="flex min-w-13 cursor-pointer items-center gap-2 border border-black p-1 pr-2 transition-opacity hover:opacity-80"
            >
              <Star
                size={20}
                fill={poem.isLikedByCurrentUser ? '#fbbf24' : 'none'}
              />
              <span className="text-sm font-semibold">
                {poem._count?.likes ?? 0}
              </span>
            </button>

            {/* Poem pending approval indicator */}
            {['PENDING', 'ADMIN_REVIEW'].includes(poem.approvalStatus) && (
              <span className="flex items-center gap-2 rounded-full bg-amber-300 px-3 py-1 text-xs whitespace-nowrap min-[400px]:text-sm">
                <Info size={18} />
                <span>Pending Approval</span>
              </span>
            )}
          </div>
        </CardContent>
      </ShadowCard>
    </>
  )
}
