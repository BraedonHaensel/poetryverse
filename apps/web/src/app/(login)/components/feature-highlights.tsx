'use client'

import { Globe, ShieldPlus, ShieldUser } from 'lucide-react'
import { useState } from 'react'
import { useSwipeable } from 'react-swipeable'

import { cn } from '@/lib/utils'

const features = [
  {
    icon: <ShieldUser />,
    title: 'Human-Verified Content',
    description:
      'Improving AI transparency in poetry by verifying authentic human writing.',
  },
  {
    icon: <Globe />,
    title: 'Global Community',
    description:
      'Breaking down language barriers, one poem at a time, with translation and interpretation.',
  },
  {
    icon: <ShieldPlus />,
    title: 'Safe Creative Space',
    description: 'Active moderation supports a respectful creative space.',
  },
]

export default function FeatureHighlights() {
  const [index, setIndex] = useState(0)

  // Handle swiping through the carousel
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setIndex((prev) => (prev + 1) % features.length),
    onSwipedRight: () =>
      setIndex((prev) => (prev - 1 + features.length) % features.length),
    trackMouse: true, // Support mouse swipes on desktop
  })

  return (
    <div {...swipeHandlers} className="w-full space-y-4 overflow-hidden">
      {/* Features */}
      <div
        className={cn(
          'flex duration-300 select-none',
          `translate-x-[-${index * 100}%]`
        )}
      >
        {features.map((feature, i) => (
          <div
            key={i}
            className="flex h-20 w-full shrink-0 flex-col items-center text-center"
          >
            {feature.icon}
            <span className="text-md">{feature.title}</span>
            <span className="text-sm">{feature.description}</span>
          </div>
        ))}
      </div>

      {/* Carousel dots */}
      <div className="flex w-full justify-center gap-4">
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
    </div>
  )
}
