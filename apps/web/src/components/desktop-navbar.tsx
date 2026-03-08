'use client'

import { Feather, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import SignOutButton from '@/components/auth-buttons/sign-out-button'

const links = [
  { label: 'Home', href: '/' },
  { label: 'Poem of the Day', href: '/poem-of-the-day' },
  { label: 'Create', href: '/create' },
  { label: 'My Profile', href: '/profile' },
]

export default function DesktopNavbar() {
  const pathname = usePathname()

  return (
    <header className="w-full border-b border-black/10 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Home">
            <Feather size={22} strokeWidth={2} className="text-black" />
          </Link>

          <nav className="flex items-center gap-8 text-[20px]">
            {links.map((link) => {
              const isActive = pathname === link.href
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
                    <span className="absolute -bottom-0.5 left-0 h-0.5 w-full rounded bg-black" />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button
            aria-label="Settings"
            className="rounded-full p-2 hover:bg-black/5 active:bg-black/10"
          >
            <Settings size={22} strokeWidth={2} className="text-black" />
          </button>
          <SignOutButton text="Sign Out" />
        </div>
      </div>
    </header>
  )
}
