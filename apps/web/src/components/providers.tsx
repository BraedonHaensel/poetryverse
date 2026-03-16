'use client'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

import { TooltipProvider } from './ui/tooltip'

type Props = {
  children: React.ReactNode
}

function Provider({ children }: Props) {
  return (
    <SessionProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </SessionProvider>
  )
}

export default Provider
