'use client'

import { signIn } from 'next-auth/react'
import { toast } from 'sonner'

import { Button } from '../ui/button'

type Props = {
  text: string
}

/**
 * Button for signing in with a Google account using NextAuth.js.
 */
const SignInButton = ({ text }: Props) => {
  return (
    <Button
      onClick={() => {
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
