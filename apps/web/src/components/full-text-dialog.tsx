'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type FullTextDialogProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  content: string
}

export function FullTextDialog({
  isOpen,
  onOpenChange,
  title = 'Full poem',
  content,
}: FullTextDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl overflow-auto px-4 md:px-8"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
        </DialogHeader>

        <div className="bg-off-white max-h-[60vh] overflow-y-auto rounded-lg border p-4">
          <p className="leading-relaxed wrap-break-word whitespace-pre-wrap md:text-lg">
            {content}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
