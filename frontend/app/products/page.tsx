'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts, useCategories } from '@/lib/queries';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilters from '@/components/product/ProductFilters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SlidersHorizontal } from 'lucide-react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const defaultCategory = searchParams.get('category') || '';
  const defaultSearch = searchParams.get('search') || '';

  const [category, setCategory] = useState(defaultCategory);
  const search = defaultSearch;
  const [priceRange, setPriceRange] = useState([0, 150000]);
  const [ratingFilter, setRatingFilter] = useState(false);
  const [sort, setSort] = useState('newest');

  const { data: catData } = useCategories();
  const categories = catData?.data || [];

  const { data: prodData, isLoading } = useProducts({
    category,
    search,
    sort,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    minRating: ratingFilter ? 4 : undefined,
    page: 1,
    limit: 12,
  });

  const products = prodData?.data || [];
  const categoryName = category
    ? categories.find((c: any) => c.slug === category)?.name || 'Products'
    : 'All Products';

  useEffect(() => {
    // Keep local filter state in sync with URL updates from navbar links.
    setCategory(defaultCategory);
  }, [defaultCategory]);

  return (
    <>
      <Navbar />

      {/* Page header */}
      <div className="bg-muted border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Browse</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{categoryName}</h1>
          {search && (
            <p className="text-muted-foreground mt-1.5 text-sm font-medium">
              Showing results for &quot;{search}&quot;
            </p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <ProductFilters
              categories={categories}
              selectedCategory={category}
              onSelectCategory={setCategory}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              ratingFilter={ratingFilter}
              onRatingChange={setRatingFilter}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                {isLoading ? 'Loading…' : `${prodData?.pagination?.total || 0} products found`}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground hidden sm:block">Sort by</span>
                <Select value={sort} onValueChange={(v) => setSort(v ?? 'newest')}>
                  <SelectTrigger className="w-[180px] bg-card border-border h-9 text-sm font-medium">
                    <SelectValue placeholder="Newest" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest Arrivals</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ProductGrid products={products} isLoading={isLoading} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
