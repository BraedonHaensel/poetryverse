'use client'

import { EllipsisVertical } from 'lucide-react'
import { useState } from 'react'

import { PoemData } from '@/lib/poem-requests'
import { cn } from '@/lib/utils'

import { PoemInterpretDialog } from './poem-interpret-dialog'
import { PoemReportDialog } from './poem-report-dialog'
import { PoemTranslateDialog } from './poem-translate-dialog'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

type Props = {
  buttonClassName?: string
  menuClassName?: string
  poem: PoemData
}

/**
 * Ellipsis dropdown menu for viewing poems from other users.
 * @param buttonClassName Optional additional className values to apply to the ellipsis button.
 * @param menuClassName Optional additional className values to apply to the dropdown menu.
 * @param poem The poem the menu appears on.
 */
export default function OtherUserPoemMenu({
  buttonClassName = '',
  menuClassName = '',
  poem,
}: Props) {
  const [openDialog, setOpenDialog] = useState<
    'translate' | 'interpret' | 'report' | null
  >(null)

  return (
    <>
      <DropdownMenu>
        {/* Ellipsis to open the menu */}
        <DropdownMenuTrigger asChild>
          <Button
            className={cn(
              'w-fit focus:outline-none focus-visible:ring-0',
              buttonClassName
            )}
            variant="ghost"
          >
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>

        {/* Menu contents */}
        <DropdownMenuContent className={cn('w-40', menuClassName)} align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOpenDialog('translate')}
          >
            Translate
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOpenDialog('interpret')}
          >
            Interpret
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-destructive cursor-pointer"
            onClick={() => setOpenDialog('report')}
          >
            Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PoemTranslateDialog
        isOpen={openDialog === 'translate'}
        onOpenChange={(open) => setOpenDialog(open ? 'translate' : null)}
        poemId={poem.id}
      />

      <PoemInterpretDialog
        isOpen={openDialog === 'interpret'}
        onOpenChange={(open) => setOpenDialog(open ? 'interpret' : null)}
        poemId={poem.id}
      />

      <PoemReportDialog
        isOpen={openDialog === 'report'}
        onOpenChange={(open) => setOpenDialog(open ? 'report' : null)}
        poemId={poem.id}
      />
    </>
  )
}
