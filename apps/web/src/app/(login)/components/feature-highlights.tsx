'use client'

import { Globe, ShieldPlus, ShieldUser } from 'lucide-react'
import { useState } from 'react'
import { useSwipeable } from 'react-swipeable'

import { cn } from '@/lib/utils'

const features = [
  {
    icon: ShieldUser,
    title: 'Human-Verified Content',
    description:
      'Improving AI transparency in poetry by verifying authentic human writing.',
  },
  {
    icon: Globe,
    title: 'Global Community',
    description:
      'Breaking down language barriers, one poem at a time, with translation and interpretation.',
  },
  {
    icon: ShieldPlus,
    title: 'Safe Creative Space',
    description: 'Active moderation supports a respectful creative space.',
  },
]

type Props = {
  className?: string
}

export default function FeatureHighlights({ className = '' }: Props) {
  const [index, setIndex] = useState(0)

  // Handle swiping through the carousel
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setIndex((prev) => (prev + 1) % features.length),
    onSwipedRight: () =>
      setIndex((prev) => (prev - 1 + features.length) % features.length),
    trackMouse: true, // Support mouse swipes on desktop
  })

  return (
    <div
      {...swipeHandlers}
      className={cn('flex flex-col gap-4 overflow-hidden', className)}
    >
      {/* Features carousel */}
      <div
        className="flex flex-1 items-center text-center select-none"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {features.map((feature, i) => (
          <div key={i} className="flex w-full shrink-0 flex-col items-center">
            <feature.icon size={100} className="mb-6" />
            <span className="mb-4 text-3xl font-bold">{feature.title}</span>
            <span className="text-lg">{feature.description}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4">
        {/* Carousel dots */}
        <div className="flex gap-4">
          {features.map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-3 w-3 rounded-full',
                i === index ? 'bg-muted-foreground' : 'bg-gray-300'
              )}
            />
          ))}
        </div>
        {/* Divider line */}
        <div className="h-0.5 w-full bg-[linear-gradient(to_right,transparent,rgba(0,0,0,0.15),transparent)]" />
        <p className="text-muted-foreground">Swipe to learn more</p>
      </div>
    </div>
  )
}
