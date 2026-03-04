"use client"
import { SessionProvider } from 'next-auth/react'
import React from 'react'

type Props = {}

function Provider(children: React.ReactNode) {
  return (
    <SessionProvider>{children}</SessionProvider>
  )
}

export default Provider