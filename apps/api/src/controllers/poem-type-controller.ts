import { Request, Response } from 'express'

import { prisma } from '../lib/db'

/**
 * Retrieves all available poem types.
 * @param _req Incoming Express request (unused).
 * @param res Express response object.
 * @returns A 200 response containing the list of poem types.
 */
export const getPoemTypes = async (_req: Request, res: Response) => {
  const types = await prisma.poemType.findMany()

  return res.status(200).json({ data: types })
}
