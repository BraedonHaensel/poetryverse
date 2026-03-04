import { Router } from "express";
import { prisma } from '../lib/db';

const router = Router()

router.get('/api/users', async (_req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

export default router;