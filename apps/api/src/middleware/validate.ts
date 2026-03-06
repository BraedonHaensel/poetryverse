import type { NextFunction, Request, Response } from 'express';
import { ZodType } from "zod";

/**
 * Returns middleware that validates request input with a provided Zod schema.
 * This is currently a no-op placeholder until schema parsing is implemented.
 */
export const validate = 
    (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
        //TODO: Implement validation with zod schemas
        next();
    }
