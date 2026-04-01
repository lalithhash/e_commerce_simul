'use client';
import Link from 'next/link';
import { ArrowRight, Truck, RefreshCcw, ShieldCheck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProducts, useCategories } from '@/lib/queries';
import ProductGrid from '@/components/product/ProductGrid';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function Home() {
  const { data: categoriesData } = useCategories();
  const { data: productsData, isLoading } = useProducts({ limit: 8 });

  const categories = categoriesData?.data || [];
  const trendingProducts = productsData?.data || [];

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-800 to-violet-700 text-white">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&q=60')", backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'overlay' }}
        />
        {/* Decorative blobs */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="container mx-auto px-4 py-28 md:py-36 relative z-10 flex flex-col items-center text-center">
          <Badge className="bg-white/15 hover:bg-white/20 text-white mb-6 border border-white/20 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold tracking-widest uppercase">
            ✦ Top Quality Products
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] max-w-4xl">
            Discover{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-amber-200">
              Everything
            </span>{' '}
            You Love
          </h1>
          <p className="text-lg md:text-xl mb-10 text-indigo-200 max-w-xl font-medium leading-relaxed">
            Premium tech, cutting-edge fashion, and home essentials — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/products">
              <Button
                size="lg"
                className="h-14 px-8 text-base font-bold bg-cta hover:bg-cta-dark text-cta-foreground border-0 shadow-2xl shadow-orange-500/30 rounded-xl"
              >
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/products?sort=rating">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base font-semibold bg-white/10 hover:bg-white/20 text-white border-white/25 backdrop-blur-sm rounded-xl"
              >
                Explore Deals
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-16 text-xs text-indigo-200 font-medium">
            <span className="flex items-center gap-2"><Truck className="h-3.5 w-3.5" /> Free delivery over ₹500</span>
            <span className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5" /> Secure payments</span>
            <span className="flex items-center gap-2"><RefreshCcw className="h-3.5 w-3.5" /> 30-day returns</span>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Shop by Category</h2>
            <p className="text-muted-foreground mt-2 font-medium">Find exactly what you're looking for</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {categories.map((category: any) => (
              <Link
                href={`/products?category=${category.slug}`}
                key={category.id}
                className="group relative rounded-2xl overflow-hidden aspect-square shadow-sm hover:shadow-xl hover:shadow-primary/15 transition-all duration-300 hover:-translate-y-1"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5 w-full">
                  <h3 className="text-white font-bold text-base mb-0.5 drop-shadow-sm">{category.name}</h3>
                  <p className="text-indigo-200 text-xs font-medium">{category._count?.products || 0} Products</p>
                </div>
              </Link>
            ))}
            {categories.length === 0 && Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-secondary animate-pulse aspect-square" />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Featured</p>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Trending Now</h2>
              <p className="text-muted-foreground mt-1.5 font-medium">Handpicked products our customers are loving.</p>
            </div>
            <Link
              href="/products"
              className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <ProductGrid products={trendingProducts} isLoading={isLoading} skeletonCount={8} />

          <div className="mt-8 md:hidden">
            <Link href="/products">
              <Button variant="outline" className="w-full font-semibold">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard icon={<Truck className="w-6 h-6 text-primary" />} title="Free Shipping" description="On all orders over ₹500" />
            <FeatureCard icon={<RefreshCcw className="w-6 h-6 text-primary" />} title="Easy Returns" description="30-day return policy" />
            <FeatureCard icon={<ShieldCheck className="w-6 h-6 text-primary" />} title="Secure Payments" description="Encrypted payment gateways" />
            <FeatureCard icon={<Clock className="w-6 h-6 text-primary" />} title="24/7 Support" description="Always here to help you" />
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto rounded-3xl overflow-hidden relative bg-gradient-to-br from-indigo-950 to-violet-900 p-10 md:p-16 text-center shadow-2xl shadow-primary/20">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-pink-400 to-violet-400" />
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-3">Stay in the loop</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">Join our newsletter</h2>
            <p className="text-indigo-300 mb-8 max-w-md mx-auto leading-relaxed">
              Get special offers, free giveaways, and once-in-a-lifetime deals delivered to your inbox.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-xl px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                required
              />
              <Button
                type="submit"
                className="rounded-xl py-3.5 px-7 h-auto bg-cta hover:bg-cta-dark font-bold text-cta-foreground border-0 shadow-lg shadow-orange-500/30 text-sm"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-card p-7 rounded-2xl border border-border flex items-start gap-5 hover:shadow-md hover:shadow-primary/10 hover:border-primary/20 transition-all duration-200">
      <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-base text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
