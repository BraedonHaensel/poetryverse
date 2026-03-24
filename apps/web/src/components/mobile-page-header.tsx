import Image from 'next/image'

import { cn } from '@/lib/utils'

type Props = {
  title: string
  image?: string
  className?: string
}

/**
 * Header displayed at the top of mobile pages.
 */
export default function MobilePageHeader({
  title,
  image,
  className = '',
}: Props) {
  return (
    <div
      className={cn(
        'sticky top-0 z-10 flex h-16 items-center justify-between border-b-2 border-black/30 bg-white px-4 text-2xl font-extrabold',
        className
      )}
    >
      <h1>{title}</h1>
      {image !== undefined && (
        <Image src={image} alt="" width={40} height={40} />
      )}
    </div>
  )
}
