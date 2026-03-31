import { ResolutionType } from '@prisma/client'
import { z } from 'zod'

export const resolveReportRequestSchema = z.object({
  body: {
    resolutionType: z.enum(ResolutionType).optional(),
    adminNote: z.string().optional(),
  },
})
