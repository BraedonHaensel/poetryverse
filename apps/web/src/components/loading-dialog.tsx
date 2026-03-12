import { LoaderCircle } from 'lucide-react'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'

type Props = {
  message: string
  isOpen: boolean
}

/**
 * Dialog that covers the screen and displays a loading circle.
 * @param message Message to dispaly above the loading circle.
 * @param isOpen Whether the dialog is open.
 */
export function LoadingDialog({ message, isOpen }: Props) {
  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="w-fit justify-center"
        showCloseButton={false}
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-base font-semibold sm:text-xl">
            {message}
          </DialogTitle>
        </DialogHeader>
        <LoaderCircle className="mx-auto animate-spin" size={40} />
      </DialogContent>
    </Dialog>
  )
}
