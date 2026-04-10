'use client'

import type { AxiosError } from 'axios'
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
import { api, displayApiError } from '@/lib/api'

import { Button } from './ui/button'

type Props = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  poemId: string
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
}: Props) {
  const [targetLanguage, setTargetLanguage] = useState('French')
  const [translation, setTranslation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const handleTranslate = async () => {
    setIsLoading(true)
    try {
      const response = await api.post('/api/poems/translate', {
        poemId,
        targetLanguage,
      })
      setTranslation(response.data.data.translation)
      setHasSubmitted(true)
    } catch (error) {
      displayApiError(error as AxiosError<unknown>, 'Failed to translate poem')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl! overflow-auto px-4 md:px-8" aria-describedby={undefined}>
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
            {hasSubmitted ? (
              <textarea
                value={translation}
                readOnly
                placeholder="Translation will appear here..."
                className="w-full min-h-32 md:min-h-48 p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
              />
            ) : (
              <div className="w-full min-h-32 md:min-h-48 p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-400 flex items-center justify-center">
                Translation will appear here after translating
              </div>
            )}
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
