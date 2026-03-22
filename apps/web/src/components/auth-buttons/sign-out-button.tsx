'use client'
import { signOut } from 'next-auth/react'

import { cn } from '@/lib/utils'

import { Button } from '../ui/button'

type Props = { text: string; className?: string }

const SignOutButton = ({ text, className = '' }: Props) => {
  return (
    <Button
      className={cn('cursor-pointer', className)}
      onClick={() => {
        signOut()
      }}
    >
      {text}
    </Button>
  )
}

export default SignOutButton
