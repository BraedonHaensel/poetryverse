'use client'

import {
  Calendar,
  House,
  LucideProps,
  Plus,
  Settings,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

import { cn, GUEST_ACCESSIBLE_PAGES } from '@/lib/utils'

import CreateSheet from './create-nav-sheet'
import SignInRequiredDialog from './sign-in-required-dialog'

const links = [
  { icon: House, href: '/home' },
  { icon: Calendar, href: '/poem-of-the-day' },
  { icon: Plus, href: '/create' },
  { icon: User, href: '/profile' },
  { icon: Settings, href: '/settings' },
]

type MainNavLinkProps = {
  href: string
  Icon: React.FC<LucideProps>
  isOnPage: boolean
  disabled?: boolean
}

/**
 * Navigation bar links.
 */
function MainNavLink({
  href,
  Icon,
  isOnPage,
  disabled = false,
}: MainNavLinkProps) {
  const baseClassName = cn(
    'relative pb-1 font-medium text-black cursor-pointer',
    isOnPage ? 'font-semibold' : 'opacity-90'
  )
  const content = (
    <>
      <Icon
        className="h-12 w-12 min-[380px]:h-13 min-[380px]:w-13"
        strokeWidth={isOnPage ? 2.8 : 2}
      />
      {/* Underline the navbar item for the current page */}
      {isOnPage && (
        <span className="absolute -bottom-0.5 left-0 h-0.5 w-full rounded bg-black/40" />
      )}
    </>
  )

  return disabled ? (
    <div className={baseClassName}>{content}</div>
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
 * Bottom navigation bar for mobile layouts.
 */
export default function MobileNavbar({ className = '' }: Props) {
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
      <footer
        className={cn('h-full border-t-2 border-black/30 bg-white', className)}
      >
        <nav className="flex h-full w-full items-center justify-center gap-3 min-[380px]:gap-4 min-[450px]:gap-6 sm:gap-8">
          {links.map((link) => {
            // Whether the user is currently on the link's page

            const isOnPage = pathname.startsWith(link.href)

            // Whether the user needs to sign in first to access this page
            const signInRequired =
              isGuest && !GUEST_ACCESSIBLE_PAGES.includes(link.href)

            // Create the navigation bar link component
            const NavLink = ({ disabled = false }: { disabled?: boolean }) => (
              <MainNavLink
                href={link.href}
                Icon={link.icon}
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

            if (link.href === '/create') {
              // Clicking the link opens the bottom sheet for selecting the poem creation mode
              return (
                <CreateSheet key={link.href}>
                  <NavLink disabled={true} />
                </CreateSheet>
              )
            }

            // Return the default navigation bar link
            return <NavLink key={link.href} />
          })}
        </nav>
      </footer>
    </>
  )
}
