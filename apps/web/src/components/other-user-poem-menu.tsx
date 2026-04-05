import { EllipsisVertical } from 'lucide-react'

import { PoemData } from '@/lib/poem-requests'
import { cn } from '@/lib/utils'

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
  return (
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
          onClick={() => console.log('Translate:', poem.id)}
        >
          Translate
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => console.log('Interpret:', poem.id)}
        >
          Interpret
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-destructive cursor-pointer"
          onClick={() => console.log('Report:', poem.id)}
        >
          Report
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
