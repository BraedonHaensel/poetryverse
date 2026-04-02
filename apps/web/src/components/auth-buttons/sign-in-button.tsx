'use client'

import { signIn } from 'next-auth/react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'

import { Button } from '../ui/button'

type Props = {
  text?: string
  className?: string
}

/**
 * Button for signing in with a Google account using NextAuth.js.
 */
const SignInButton = ({ text = 'Sign In', className = '' }: Props) => {
  return (
    <Button
      className={cn('cursor-pointer', className)}
      onClick={() => {
        // Sign in with a Google account using NextAuth.js
        signIn('google').catch((error) => {
          console.log(error)
          toast.error(error)
        })
      }}
    >
      {text}
    </Button>
  )
}

export default SignInButton
