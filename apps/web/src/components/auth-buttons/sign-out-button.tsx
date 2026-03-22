'use client'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

import { cn } from '@/lib/utils'

import { Button } from '../ui/button'

type Props = { text?: string; className?: string }

const SignOutButton = ({ text = 'Sign Out', className = '' }: Props) => {
  const router = useRouter()

  return (
    <Button
      className={cn('cursor-pointer', className)}
      onClick={async () => {
        await signOut()
        router.push('/')
      }}
    >
      {text}
    </Button>
  )
}

export default SignOutButton
