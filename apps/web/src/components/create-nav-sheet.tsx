'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Sheet } from 'react-modal-sheet'

import { Separator } from './ui/separator'

type Props = {
  children: React.ReactNode
}

/**
 * Bottom slider for the Create link in the mobile navigation bar.
 */
export default function CreateSheet({ children }: Props) {
  const [isOpen, setOpen] = useState(false)

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>

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
