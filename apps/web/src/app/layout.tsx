import './globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'

import Providers from '@/components/providers'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'PoetryVerse',
  description:
    'SENG513 Application - PoetryVerse is a platform for sharing and discovering poetry!',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        {/* Toaster is a notification handler */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            classNames: {
              success: '!bg-green-300 !border-green-300',
              warning: '!bg-amber-300 !border-amber-300',
              error: '!bg-red-300 !border-red-300',
            },
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
