import dotenv from "dotenv";
dotenv.config();

import { Router } from 'express'
import { Request,Response } from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'

const router = Router()


// An example:
// router.get('/', getPoems);

export default router
