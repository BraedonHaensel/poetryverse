'use client'

import { LoaderCircle } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { FaGoogle } from 'react-icons/fa'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
}

/**
 * Button for logging in with a Google account using NextAuth.js.
 */
export default function GoogleLoginButton({ className = '' }: Props) {
  const [isLoading, setLoading] = useState(false)

  // Launch the Google login page using NextAuth.js
  const handleLogin = async () => {
    setLoading(true)
    signIn('google').catch((error) => {
      console.log(error)
      toast.error(error)
      setLoading(false)
    })
  }

  return (
    <Button
      className={cn('cursor-pointer py-6', className)}
      disabled={isLoading}
      onClick={handleLogin}
    >
      {isLoading ? (
        <LoaderCircle className="animate-spin" />
      ) : (
        <>
          <FaGoogle />
          <span>Continue with Google</span>
        </>
      )}
    </Button>
  )
}
