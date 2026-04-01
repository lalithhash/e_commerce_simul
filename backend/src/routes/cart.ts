import express from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => Promise.resolve(fn(req, res, next)).catch(next);

router.use(authenticate);

// GET user's cart
router.get('/', asyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          id: true, name: true, price: true, slug: true, images: true, stock: true
        }
      }
    }
  });

  res.json({ success: true, data: items });
}));

// ADD item to cart
router.post('/', asyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;
  const { productId, quantity = 1 } = req.body;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  if (product.stock < quantity) return res.status(400).json({ success: false, message: 'Not enough stock' });

  // upsert
  const cartItem = await prisma.cartItem.upsert({
    where: {
      userId_productId: { userId, productId }
    },
    update: {
      quantity: { increment: quantity }
    },
    create: {
      userId,
      productId,
      quantity
    },
    include: { product: true }
  });

  res.status(201).json({ success: true, data: cartItem });
}));

// UPDATE cart item quantity
router.put('/:id', asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;
  const { quantity } = req.body;

  const item = await prisma.cartItem.findUnique({ where: { id }, include: { product: true } });
  if (!item || item.userId !== req.user.id) {
    return res.status(404).json({ success: false, message: 'Cart item not found' });
  }

  if (item.product.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Not enough stock' });
  }

  const updatedItem = await prisma.cartItem.update({
    where: { id },
    data: { quantity },
    include: { product: true }
  });

  res.json({ success: true, data: updatedItem });
}));

// REMOVE cart item
router.delete('/:id', asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;
  
  const item = await prisma.cartItem.findUnique({ where: { id } });
  if (item && item.userId === req.user.id) {
    await prisma.cartItem.delete({ where: { id } });
  }

  res.json({ success: true, message: 'Item removed from cart' });
}));

// CLEAR cart
router.delete('/', asyncHandler(async (req: any, res: any) => {
  await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });
  res.json({ success: true, message: 'Cart cleared' });
}));

export default router;
