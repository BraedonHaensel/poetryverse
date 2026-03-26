import { Request, Response } from 'express'

import { prisma } from '../lib/db'

export const getReports = async (_req: Request, res: Response) => {
  const reports = await prisma.report.findMany()

  return res.status(200).json({ data: reports })
}
