import { Request, Response } from 'express'

import { prisma } from '../lib/db'

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
