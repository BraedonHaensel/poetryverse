import { Prisma, ReportStatus, ResolutionType } from '@prisma/client'
import { Request, Response } from 'express'

import { prisma } from '../lib/db'
import { conflict, notFound } from '../lib/http-errors'
import { AuthRequest } from '../middleware/auth'
import {
  getReportByIdRequest,
  resolveReportRequest,
  resolveReportRequestParams,
} from '../schemas/report-schemas'

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
  const reports = await prisma.report.findMany({
    where: { status: ReportStatus.OPEN },
    include: REPORT_INCLUDE_STATEMENT,
  })

  return res.status(200).json({ data: reports })
}

/**
 * Retrieves a single report by ID.
 * @param req Express request containing a validated report id param.
 * @param res Express response object.
 * @returns A 200 response containing the requested report.
 * @throws {HttpError} 404 if the report does not exist.
 */
export const getReportById = async (req: Request, res: Response) => {
  const id = parseInt((req.params as getReportByIdRequest).id)

  const report = await getAndValidateReport(id)

  return res.status(200).json({ data: report })
}

/**
 * Resolves an open report.
 * @param req Authenticated Express request with validated report id and resolution payload.
 * @param res Express response object.
 * @returns A 200 response with the resolved report, or 204 when the poem is removed.
 * @throws {HttpError} 404 if the report does not exist.
 * @throws {HttpError} 409 if the report has already been resolved.
 */
export const resolveReport = async (req: AuthRequest, res: Response) => {
  const userId = req.auth.userId
  const reportId = parseInt((req.params as resolveReportRequestParams).id)
  const resolveData = req.body as resolveReportRequest

  const existingReport = await getAndValidateReport(reportId)

  // Can't resolve a report that's already resolved.
  if (existingReport.status === ReportStatus.RESOLVED) {
    throw conflict('Report has already been resolved')
  }

  // Admin selected to remove the poem.
  if (resolveData.resolutionType === ResolutionType.REMOVE) {
    await prisma.poem.delete({
      where: { id: existingReport.poemId },
    })
    // Send empty success, as report will be deleted as well.
    return res.status(204).send()
  }

  // Admin decided that poem was likely AI generated, and should be tagged as such.
  if (resolveData.resolutionType === ResolutionType.UPDATE_AI_TAG) {
    await prisma.poem.update({
      where: { id: existingReport.poemId },
      data: { isAIAssisted: true },
    })
  }

  const resolveDataForPrisma: Prisma.ReportUncheckedUpdateInput = {
    resolution: resolveData.resolutionType,
    adminNote: resolveData.adminNote,
    resolvedByUserId: userId,
    status: ReportStatus.RESOLVED,
    resolvedAt: new Date(),
  }

  const resolvedReport = await prisma.report.update({
    where: { id: reportId },
    data: resolveDataForPrisma,
    include: REPORT_INCLUDE_STATEMENT,
  })

  return res.status(200).json({ data: resolvedReport })
}

/** Retrieves and validates a report with a given id from the database. */
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
