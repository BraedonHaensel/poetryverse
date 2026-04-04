import { ArrowLeftFromLine } from 'lucide-react'
import Image from 'next/image'

import { cn } from '@/lib/utils'

import SignInButton from './auth-buttons/sign-in-button'

type Props = {
  className?: string
  showBackButton?: boolean
  onBackButton?: () => void
  showLogo?: boolean
  title: string
  showSignInButton?: boolean
  image?: string
  children?: React.ReactNode
}

/**
 * Header displayed at the top of mobile pages.
 * @param className Optional additional className values to apply.
 * @param showBackButton Whether to show a back button to exit the page.
 * @param onBackButton Callback called after clicking the back button.
 * @param showLogo Whether to show the PoetryVerse feather logo.
 * @param title The page title to display in the header.
 * @param showSignInButton Whether to show the sign in button.
 * @param image An optional image to display on the right side of the header.
 * @param children An optional child component to render on the right side.
 */
export default function MobilePageHeader({
  showBackButton = false,
  onBackButton = () => {},
  showLogo = false,
  title,
  showSignInButton = false,
  image,
  className = '',
  children,
}: Props) {
  return (
    <div
      className={cn(
        'sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b-2 border-black/30 bg-white px-4 text-2xl font-extrabold',
        className
      )}
    >
      {/* Left side */}
      <div className="flex min-w-0 items-center gap-4">
        {showBackButton && (
          <ArrowLeftFromLine
            className="-mr-2 shrink-0 cursor-pointer hover:opacity-70"
            size={32}
            onClick={onBackButton}
          />
        )}

        {showLogo && (
          <Image
            src="/feather-logo.svg"
            alt="PoetryVerse logo"
            width={30}
            height={30}
          />
        )}
        <h1 className="truncate" title={title}>
          {title}
        </h1>
      </div>

      {/* Right side */}
      {showSignInButton ? (
        <SignInButton className="w-26" />
      ) : image !== undefined ? (
        <Image src={image} alt="" width={40} height={40} />
      ) : (
        <>{children}</>
      )}
    </div>
  )
}
