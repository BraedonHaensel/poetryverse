'use client'

import type { AxiosError } from 'axios'
import { useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { api, displayApiError } from '@/lib/api'

import { Button } from './ui/button'

type Props = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  poemId: string
}

export function PoemInterpretDialog({
  isOpen,
  onOpenChange,
  poemId,
}: Props) {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const MIN_CHARS = 20

  const handleInterpret = async () => {
    if (prompt.length < MIN_CHARS) {
      setError(`Prompt must be at least ${MIN_CHARS} characters`)
      return
    }

    setIsLoading(true)
    setError('')
    try {
      const response = await api.post('/api/poems/interpret', {
        poemId,
        prompt,
      })
      setResponse(response.data.data.interpretation)
      setHasSubmitted(true)
    } catch (error) {
      displayApiError(error as AxiosError<unknown>, 'Failed to interpret poem')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl! overflow-auto px-4 md:px-8" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Interpretation</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
            {/* Poem Interpretation Prompt */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Poem Interpretation Prompt:</label>
              <textarea
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value)
                  setError('')
                }}
                placeholder="Explain the poem's use of..."
                className={`w-full min-h-32 md:min-h-40 p-3 border rounded-md ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {error && (
                <p className="text-xs text-red-500">{error}</p>
              )}
              <p className="text-xs text-gray-500">
                {prompt.length} / {MIN_CHARS} characters
              </p>
            </div>

            {/* Interpret Button */}
            <Button
              onClick={handleInterpret}
              disabled={isLoading || prompt.length < MIN_CHARS}
              className="w-full bg-black text-white hover:bg-gray-800 disabled:bg-gray-400"
            >
              {isLoading ? 'Interpreting...' : 'Interpret'}
            </Button>

            {/* Response Display */}
            {hasSubmitted && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Interpretation Response:</label>
                <textarea
                  value={response}
                  readOnly
                  className="w-full min-h-32 md:min-h-48 p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                />
              </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
