'use client'

import { Feather } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { useAdminUser } from '@/context/admin-user-context'

export default function AdminNavbar() {
  const { role } = useAdminUser()

  return (
    <header className="w-full border-b border-black/10 bg-white">
      <div className="mx-auto flex h-16 items-center justify-between px-8">
        <Link href="/" className="flex items-center gap-4">
          <Feather size={22} strokeWidth={2} className="text-black" />
          <span className="pb-1.5 text-2xl font-bold">PoetryVerse</span>
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
  )
}
