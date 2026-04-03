'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function AdminNavbar() {
  return (
    <header className="w-full border-b-2 border-black/10 bg-white">
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
          <span className="font-bold text-black/80">Super Admin</span>
          <Button asChild>
            <Link href="/">Exit Admin Mode</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
