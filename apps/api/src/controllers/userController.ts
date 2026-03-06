import { prisma } from "@seng513/database";
import type { NextFunction, Request, Response } from 'express';

/**
 * Retrieves all users from the database and returns them as JSON.
 */
export const getUsers = async (_req: Request, res: Response, _next: NextFunction) => {
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
}
