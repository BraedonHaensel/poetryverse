'use client'

import { Calendar, House, Plus, Settings, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

import CreateSheet from './create-nav-sheet'

const links = [
  { icon: House, href: '/home' },
  { icon: Calendar, href: '/poem-of-the-day' },
  { icon: Plus, href: '/create' },
  { icon: User, href: '/profile' },
  { icon: Settings, href: '/settings' },
]

type Props = {
  className?: string
}

export default function MobileNavbar({ className = '' }: Props) {
  const pathname = usePathname()

  return (
    <footer
      className={cn('h-full border-t-2 border-black/30 bg-white', className)}
    >
      <nav className="flex h-full w-full items-center justify-center gap-3 min-[380px]:gap-4 min-[450px]:gap-6 sm:gap-8">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href)
          if (link.href === '/create') {
            // Poem creation method method dropdown
            return (
              <CreateSheet
                key={link.href}
                Icon={link.icon}
                isActive={pathname.startsWith('/create/')}
              />
            )
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative pb-1 font-medium text-black ${
                isActive ? 'font-semibold' : 'opacity-90'
              }`}
            >
              <link.icon
                className="h-12 w-12 min-[380px]:h-13 min-[380px]:w-13"
                strokeWidth={isActive ? 2.8 : 2}
              />
              {isActive && (
                <span className="absolute -bottom-0.5 left-0 h-0.5 w-full rounded bg-black/40" />
              )}
            </Link>
          )
        })}
      </nav>
    </footer>
  )
}
