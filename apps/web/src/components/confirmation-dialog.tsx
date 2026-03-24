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
  continueButtonText?: string
  onClose: () => void
  onAction: () => void
  variant?: 'default' | 'delete'
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
  continueButtonText = 'Continue',
  onClose,
  onAction,
  variant = 'default',
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
            variant={variant === 'delete' ? 'destructive' : 'default'}
          >
            {variant === 'delete' ? 'Delete' : continueButtonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
