'use client'

import { Settings } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

import SignOutButton from '@/components/auth-buttons/sign-out-button'
import { cn, GUEST_ACCESSIBLE_PAGES } from '@/lib/utils'

import SignInButton from './auth-buttons/sign-in-button'
import CreateDropdown from './create-nav-dropdown'
import SignInRequiredDialog from './sign-in-required-dialog'

const links = [
  { label: 'Home', href: '/home' },
  { label: 'Poem of the Day', href: '/poem-of-the-day' },
  { label: 'Create', href: '/create' },
  { label: 'My Profile', href: '/profile' },
]

type MainNavLinkProps = {
  href: string
  label: string
  isOnPage: boolean
  disabled?: boolean
}

/**
 * Navigation bar links for the main pages.
 */
function MainNavLink({
  href,
  label,
  isOnPage,
  disabled = false,
}: MainNavLinkProps) {
  const baseClassName = cn(
    'relative pb-1 font-medium cursor-pointer',
    isOnPage ? 'font-semibold' : 'opacity-90'
  )
  const content = (
    <>
      {label}
      {/* Underline the navbar item for the current page */}
      {isOnPage && (
        <span className="absolute -bottom-0.5 left-0 h-0.5 w-full rounded bg-black/40" />
      )}
    </>
  )

  return disabled ? (
    <button className={baseClassName} type="button">
      {content}
    </button>
  ) : (
    <Link href={href} className={baseClassName}>
      {content}
    </Link>
  )
}

type Props = {
  className?: string
}

/**
 * Top navigation bar for desktop layouts.
 */
export default function DesktopNavbar({ className = '' }: Props) {
  const [isSignInRequiredOpen, setSignInRequiredOpen] = useState(false)

  const pathname = usePathname()
  const session = useSession()
  const isGuest = session.status === 'unauthenticated'

  return (
    <>
      <SignInRequiredDialog
        isOpen={isSignInRequiredOpen}
        onClose={() => setSignInRequiredOpen(false)}
      />
      <header className={cn('border-b-2 border-black/30 bg-white', className)}>
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
          {/* Main navbar items on the left side */}
          <div className="flex items-center gap-8">
            <Link href="/" aria-label="Home">
              <Image
                src="/feather-logo.svg"
                alt="PoetryVerse logo"
                width={30}
                height={30}
              />
            </Link>

            <nav className="flex items-center gap-8 text-[20px]">
              {links.map((link) => {
                // Whether the user is currently on the link's page
                const isOnPage = pathname.startsWith(link.href)

                // Whether the user needs to sign in first to access this page
                const signInRequired =
                  isGuest && !GUEST_ACCESSIBLE_PAGES.includes(link.href)

                // Create the navigation bar link component
                const NavLink = ({
                  disabled = false,
                }: {
                  disabled?: boolean
                }) => (
                  <MainNavLink
                    href={link.href}
                    label={link.label}
                    isOnPage={isOnPage}
                    disabled={disabled || signInRequired}
                  />
                )

                if (signInRequired) {
                  // Clicking the link opens the sign in required dialog
                  return (
                    <div
                      key={link.href}
                      onClick={() => setSignInRequiredOpen(true)}
                    >
                      <NavLink />
                    </div>
                  )
                }

                if (link.label === 'Create') {
                  // Clicking the link opens the dropdown for selecting the poem creation mode
                  return (
                    <CreateDropdown key={link.href}>
                      <NavLink disabled={true} />
                    </CreateDropdown>
                  )
                }

                // Return the default navigation bar link
                return <NavLink key={link.href} />
              })}
            </nav>
          </div>

          {/* Extra navbar items on the right side */}
          <div className="flex items-center gap-8">
            <Link
              href={'/settings'}
              className="relative rounded-full py-1 hover:bg-black/5 active:bg-black/10"
            >
              <Settings
                size={32}
                strokeWidth={pathname === '/settings' ? 2.8 : 2}
              />
              {pathname === '/settings' && (
                <span className="absolute -bottom-0.5 left-0 h-0.5 w-full rounded bg-black" />
              )}
            </Link>
            {isGuest ? <SignInButton /> : <SignOutButton />}
          </div>
        </div>
      </header>
    </>
  )
}
