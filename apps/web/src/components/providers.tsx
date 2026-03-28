'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import React from 'react'

import PageLoadingIndicator from './page-loading-indicator'
import { TooltipProvider } from './ui/tooltip'

type SessionLoaderProps = {
  children: React.ReactNode
}

/**
 * Render a loading indicator until the session has been loaded.
 */
function SessionLoader({ children }: SessionLoaderProps) {
  const { status } = useSession()

  if (status === 'loading') return <PageLoadingIndicator />

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
