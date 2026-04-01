import { ResolutionType } from '@prisma/client'
import { z } from 'zod'

export const getReportByIdRequestSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/),
  }),
})

export const resolveReportRequestSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/),
  }),
  body: z.object({
    resolutionType: z.enum(ResolutionType),
    adminNote: z.string().optional(),
  }),
})

export type getReportByIdRequest = z.infer<
  typeof getReportByIdRequestSchema
>['params']
export type resolveReportRequestParams = z.infer<
  typeof resolveReportRequestSchema
>['params']
export type resolveReportRequest = z.infer<
  typeof resolveReportRequestSchema
>['body']
