import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAddToCart } from '@/lib/queries';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  rating: number;
  reviewCount: number;
  category?: { name: string; slug: string };
}

export default function ProductCard({ product }: { product: Product }) {
  const { mutate: addToCart, isPending } = useAddToCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please sign in to add items to your cart.');
      router.push('/auth/login');
      return;
    }
    addToCart({ productId: product.id, quantity: 1 }, {
      onSuccess: () => toast.success(`${product.name} added to cart!`),
      onError: (err: any) => toast.error(err.message || 'Failed to add item to cart.'),
    });
  };

  return (
    <div className="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 hover:border-primary/30">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden bg-secondary flex-shrink-0">
        <img
          src={product.images?.[0] || 'https://picsum.photos/400/400'}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        {product.stock <= 5 && product.stock > 0 && (
          <Badge variant="destructive" className="absolute top-2.5 left-2.5 text-xs font-semibold shadow-sm">
            Only {product.stock} left
          </Badge>
        )}
        {product.stock === 0 && (
          <Badge className="absolute top-2.5 left-2.5 text-xs font-semibold bg-slate-800 text-white hover:bg-slate-800 shadow-sm">
            Out of Stock
          </Badge>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category + Rating */}
        <div className="flex items-center justify-between mb-2">
          {product.category ? (
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground bg-secondary px-2 py-0.5 rounded-sm">
              {product.category.name}
            </span>
          ) : <span />}
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-foreground">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 hover:text-primary transition-colors mb-3 text-foreground">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-auto">
          <p className="text-lg font-extrabold text-foreground mb-3">
            ₹{product.price.toLocaleString()}
          </p>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 opacity-100 md:opacity-0 translate-y-0 md:translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            <Button
              className="w-full text-xs h-9 bg-cta hover:bg-cta-dark text-cta-foreground border-0 font-semibold shadow-sm shadow-cta/20"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isPending}
            >
              <ShoppingCart className="w-3.5 h-3.5 mr-1" />
              {isPending ? 'Adding…' : 'Add'}
            </Button>
            <Link href={`/products/${product.slug}`} className="w-full">
              <Button className="w-full text-xs h-9" variant="outline">
                <Eye className="w-3.5 h-3.5 mr-1" />
                View
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border overflow-hidden flex flex-col bg-card">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-14 rounded-sm" />
          <Skeleton className="h-3 w-10 rounded-sm" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="mt-auto pt-2">
          <Skeleton className="h-6 w-20 mb-3" />
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-9 w-full rounded-lg" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
