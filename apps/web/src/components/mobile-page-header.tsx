import { cn } from '@/lib/utils'

type Props = {
  title: string
  className?: string
}

/**
 * Header displayed at the top of mobile pages.
 */
export default function MobilePageHeader({ title, className = '' }: Props) {
  return (
    <div
      className={cn(
        'sticky top-0 z-10 flex h-16 items-center border-b-2 border-black/30 bg-white px-4 text-2xl font-extrabold',
        className
      )}
    >
      <h1>{title}</h1>
    </div>
  )
}
