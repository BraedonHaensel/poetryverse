import { Globe, LockKeyhole, Star } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { PoemData } from '@/lib/poem-requests'

type Props = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  poem: PoemData
  onToggleLike: (poemId: string, isLike: boolean) => void
  isOnProfilePage?: boolean
  isOnMyProfilePage?: boolean
}

/**
 * Dialog for viewing an enlarged poem card.
 * @param isOpen Whether the dialog is open.
 * @param onOpenChange Callback called when the dialog is opened or closed.
 * @param poem Poem to display.
 * @param onToggleLike Callback to handle liking or removing a like from the poem.
 * @param onReadMore Callback to open a read more viewer.
 * @param isOnProfilePage Whether the poem is being viewed from the profile page.
 * @param isOnMyProfilePage Whether the poem is being viewed from the user's own
 * profile page.
 */
export function FullPoemDialog({
  isOpen,
  onOpenChange,
  poem,
  onToggleLike,
  isOnProfilePage = false,
  isOnMyProfilePage = false,
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl! overflow-auto px-4 md:px-8"
        aria-describedby={undefined}
      >
        <DialogHeader className="flex flex-row items-start justify-between gap-2 break-normal wrap-anywhere">
          <div className="space-y-2">
            {/* Poem title */}
            <DialogTitle className="flex items-center gap-2 text-2xl">
              {isOnMyProfilePage &&
                // Visibility icon when viewing your own profile page
                (poem.isPublic ? (
                  <Globe size={22} />
                ) : (
                  <LockKeyhole size={22} />
                ))}
              <span className="font-bold">{poem.title}</span>
            </DialogTitle>

            {/* Poem details */}
            <p className="text-sm text-gray-600">
              {!isOnProfilePage && (
                // Display the auther's username, unless currently on their profile page
                <span>{`${poem.author.username} · `}</span>
              )}
              {`${poem.type.name} · ${poem.poemTags.map((tag) => tag.tag.name).join(', ')}`}
            </p>
          </div>

          {/* AI Assisted indicator */}
          {poem.isAIAssisted && (
            <span className="mr-4 rounded-full bg-black px-3 py-1 text-xs font-bold whitespace-nowrap text-white min-[400px]:text-base">
              AI Assisted
            </span>
          )}
        </DialogHeader>
        <div className="space-y-1">
          {/* Poem contents */}
          <div className="bg-off-white max-h-[60vh] overflow-y-auto rounded-lg border p-4">
            <p className="leading-relaxed whitespace-pre-wrap md:text-lg">
              {poem.body}
            </p>
          </div>

          {/* Like button */}
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => onToggleLike(poem.id, !poem.isLikedByCurrentUser)}
              className="flex min-w-16 cursor-pointer items-center gap-2 border border-black p-1 pr-2 transition-opacity hover:opacity-80"
            >
              <Star
                size={28}
                fill={poem.isLikedByCurrentUser ? '#fbbf24' : 'none'}
              />
              <span className="text-lg font-semibold">{poem._count.likes}</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
