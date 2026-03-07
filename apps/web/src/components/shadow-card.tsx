import * as React from 'react'

import { cn } from '@/lib/utils'
import { Card } from './ui/card'

// Standard card component to use. Includes a larger border and a shadow effect
export function ShadowCard({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return <Card className={cn('border-2 shadow-lg', className)} {...props} />
}
