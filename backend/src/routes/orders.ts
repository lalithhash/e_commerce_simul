import express from 'express';
import prisma from '../lib/prisma';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';

const router = express.Router();
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => Promise.resolve(fn(req, res, next)).catch(next);

router.use(authenticate);

// GET user's orders
router.get('/', asyncHandler(async (req: any, res: any) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: {
              select: { name: true, images: true, slug: true }
          }
        }
      }
    }
  });

  res.json({ success: true, data: orders });
}));

// PLACE new order
router.post('/', asyncHandler(async (req: any, res: any) => {
  const { address } = req.body;
  const userId = req.user.id;

  if (!address) return res.status(400).json({ success: false, message: 'Address is required' });

  // Get cart
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true }
  });

  if (cartItems.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is empty' });
  }

  // Calculate total
  let total = 0;
  for (const item of cartItems) {
    total += item.product.price * item.quantity;
    if (item.product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Not enough stock for ${item.product.name}`});
    }
  }

  // Apply GST and Shipping for demo
  const tax = total * 0.18;
  const shipping = total > 500 ? 0 : 99;
  const finalTotal = total + tax + shipping;

  // Run in transaction
  const order = await prisma.$transaction(async (tx: any) => {
    // 1. Create Order
    const newOrder = await tx.order.create({
      data: {
        userId,
        total: finalTotal,
        address,
        items: {
          create: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
      }
    });

    // 2. Decrement Stock
    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      });
    }

    // 3. Clear Cart
    await tx.cartItem.deleteMany({ where: { userId } });

    return newOrder;
  });

  res.status(201).json({ success: true, data: order });
}));

// ADMIN: Get all orders
router.get('/all', requireAdmin, asyncHandler(async (req: any, res: any) => {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      items: {
          include: { product: { select: { name: true, images: true } } }
      }
    }
  });

  res.json({ success: true, data: orders });
}));

// ADMIN: Update order status
router.patch('/:id/status', requireAdmin, asyncHandler(async (req: any, res: any) => {
  const { status } = req.body;
  const validStatuses = ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: { status }
  });

  res.json({ success: true, data: order });
}));

export default router;
