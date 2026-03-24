import { redirect } from 'next/navigation'

import { ConfirmationDialog } from './confirmation-dialog'

type Props = {
  isOpen: boolean
  onClose: () => void
}

/**
 * Sign in required dialog. Visibility is handled externally.
 * @param isOpen Whether the dialog is open.
 * @param onClose Callback to handle closing the dialog.
 */
export default function SignInRequiredDialog({ isOpen, onClose }: Props) {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      title="You must sign in to use this feature."
      description="Continue to the Google Sign In page?"
      continueButtonText="Sign In"
      onClose={onClose}
      // On continue, redirect to the login page
      onAction={() => redirect('/')}
    />
  )
}
