import { algoliasearch } from 'algoliasearch';
import prisma from './prisma';

const APP_ID = process.env.ALGOLIA_APP_ID || '';
const WRITE_KEY = process.env.ALGOLIA_WRITE_API_KEY || '';
export const INDEX_NAME = process.env.ALGOLIA_INDEX_NAME || 'products';

// Only instantiate client if credentials are present
const client = APP_ID && WRITE_KEY ? algoliasearch(APP_ID, WRITE_KEY) : null;

export interface AlgoliaProduct {
  objectID: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  rating: number;
  reviewCount: number;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  createdAt: number; // Unix timestamp for sorting
}

function toAlgoliaRecord(product: any): AlgoliaProduct {
  return {
    objectID: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    stock: product.stock,
    images: product.images || [],
    rating: product.rating,
    reviewCount: product.reviewCount,
    categoryId: product.categoryId,
    categoryName: product.category?.name || '',
    categorySlug: product.category?.slug || '',
    createdAt: new Date(product.createdAt).getTime(),
  };
}

/** Sync all products into Algolia — called on server startup */
export async function syncAllProducts(): Promise<void> {
  if (!client) {
    console.log('[Algolia] Skipped: ALGOLIA_APP_ID or ALGOLIA_WRITE_API_KEY not set');
    return;
  }

  try {
    const products = await prisma.product.findMany({ include: { category: true } });
    const records = products.map(toAlgoliaRecord);

    await client.saveObjects({ indexName: INDEX_NAME, objects: records as unknown as Record<string, unknown>[] });
    console.log(`[Algolia] Synced ${records.length} products to index "${INDEX_NAME}"`);

    // Configure searchable attributes and ranking once
    await client.setSettings({
      indexName: INDEX_NAME,
      indexSettings: {
        searchableAttributes: ['name', 'description', 'categoryName'],
        attributesForFaceting: ['categorySlug', 'categoryName'],
        customRanking: ['desc(rating)', 'desc(reviewCount)'],
        attributesToRetrieve: [
          'objectID', 'name', 'slug', 'price', 'images',
          'rating', 'reviewCount', 'categoryName', 'categorySlug', 'stock',
        ],
        hitsPerPage: 12,
      },
    });
    console.log('[Algolia] Index settings configured');
  } catch (err) {
    console.error('[Algolia] Sync failed:', err);
  }
}

/** Save / update a single product in Algolia */
export async function saveProductToAlgolia(product: any): Promise<void> {
  if (!client) return;
  try {
    const record = toAlgoliaRecord(product);
    await client.saveObject({ indexName: INDEX_NAME, body: record as unknown as Record<string, unknown> });
  } catch (err) {
    console.error('[Algolia] Failed to save product:', err);
  }
}

/** Remove a product from Algolia by id */
export async function deleteProductFromAlgolia(id: string): Promise<void> {
  if (!client) return;
  try {
    await client.deleteObject({ indexName: INDEX_NAME, objectID: id });
  } catch (err) {
    console.error('[Algolia] Failed to delete product:', err);
  }
}
