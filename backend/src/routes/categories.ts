import express from 'express';
import prisma from '../lib/prisma';

const router = express.Router();
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => Promise.resolve(fn(req, res, next)).catch(next);

// GET all categories with product count
router.get('/', asyncHandler(async (req: any, res: any) => {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  res.json({
    success: true,
    data: categories
  });
}));

export default router;
