'use client'

import { useState } from 'react'

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

  const handleReport = () => {
    console.log('Reporting poem:', { poemId, reportType, reason })
    // TODO: Implement API call to submit report
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl! overflow-auto px-4 md:px-8" aria-describedby={undefined}>
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
              <label className="text-sm font-medium">Reporting Reason:</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please provide details about why you're reporting this content..."
                className="w-full min-h-32 md:min-h-48 p-3 border border-gray-300 rounded-md"
              />
            </div>

            {/* Report Button */}
            <Button
              onClick={handleReport}
              className="w-full bg-black text-white hover:bg-gray-800"
            >
              Report
            </Button>

            {/* Community Guidelines */}
            <div className="space-y-2 bg-gray-50 p-3 rounded-md">
              <p className="text-sm font-semibold">Community Guidelines:</p>
              <ul className="text-sm space-y-1 list-decimal list-inside">
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
