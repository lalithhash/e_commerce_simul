import express from 'express';
import prisma from '../lib/prisma';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';

const router = express.Router();
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => Promise.resolve(fn(req, res, next)).catch(next);

// GET all products with filtering, sorting, pagination
router.get('/', asyncHandler(async (req: any, res: any) => {
  const { category, search, sort, page = 1, limit = 12, minPrice, maxPrice, minRating } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where: any = {};
  
  if (category) {
    where.category = { slug: String(category) };
  }
  
  if (search) {
    where.name = { contains: String(search), mode: 'insensitive' };
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  }

  if (minRating) {
    where.rating = { gte: Number(minRating) };
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  if (sort === 'price_desc') orderBy = { price: 'desc' };
  if (sort === 'rating') orderBy = { rating: 'desc' };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: Number(limit),
      include: { category: true },
    }),
    prisma.product.count({ where }),
  ]);

  res.json({
    success: true,
    data: products,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
}));

// GET single product by ID or Slug
router.get('/:idOrSlug', asyncHandler(async (req: any, res: any) => {
  const { idOrSlug } = req.params;
  
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id: idOrSlug },
        { slug: idOrSlug }
      ]
    },
    include: {
      category: true,
      reviews: {
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  res.json({ success: true, data: product });
}));

// ADMIN: Create Product
router.post('/', authenticate, requireAdmin, asyncHandler(async (req: any, res: any) => {
  const data = req.body;
  
  if (!data.images) {
    data.images = [];
  }

  if (!data.slug) {
    data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }

  const product = await prisma.product.create({ data });
  
  res.status(201).json({ success: true, data: product });
}));

// ADMIN: Update Product
router.put('/:id', authenticate, requireAdmin, asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;
  const data = req.body;

  const product = await prisma.product.update({
    where: { id },
    data
  });
  
  res.json({ success: true, data: product });
}));

// ADMIN: Delete Product
router.delete('/:id', authenticate, requireAdmin, asyncHandler(async (req: any, res: any) => {
  await prisma.product.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Product deleted' });
}));

export default router;
