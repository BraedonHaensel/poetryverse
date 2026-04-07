'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { useAdminUser } from '@/context/admin-user-context'

export default function AdminNavbar() {
  const { role } = useAdminUser()

  return (
    <>
      {/* Mobile */}
      <header className="border-b-2 border-black/30 bg-white md:hidden">
        <div className="flex h-16 items-center justify-between gap-2 px-3 min-[380px]:gap-4 min-[380px]:px-4">
          <h1 className="min-w-0 truncate text-xl font-extrabold min-[380px]:text-2xl">
            PoetryVerse
          </h1>

          <Button
            asChild
            className="h-auto shrink-0 rounded-xl px-2.5 py-1.5 text-xs font-semibold min-[380px]:px-4 min-[380px]:py-2 min-[380px]:text-sm"
          >
            <Link href="/">Exit Admin Mode</Link>
          </Button>
        </div>
      </header>

      {/* Desktop */}
      <header className="hidden w-full border-b-2 border-black/10 bg-white md:block">
        <div className="mx-auto flex h-16 items-center justify-between px-8">
          <Link href="/" className="flex items-center gap-4" aria-label="Home">
            <Image
              src="/feather-logo.svg"
              alt="PoetryVerse logo"
              width={30}
              height={30}
            />
            <span className="text-2xl font-extrabold">PoetryVerse</span>
          </Link>

          <div className="flex items-center gap-6">
            {role === 'SUPER_ADMIN' && (
              <span className="font-bold text-black/80">Super Admin</span>
            )}
            <Button asChild>
              <Link href="/">Exit Admin Mode</Link>
            </Button>
          </div>
        </div>
      </header>
    </>
  )
}
