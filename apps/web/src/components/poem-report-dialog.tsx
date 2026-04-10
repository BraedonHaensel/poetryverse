'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import { reportPoem } from '@/lib/poem-requests'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Button } from './ui/button'

type Props = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  poemId: string
}

const REPORT_TYPES = [
  'Inappropriate Content',
  'Copyright Violation',
  'Spam',
  'Hateful or Abusive',
  'Other',
]

const COMMUNITY_GUIDELINES = [
  'Use of inappropriate language is prohibited. This includes the use of curse words, offensive language, and threats to other users, organizations, and entities.',
  'Use of AI on Human written Poems are not prohibited. All AI usage based poems must have a tag exhibiting use of AI.',
]

export function PoemReportDialog({ isOpen, onOpenChange, poemId }: Props) {
  const [reportType, setReportType] = useState('Inappropriate Content')
  const [reason, setReason] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleReport = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for your report')
      return
    }

    if (reason.length < 10) {
      toast.error('Report reason must be at least 10 characters')
      return
    }

    if (reason.length > 500) {
      toast.error('Report reason must not exceed 500 characters')
      return
    }

    setIsLoading(true)
    const success = await reportPoem(poemId, reportType, reason)
    setIsLoading(false)

    if (success) {
      toast.success(
        'Thank you for reporting this content. We will review it shortly.'
      )
      setReason('')
      setReportType('Inappropriate Content')
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl! overflow-auto px-4 md:px-8"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>Report Submission</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Report Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Report Type</label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REPORT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reporting Reason */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Reporting Reason:</label>
              <span
                className={`text-xs ${reason.length > 500 ? 'text-red-500' : 'text-gray-500'}`}
              >
                {reason.length}/500
              </span>
            </div>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, 500))}
              disabled={isLoading}
              placeholder="Please provide details about why you're reporting this content... (10-500 characters)"
              className="min-h-32 w-full rounded-md border border-gray-300 p-3 disabled:opacity-50 md:min-h-48"
            />
          </div>

          {/* Report Button */}
          <Button
            onClick={handleReport}
            disabled={isLoading || reason.length < 10}
            className="w-full bg-black text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {isLoading ? 'Submitting...' : 'Report'}
          </Button>

          {/* Community Guidelines */}
          <div className="space-y-2 rounded-md bg-gray-50 p-3">
            <p className="text-sm font-semibold">Community Guidelines:</p>
            <ul className="list-inside list-decimal space-y-1 text-sm">
              {COMMUNITY_GUIDELINES.map((guideline, index) => (
                <li key={index} className="text-gray-700">
                  {guideline}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
