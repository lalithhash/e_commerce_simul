'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useProduct, useAddToCart } from '@/lib/queries';
import { useAuth } from '@/lib/auth-context';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Minus, Plus, ShoppingCart, Heart, Shield, Truck, RefreshCcw, Home, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { data: res, isLoading } = useProduct(id as string);
  const { mutate: addToCart, isPending } = useAddToCart();
  const { user } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const product = res?.data;

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-10">
          <div className="grid md:grid-cols-2 gap-10">
            <Skeleton className="aspect-square rounded-2xl w-full" />
            <div className="space-y-5">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-foreground">Product not found</h1>
          <Link href="/products" className="mt-4 inline-block text-primary hover:underline font-medium text-sm">
            ← Back to products
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Sign in required');
      return;
    }
    addToCart({ productId: product.id, quantity }, {
      onSuccess: () => toast.success(`${product.name} added to cart!`),
      onError: (err: any) => toast.error(err.message),
    });
  };

  return (
    <>
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-muted border-b border-border py-3.5">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <Link href="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Home className="h-3 w-3" /> Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
            {product.category && (
              <>
                <ChevronRight className="h-3 w-3" />
                <Link href={`/products?category=${product.category.slug}`} className="hover:text-foreground transition-colors">
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-semibold truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-14">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">

          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-border bg-muted">
              <img
                src={product.images?.[activeImage] || 'https://picsum.photos/600/600'}
                alt={product.name}
                className="object-cover w-full h-full"
              />
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                  <Badge className="bg-slate-800 text-white text-sm px-4 py-1.5 font-bold">Out of Stock</Badge>
                </div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${activeImage === idx ? 'border-primary shadow-md shadow-primary/20' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {product.category && (
              <Badge variant="secondary" className="w-fit mb-3 text-xs font-semibold uppercase tracking-wider">
                {product.category.name}
              </Badge>
            )}
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-border fill-border'}`}
                  />
                ))}
              </div>
              <span className="font-bold text-foreground text-sm">{product.rating.toFixed(1)}</span>
              <span className="text-muted-foreground text-sm underline cursor-pointer hover:text-foreground">
                {product.reviewCount} Reviews
              </span>
            </div>

            {/* Price & Stock */}
            <div className="mb-6 flex items-end gap-4">
              <span className="text-4xl font-extrabold text-foreground">₹{product.price.toLocaleString()}</span>
              <span className={`text-sm font-semibold mb-1.5 ${product.stock > 0 ? 'text-success' : 'text-destructive'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed mb-8 text-sm">
              {product.description}
            </p>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-border rounded-xl h-12 bg-card">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 h-full text-muted-foreground hover:text-foreground hover:bg-secondary rounded-l-xl transition-colors disabled:opacity-40"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-bold text-foreground">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 h-full text-muted-foreground hover:text-foreground hover:bg-secondary rounded-r-xl transition-colors disabled:opacity-40"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <Button
                className="flex-1 h-12 text-base font-bold bg-cta hover:bg-cta-dark text-cta-foreground border-0 shadow-lg shadow-cta/20 rounded-xl"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isPending}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isPending ? 'Adding…' : 'Add to Cart'}
              </Button>

              <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl flex-shrink-0 border-border hover:border-destructive/50 hover:bg-destructive/5 transition-all">
                <Heart className="h-5 w-5 text-muted-foreground group-hover:text-destructive" />
              </Button>
            </div>

            {/* Trust Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border">
              {[
                { icon: Truck, label: 'Free Delivery', sub: 'Over ₹500' },
                { icon: RefreshCcw, label: '30-Day Returns', sub: 'No questions asked' },
                { icon: Shield, label: '1 Year Warranty', sub: 'Manufacturer warranty' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{label}</p>
                    <p className="text-[10px] text-muted-foreground">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-20">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start border-b border-border rounded-none h-auto bg-transparent p-0">
              <TabsTrigger
                value="description"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3.5 font-semibold text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary text-muted-foreground"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3.5 font-semibold text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary text-muted-foreground"
              >
                Reviews ({product.reviews?.length || 0})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="py-8">
              <div className="max-w-3xl">
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="py-8">
              <div className="max-w-3xl space-y-8">
                {product.reviews?.length > 0 ? (
                  product.reviews.map((review: any) => (
                    <div key={review.id} className="border-b border-border pb-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {review.user?.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-foreground">{review.user?.name || 'Anonymous'}</p>
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-border fill-border'}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">
                          {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed pl-13">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Star className="h-12 w-12 text-border mx-auto mb-3" />
                    <p className="text-muted-foreground font-medium">No reviews yet. Be the first to review!</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  );
}
