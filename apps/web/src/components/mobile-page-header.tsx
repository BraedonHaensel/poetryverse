import Image from 'next/image'

import { cn } from '@/lib/utils'

import SignInButton from './auth-buttons/sign-in-button'

type Props = {
  showLogo?: boolean
  title: string
  showSignInButton?: boolean
  image?: string
  className?: string
}

/**
 * Header displayed at the top of mobile pages.
 * @param showLogo Whether to show the PoetryVerse feather logo.
 * @param title The page title to display in the header.
 * @param showSignInButton Whether to show the sign in button.
 * @param image An optional image to display on the right side of the header.
 * @param className Optional additional className values to apply.
 */
export default function MobilePageHeader({
  showLogo = false,
  title,
  showSignInButton = false,
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
      <div className="flex gap-4">
        {showLogo && (
          <Image
            src="/feather-logo.svg"
            alt="PoetryVerse logo"
            width={30}
            height={30}
          />
        )}
        <h1>{title}</h1>
      </div>

      {showSignInButton ? (
        <SignInButton className="w-26" />
      ) : (
        image !== undefined && (
          <Image src={image} alt="" width={40} height={40} />
        )
      )}
    </div>
  )
}
