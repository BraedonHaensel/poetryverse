'use client'

import { LucideProps } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Sheet } from 'react-modal-sheet'

import { Separator } from './ui/separator'

type Props = {
  Icon: React.FC<LucideProps>
  isActive: boolean
}

/**
 * Bottom slider for the Create link in the mobile navigation bar.
 * @param Icon The navigation bar icon to render.
 * @param isActive Whether the Create page is open.
 */
export default function CreateSheet({ Icon, isActive }: Props) {
  const [isOpen, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`relative cursor-pointer pb-1 font-medium text-black ${
          isActive ? 'font-semibold' : 'opacity-90'
        }`}
      >
        <Icon
          className="h-12 w-12 min-[380px]:h-13 min-[380px]:w-13"
          strokeWidth={isActive ? 2.8 : 2}
        />
        {isActive && (
          <span className="absolute -bottom-0.5 left-0 h-0.5 w-full rounded bg-black/40" />
        )}
      </button>

      <Sheet detent="content" isOpen={isOpen} onClose={() => setOpen(false)}>
        <Sheet.Container onClick={() => setOpen(false)}>
          <Sheet.Header />
          <Sheet.Content>
            <div className="mb-4 flex flex-col gap-2">
              <p className="mb-2 text-center text-xl font-bold">Create Poem</p>
              <Separator className="border-t border-black" />
              <Link className="hover:opacity-70" href={'/create/from-scratch'}>
                <div className="mx-6 flex items-center gap-3 text-base font-bold">
                  <Image src="/stylus-icon.svg" alt="" width={30} height={30} />
                  Create From Scratch
                </div>
              </Link>
              <Separator className="border-t border-black" />
              <Link className="hover:opacity-70" href={'/create/with-ai'}>
                <div className="mx-6 flex items-center gap-3 text-base font-bold">
                  <Image src="/robot-icon.svg" alt="" width={30} height={30} />
                  Create With AI
                </div>
              </Link>
            </div>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onClick={() => setOpen(false)} />
      </Sheet>
    </>
  )
}
