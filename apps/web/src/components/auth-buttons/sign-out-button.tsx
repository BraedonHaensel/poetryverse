'use client'
import { signOut } from 'next-auth/react'

import { Button } from '../ui/button'

type Props = { text: string }

const SignOutButton = ({ text }: Props) => {
  return (
    <Button
      onClick={() => {
        signOut()
      }}
    >
      {text}
    </Button>
  )
}

export default SignOutButton
