'use client'
import { signOut } from 'next-auth/react'

import { Button } from '../ui/button'

type Props = { text?: string; className?: string }

const SignOutButton = ({ text = 'Sign Out', className = '' }: Props) => {
  return (
    <Button
      className={className}
      onClick={() => {
        signOut()
      }}
    >
      {text}
    </Button>
  )
}

export default SignOutButton
