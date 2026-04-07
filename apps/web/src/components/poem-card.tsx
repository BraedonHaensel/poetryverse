import { Star } from 'lucide-react'

import { ShadowCard } from '@/components/shadow-card'
import { CardContent, CardHeader } from '@/components/ui/card'
import type { PoemData } from '@/lib/poem-requests'

interface PoemCardProps {
  poem: PoemData
  isLiked: boolean
  onToggleLike: () => void
  onReadMore: () => void
  previewLength?: number
  showAILabel?: boolean
}

export function PoemCard({
  poem,
  isLiked,
  onToggleLike,
  onReadMore,
  previewLength = 100,
  showAILabel = true,
}: PoemCardProps) {
  const isPreviewTruncated = poem.body.length > previewLength

  return (
    <ShadowCard>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold">{poem.title}</h3>
            <p className="text-sm text-gray-600 truncate">
              {poem.author?.username || poem.authorId} · {poem.type.name}
            </p>
          </div>
          {showAILabel && poem.isAIAssisted && (
            <span className="rounded-full bg-black px-3 py-1 text-sm font-bold whitespace-nowrap text-white">
              AI Assisted
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <p className="text-sm">
          {poem.body.substring(0, previewLength)}
        </p>
        {isPreviewTruncated && (
          <button
            onClick={onReadMore}
            className="w-fit cursor-pointer text-sm text-gray-400 transition-colors hover:text-gray-500"
          >
            ... Read more
          </button>
        )}
        <div className="flex items-center gap-2 border-t pt-2">
          <button
            onClick={onToggleLike}
            className="flex cursor-pointer items-center gap-2 border border-black p-1 pr-2 transition-opacity hover:opacity-80"
          >
            <Star
              size={20}
              className="text-black"
              fill={isLiked ? '#fbbf24' : 'none'}
            />
              <span className="text-sm font-semibold">{poem.count?.likes ?? 0}</span>
          </button>
        </div>
      </CardContent>
    </ShadowCard>
  )
}
