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
  poemBody: string
}

const LANGUAGES = [
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Russian',
  'Japanese',
  'Chinese',
  'Korean',
  'Arabic',
]

export function PoemTranslateDialog({
  isOpen,
  onOpenChange,
  poemId,
  poemBody,
}: Props) {
  const [targetLanguage, setTargetLanguage] = useState('French')
  const [translation, setTranslation] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleTranslate = async () => {
    setIsLoading(true)
    try {
      console.log('Translating poem:', { poemId, targetLanguage, poemBody })
      // TODO: Implement API call to get translation
      // For now, showing placeholder
      setTranslation(
        `Translation to ${targetLanguage} will appear here...\n\n[Translated text pending]`
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl! overflow-auto px-4 md:px-8"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>Translation</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Translate To */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Translate To:</label>
            <Select value={targetLanguage} onValueChange={setTargetLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Translation Result */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Translation Result:</label>
            <textarea
              value={translation}
              readOnly
              placeholder="Translation will appear here..."
              className="w-full min-h-32 p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
            />
          </div>

          {/* Translate Button */}
          <Button
            onClick={handleTranslate}
            disabled={isLoading}
            className="w-full bg-black text-white hover:bg-gray-800"
          >
            {isLoading ? 'Translating...' : 'Translate'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
