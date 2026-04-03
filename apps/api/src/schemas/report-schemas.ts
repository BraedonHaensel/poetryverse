import { ResolutionType } from '@prisma/client'
import { z } from 'zod'

/** Validates `GET /api/reports/:id` route params. */
export const getReportByIdRequestSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/),
  }),
})

/** Validates `PATCH /api/reports/:id` request params and body. */
export const resolveReportRequestSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/),
  }),
  body: z.object({
    resolutionType: z.enum(ResolutionType),
    adminNote: z.string().optional(),
  }),
})

/** Route params type for `getReportByIdRequestSchema`. */
export type getReportByIdRequest = z.infer<
  typeof getReportByIdRequestSchema
>['params']

/** Route params type for `resolveReportRequestSchema`. */
export type resolveReportRequestParams = z.infer<
  typeof resolveReportRequestSchema
>['params']

/** Request body type for `resolveReportRequestSchema`. */
export type resolveReportRequest = z.infer<
  typeof resolveReportRequestSchema
>['body']
