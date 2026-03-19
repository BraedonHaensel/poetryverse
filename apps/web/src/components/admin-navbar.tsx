'use client'

import { Feather } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'

export default function AdminNavbar() {
  const router = useRouter()

  return (
    <header className="w-full border-b border-black/10 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-4">
          <Feather size={22} strokeWidth={2} className="text-black" />
          <span className="pb-1.5 text-2xl font-bold">PoetryVerse</span>
        </Link>

        <div className="flex items-center gap-6">
          <span className="font-bold text-black/80">Super Admin</span>
          <Button onClick={() => router.push('/')}>Exit Admin Mode</Button>
        </div>
      </div>
    </header>
  )
}
