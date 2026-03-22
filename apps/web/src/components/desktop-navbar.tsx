'use client'

import { Feather, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import SignOutButton from '@/components/auth-buttons/sign-out-button'
import { cn } from '@/lib/utils'

import CreateDropdown from './create-nav-dropdown'

const links = [
  { label: 'Home', href: '/home' },
  { label: 'Poem of the Day', href: '/poem-of-the-day' },
  { label: 'Create', href: '/create' },
  { label: 'My Profile', href: '/profile' },
]

type Props = {
  className?: string
}

export default function DesktopNavbar({ className = '' }: Props) {
  const pathname = usePathname()

  return (
    <header className={cn('border-b-2 border-black/30 bg-white', className)}>
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Home">
            <Feather size={22} strokeWidth={2} className="text-black" />
          </Link>

          <nav className="flex items-center gap-8 text-[20px]">
            {links.map((link) => {
              if (link.label === 'Create') {
                // Poem creation method method dropdown
                return (
                  <CreateDropdown
                    key={link.href}
                    isActive={pathname.startsWith('/create/')}
                  />
                )
              }

              const isActive = pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative pb-1 font-medium text-black ${
                    isActive ? 'font-semibold' : 'opacity-90'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-0 h-0.5 w-full rounded bg-black/40" />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-8">
          <Link
            href={'/settings'}
            className="relative rounded-full py-1 hover:bg-black/5 active:bg-black/10"
          >
            <Settings
              size={32}
              strokeWidth={pathname === '/settings' ? 2.8 : 2}
              className="text-black"
            />
            {pathname === '/settings' && (
              <span className="absolute -bottom-0.5 left-0 h-0.5 w-full rounded bg-black" />
            )}
          </Link>
          <SignOutButton text="Sign Out" />
        </div>
      </div>
    </header>
  )
}
