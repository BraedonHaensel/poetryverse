'use client'

import { signOut } from 'next-auth/react'

import { cn } from '@/lib/utils'

import { Button } from '../ui/button'

type Props = {
  text?: string
  className?: string
}

/**
 * Button for signing out of a Google account using NextAuth.js.
 */
const SignOutButton = ({ text = 'Sign Out', className = '' }: Props) => {
  return (
    <Button
      className={cn('cursor-pointer', className)}
      onClick={async () => {
        // Sign out and redirect to the Login page
        await signOut({ callbackUrl: '/' })
      }}
    >
      {text}
    </Button>
  )
}

export default SignOutButton
