import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type Props = {
  isOpen: boolean
  title: string
  description: string
  onClose: () => void
  onAction: () => void
}

/**
 * Standard confirmation dialog. Visibility is handled externally.
 * @param isOpen Whether the dialog is open.
 * @param title Title to display within the dialog.
 * @param description Description to display within the dialog.
 * @param onClose Callback to handle closing the dialog.
 * @param onAction Callback to call if the dialog is confirmed.
 */
export function ConfirmationDialog({
  isOpen,
  title,
  description,
  onClose,
  onAction,
}: Props) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title} </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="hover:cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="hover:cursor-pointer"
            onClick={onAction}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
