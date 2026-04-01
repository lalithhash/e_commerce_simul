import express from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => Promise.resolve(fn(req, res, next)).catch(next);

router.use(authenticate);

// Profile
router.get('/me', asyncHandler(async (req: any, res: any) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, image: true, role: true, createdAt: true }
  });

  res.json({ success: true, data: user });
}));

// Update profile
router.put('/me', asyncHandler(async (req: any, res: any) => {
  const { name, image } = req.body;
  
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { name, image },
    select: { id: true, name: true, email: true, image: true, role: true }
  });

  res.json({ success: true, data: user });
}));

export default router;
