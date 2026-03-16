import * as React from 'react'

import { cn } from '@/lib/utils'

import { Card } from './ui/card'

/**
 * Wraps the shadcn Card component with a larger shadow and border.
 */
export function ShadowCard({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return <Card className={cn('border-2 shadow-lg', className)} {...props} />
}
