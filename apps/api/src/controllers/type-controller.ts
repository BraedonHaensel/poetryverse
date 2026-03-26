import { Request, Response } from 'express'

import { prisma } from '../lib/db'

export const getPoemTypes = async (_req: Request, res: Response) => {
  const types = await prisma.poemType.findMany()

  return res.status(200).json({ data: types })
}
