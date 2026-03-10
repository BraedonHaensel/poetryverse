'use client'

import { useState } from 'react'

import { ShadowCard } from '@/components/shadow-card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type Props = {
  email: string
}

/**
 * Email form.
 */
export function EmailForm({ email }: Props) {
  const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false)

  return (
    <ShadowCard className="gap-2 p-3">
      <Label>Email</Label>
      <Tooltip open={isTooltipOpen}>
        <TooltipTrigger>
          <Input
            className="bg-off-white border-2"
            value={email}
            readOnly
            onFocus={() => setIsTooltipOpen(true)}
            onBlur={() => setIsTooltipOpen(false)}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>Email can&apos;t be changed.</p>
        </TooltipContent>
      </Tooltip>
    </ShadowCard>
  )
}
