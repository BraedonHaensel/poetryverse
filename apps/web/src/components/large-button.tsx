import * as React from 'react'

import { cn } from '@/lib/utils'

import { Button } from './ui/button'

// Wraps the shadcn Button component for larger default styling.
export function LargeButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn('h-auto w-full text-lg whitespace-normal', className)}
      {...props}
    />
  )
}
