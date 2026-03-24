'use client'

import { LoaderCircle } from 'lucide-react'
import { SessionProvider, useSession } from 'next-auth/react'
import React from 'react'

import { TooltipProvider } from './ui/tooltip'

type SessionLoaderProps = {
  children: React.ReactNode
}

/**
 * Render a loading indicator until the session has been loaded.
 */
function SessionLoader({ children }: SessionLoaderProps) {
  const { status } = useSession()

  if (status === 'loading') {
    return <LoaderCircle className="mx-auto mt-5 h-10 w-10 animate-spin" />
  }

  // Session loaded, display the page contents
  return <>{children}</>
}

type Props = {
  children: React.ReactNode
}

function Provider({ children }: Props) {
  return (
    <SessionProvider>
      <SessionLoader>
        <TooltipProvider>{children}</TooltipProvider>
      </SessionLoader>
    </SessionProvider>
  )
}

export default Provider
