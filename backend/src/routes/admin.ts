import express from 'express';
import prisma from '../lib/prisma';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';

const router = express.Router();
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => Promise.resolve(fn(req, res, next)).catch(next);

router.use(authenticate, requireAdmin);

// Dashboard stats
router.get('/stats', asyncHandler(async (req: any, res: any) => {
  const [orderCount, productCount, userCount, revenueResult, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: { total: true },
    }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } }
    })
  ]);

  res.json({
    success: true,
    data: {
      totalRevenue: revenueResult._sum.total || 0,
      orderCount,
      productCount,
      userCount,
      recentOrders
    }
  });
}));

export default router;
