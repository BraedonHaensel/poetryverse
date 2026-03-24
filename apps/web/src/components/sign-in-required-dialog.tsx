import { signIn } from 'next-auth/react'
import { toast } from 'sonner'

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
      onAction={() =>
        // Sign in with a Google account using NextAuth.js
        signIn('google').catch((error) => {
          console.log(error)
          toast.error(error)
        })
      }
    />
  )
}
