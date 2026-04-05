'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const POEM_TYPE_FILTER_MODES = ['ALL', 'AI_ASSISTED', 'HANDWRITTEN'] as const
export type PoemTypeFilterMode = (typeof POEM_TYPE_FILTER_MODES)[number]

type Props = {
  className?: string
  buttonClassName?: string
  mode: PoemTypeFilterMode
  setMode: (mode: PoemTypeFilterMode) => void
}

const DISPLAY_NAMES: Record<PoemTypeFilterMode, string> = {
  ALL: 'All',
  AI_ASSISTED: 'AI Assisted',
  HANDWRITTEN: 'Handwritten',
}

export default function PoemTypeFilters({
  className = '',
  buttonClassName = 'flex-1',
  mode,
  setMode,
}: Props) {
  return (
    <div className={cn('flex gap-2', className)}>
      {POEM_TYPE_FILTER_MODES.map((modeOption) => (
        <Button
          key={modeOption}
          className={cn(
            'cursor-pointer border-2 border-black/50 text-lg font-bold',
            buttonClassName
          )}
          variant={modeOption === mode ? 'default' : 'outline'}
          onClick={() => setMode(modeOption)}
        >
          {DISPLAY_NAMES[modeOption]}
        </Button>
      ))}
    </div>
  )
}
 