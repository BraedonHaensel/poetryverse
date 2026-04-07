import { Star } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { PoemData } from '@/lib/poem-requests'

interface FullPoemDialogProps {
  poem: PoemData | null
  isOpen: boolean
  isLiked: boolean
  onOpenChange: (open: boolean) => void
  onToggleLike: () => void
}

export function FullPoemDialog({
  poem,
  isOpen,
  isLiked,
  onOpenChange,
  onToggleLike,
}: FullPoemDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-2xl! overflow-y-auto px-4 md:px-8">
        <DialogHeader>
          <DialogTitle className="text-2xl">{poem?.title}</DialogTitle>
        </DialogHeader>
        {poem && (
          <div className="space-y-1">
            <p className="text-muted-foreground mb-4 text-sm">
              {poem.author?.username || poem.authorId} · {poem.type.name}
            </p>
            <div className="space-y-1 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
              <p className="text-foreground leading-relaxed md:text-lg">
                {poem.body}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={onToggleLike}
                className="flex cursor-pointer items-center gap-2 border border-black p-1 pr-2 transition-opacity hover:opacity-80"
              >
                <Star
                  size={28}
                  className="text-black"
                  fill={isLiked ? '#fbbf24' : 'none'}
                />
                  <span className="text-lg font-semibold">{poem.count?.likes ?? 0}</span>
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
