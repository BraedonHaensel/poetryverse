'use client'

import { useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Button } from './ui/button'

type Props = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  poemId: string
  poemBody: string
}

export function PoemInterpretDialog({
  isOpen,
  onOpenChange,
  poemId,
  poemBody,
}: Props) {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const MIN_CHARS = 70

  const handleInterpret = async () => {
    if (prompt.length < MIN_CHARS) {
      setError(`Prompt must be at least ${MIN_CHARS} characters`)
      return
    }

    setIsLoading(true)
    setError('')
    try {
      console.log('Interpreting poem:', { poemId, prompt, poemBody })
      // TODO: Implement API call to get interpretation
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
              className={`w-full min-h-32 p-3 border rounded-md ${
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
