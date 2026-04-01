import { Request, Response } from 'express'

import { prisma } from '../lib/db'
import { notFound } from '../lib/http-errors'
import { AuthRequest } from '../middleware/auth'
import { getReportByIdRequest } from '../schemas/report-schemas'

const REPORT_INCLUDE_STATEMENT = {
  poem: {
    select: {
      title: true,
      body: true,
    },
  },
}

/**
 * Retrieves all poem reports.
 * @param _req Incoming Express request (unused).
 * @param res Express response object.
 * @returns A 200 response containing the list of reports.
 */
export const getReports = async (_req: Request, res: Response) => {
  const reports = await prisma.report.findMany()

  return res.status(200).json({ data: reports })
}

export const getReportById = async (req: Request, res: Response) => {
  const id = parseInt((req.params as getReportByIdRequest).id)

  const report = await getAndValidateReport(id)

  return res.status(200).json({ data: report })
}

const getAndValidateReport = async (id: number) => {
  const report = await prisma.report.findUnique({
    where: { id: id },
    include: REPORT_INCLUDE_STATEMENT,
  })

  if (!report) {
    throw notFound('Report not found')
  }

  return report
}
