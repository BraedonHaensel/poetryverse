'use client'

import { Feather } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminNavbar() {
  const router = useRouter()

  return (
    <header className="w-full border-b border-black/10 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* TODO: Check if the name needs to be a link */}
        <Link href="/" className="flex items-center gap-3">
            <Feather size={22} strokeWidth={2} className="text-black" />
            <span className="text-xl font-semibold">PoetryVerse</span>
        </Link>

        <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-black/80">
                Super Admin
            </span>
            <button
                onClick={() => router.push('/')}
                className="rounded-lg bg-black px-4 py-2 text-white font-medium hover:bg-black/90"
            >
                Exit Admin Mode
            </button>
        </div>
      </div>
    </header>
  )
}