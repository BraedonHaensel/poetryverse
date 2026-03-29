import { LoaderCircle } from 'lucide-react'

import { cn } from '@/lib/utils'

type Props = {
  className?: string
}

/**
 * Standard loading indicator to display while a page is loading.
 */
export default function PageLoadingIndicator({ className = '' }: Props) {
  return (
    <LoaderCircle
      className={cn('mx-auto mt-5 h-10 w-10 animate-spin', className)}
    />
  )
}
