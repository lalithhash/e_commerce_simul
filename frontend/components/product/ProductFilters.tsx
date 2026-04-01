import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { SlidersHorizontal } from 'lucide-react';

interface ProductFiltersProps {
  categories: { id: string; name: string; slug: string }[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  priceRange: number[];
  onPriceChange: (value: number[]) => void;
  ratingFilter: boolean;
  onRatingChange: (value: boolean) => void;
}

export default function ProductFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  priceRange,
  onPriceChange,
  ratingFilter,
  onRatingChange,
}: ProductFiltersProps) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-5 sticky top-24">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <SlidersHorizontal className="h-4 w-4 text-primary" />
        <h3 className="font-extrabold text-base text-foreground tracking-tight">Filters</h3>
      </div>

      {/* Categories */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Categories</p>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5">
            <Checkbox
              id="all-categories"
              checked={selectedCategory === ''}
              onCheckedChange={() => onSelectCategory('')}
            />
            <Label
              htmlFor="all-categories"
              className={`text-sm cursor-pointer leading-none transition-colors ${selectedCategory === '' ? 'font-bold text-primary' : 'font-medium text-foreground hover:text-primary'}`}
            >
              All Categories
            </Label>
          </div>
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2.5">
              <Checkbox
                id={`cat-${cat.slug}`}
                checked={selectedCategory === cat.slug}
                onCheckedChange={() => onSelectCategory(cat.slug)}
              />
              <Label
                htmlFor={`cat-${cat.slug}`}
                className={`text-sm cursor-pointer leading-none transition-colors ${selectedCategory === cat.slug ? 'font-bold text-primary' : 'font-medium text-foreground hover:text-primary'}`}
              >
                {cat.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-5" />

      {/* Price Range */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Price Range</p>
          <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            ₹{priceRange[0].toLocaleString()} – ₹{priceRange[1].toLocaleString()}
          </span>
        </div>
        <Slider
          value={priceRange}
          min={0}
          max={150000}
          step={500}
          onValueChange={(value) => onPriceChange(Array.isArray(value) ? [...value] : [0, value])}
          className="my-5"
        />
        <div className="flex justify-between text-xs text-muted-foreground font-medium">
          <span>₹0</span>
          <span>₹1,50,000</span>
        </div>
      </div>

      <Separator className="my-5" />

      {/* Rating Filter */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Customer Rating</p>
        <div className="flex items-center gap-2.5">
          <Checkbox
            id="rating-4plus"
            checked={ratingFilter}
            onCheckedChange={(checked) => onRatingChange(checked as boolean)}
          />
          <Label
            htmlFor="rating-4plus"
            className={`text-sm cursor-pointer leading-none transition-colors ${ratingFilter ? 'font-bold text-primary' : 'font-medium text-foreground hover:text-primary'}`}
          >
            4★ & Above
          </Label>
        </div>
      </div>
    </div>
  );
}
