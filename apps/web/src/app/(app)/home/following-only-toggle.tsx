'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = {
  isFollowingOnly: boolean
  setIsFollowingOnly: (value: boolean) => void
  className?: string
}

export function FollowingOnlyToggle({
  isFollowingOnly,
  setIsFollowingOnly,
  className = '',
}: Props) {
  return (
    <Button
      className={cn(
        'w-full cursor-pointer border-2 border-black/50 text-lg font-bold',
        className
      )}
      variant={isFollowingOnly ? 'default' : 'outline'}
      onClick={() => setIsFollowingOnly(!isFollowingOnly)}
    >
      {isFollowingOnly ? 'Following Only' : 'All Users'}
    </Button>
  )
}
