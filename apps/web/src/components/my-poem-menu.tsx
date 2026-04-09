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
  onSetPublic: (poem: PoemData) => void
  onSetPrivate: (poem: PoemData) => void
  onDeletePoem: (poem: PoemData) => void
}

/**
 * Ellipsis dropdown menu for viewing a user's own poems.
 * @param buttonClassName Optional additional className values to apply to the ellipsis button.
 * @param menuClassName Optional additional className values to apply to the dropdown menu.
 * @param poem The poem the menu appears on.
 * @param onSetPublic Callback to set a poem's visibility to public.
 * @param onSetPrivate Callback to set a poem's visibility to private.
 * @param onDeletePoem Callback to delete a poem.
 */
export default function MyPoemMenu({
  buttonClassName = '',
  menuClassName = '',
  poem,
  onSetPublic,
  onSetPrivate,
  onDeletePoem,
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
        {poem.isPublic ? (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onSetPrivate(poem)}
          >
            Set Private
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onSetPublic(poem)}
          >
            Set Public
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-destructive cursor-pointer"
          onClick={() => onDeletePoem(poem)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
