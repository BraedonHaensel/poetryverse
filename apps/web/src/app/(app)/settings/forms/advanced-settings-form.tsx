'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

import { ConfirmationDialog } from '@/components/confirmation-dialog'
import { ShadowCard } from '@/components/shadow-card'
import { Button } from '@/components/ui/button'
import { CardContent, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

type Props = {
  onDeleteAccount: () => Promise<void>
}

/**
 * Advanced settings form.
 */
export function AdvancedSettingsForm({ onDeleteAccount }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isDeleteConfrimOpen, setIsDeleteConfirmOpen] = useState<boolean>(false)

  return (
    <>
      <ConfirmationDialog
        isOpen={isDeleteConfrimOpen}
        title="Are you sure you want to delete your account?"
        description="This action cannot be undone."
        onClose={() => setIsDeleteConfirmOpen(false)}
        onAction={onDeleteAccount}
        variant="delete"
      />
      <ShadowCard className="gap-4 p-3">
        <CardHeader
          className="hover:text-muted-foreground flex items-center justify-between px-0 hover:cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <Label className="hover:cursor-pointer">Advanced Settings</Label>
          <ChevronDown
            className={`hover:text-muted-foreground ml-auto ${isOpen ? 'rotate-180' : ''}`}
          />
        </CardHeader>

        {isOpen && (
          <CardContent className="flex flex-col gap-2 px-0">
            <Button
              className="cursor-pointer"
              variant="destructive"
              onClick={() => setIsDeleteConfirmOpen(true)}
            >
              Delete Account
            </Button>
          </CardContent>
        )}
      </ShadowCard>
    </>
  )
}
