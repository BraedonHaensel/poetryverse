'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

type Props = {
  isActive: boolean
}

/**
 * Dropdown for the Create link in the navigation bar.
 * @param isActive Whether the Create page is open.
 */
export default function CreateDropdown({ isActive }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Create navbar button */}
        <Link
          href={'#'}
          className={`relative pb-1 font-medium text-black ${
            isActive ? 'font-semibold' : 'opacity-90'
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          Create
          {isActive && (
            <span className="absolute -bottom-0.5 left-0 h-0.5 w-full rounded bg-black" />
          )}
        </Link>
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <>
          {/* Screen overlay */}
          <div className="fixed inset-0 z-10 bg-black/30"></div>

          {/* Dropdown options */}
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link className="hover:bg-gray-400" href={'/create/from-scratch'}>
                <div className="flex items-center justify-center gap-3 text-[16px] font-bold">
                  <Image src="/stylus-icon.svg" alt="" width={30} height={30} />
                  Create From Scratch
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link className="hover:bg-gray-400" href={'/create/with-ai'}>
                <div className="flex items-center justify-center gap-3 text-[16px] font-bold">
                  <Image src="/robot-icon.svg" alt="" width={30} height={30} />
                  Create With AI
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </>
      </DropdownMenuPortal>
    </DropdownMenu>
  )
}
