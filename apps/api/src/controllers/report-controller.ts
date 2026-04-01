import { Prisma, ReportStatus, ResolutionType } from '@prisma/client'
import { timeStamp } from 'console'
import { Request, Response } from 'express'

import { prisma } from '../lib/db'
import { notFound } from '../lib/http-errors'
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
  const reports = await prisma.report.findMany()

  return res.status(200).json({ data: reports })
}

export const getReportById = async (req: Request, res: Response) => {
  const id = parseInt((req.params as getReportByIdRequest).id)

  const report = await getAndValidateReport(id)

  return res.status(200).json({ data: report })
}

export const resolveReport = async (req: AuthRequest, res: Response) => {
  const userId = req.auth.userId
  const reportId = parseInt((req.params as resolveReportRequestParams).id)
  const resolveData = req.body as resolveReportRequest

  const existingReport = await getAndValidateReport(reportId)

  if (existingReport.status == ReportStatus.RESOLVED) {
    // already resolved, maybe throw
  }

  if (resolveData.resolutionType === ResolutionType.REMOVE) {
    await prisma.poem.delete({
      where: { id: existingReport.poemId },
    })
  } else if (resolveData.resolutionType === ResolutionType.UPDATE_AI_TAG) {
    await prisma.poem.update({
      where: { id: existingReport.poemId },
      data: { isAIAssisted: true },
    })
  }

  const resolveDataForPrisma = {
    ...resolveData,
    resolvedByUserId: userId,
    status: ReportStatus.RESOLVED,
    resolvedAt: Date.now(),
  } as Prisma.ReportUpdateInput

  const resolvedReport = await prisma.report.update({
    where: { id: reportId },
    data: resolveDataForPrisma,
  })

  return res.status(200).json({ data: resolvedReport })
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

const removePoem = async (id: string) => {
  await prisma.poem.delete({
    where: { id: id },
  })
}
