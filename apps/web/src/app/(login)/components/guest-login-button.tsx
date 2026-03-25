'use client'

import { UserRound } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
}

/**
 * Button for logging in as a guest user.
 */
export default function GuestLoginButton({ className = '' }: Props) {
  return (
    <Button
      className={cn('border-2 border-black py-6 text-lg', className)}
      variant={'outline'}
      asChild
    >
      <Link href="/home">
        <UserRound />
        Continue as Guest
      </Link>
    </Button>
  )
}
