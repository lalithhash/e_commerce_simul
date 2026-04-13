'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { algoliasearch } from 'algoliasearch';
import {
  InstantSearch,
  SearchBox,
  Hits,
  Highlight,
  useInstantSearch,
  Configure,
  PoweredBy,
} from 'react-instantsearch';
import { Search, X, TrendingUp, Star, Package } from 'lucide-react';

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
);

const INDEX_NAME = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'products';

// ── Hit card ────────────────────────────────────────────────────────────────
function HitCard({ hit, onSelect }: { hit: any; onSelect: () => void }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/products/${hit.slug}`);
    onSelect();
  };

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center gap-4 px-4 py-3 hover:bg-primary/5 transition-colors duration-150 group text-left"
    >
      {/* Product image */}
      <div className="h-14 w-14 rounded-xl overflow-hidden flex-shrink-0 bg-secondary border border-border">
        {hit.images?.[0] ? (
          <img
            src={hit.images[0]}
            alt={hit.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Package className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
          <Highlight attribute="name" hit={hit} classNames={{
            highlighted: 'bg-primary/15 text-primary rounded px-0.5 not-italic font-bold',
            nonHighlighted: '',
          }} />
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          <Highlight attribute="categoryName" hit={hit} classNames={{
            highlighted: 'bg-primary/15 text-primary rounded px-0.5 not-italic',
            nonHighlighted: '',
          }} />
        </p>
        <div className="flex items-center gap-2 mt-1">
          <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
          <span className="text-xs text-muted-foreground">{hit.rating?.toFixed(1)}</span>
        </div>
      </div>

      {/* Price */}
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-foreground">
          ₹{Number(hit.price).toLocaleString('en-IN')}
        </p>
        {hit.stock < 5 && hit.stock > 0 && (
          <p className="text-[10px] text-orange-500 font-semibold mt-0.5">Only {hit.stock} left</p>
        )}
        {hit.stock === 0 && (
          <p className="text-[10px] text-destructive font-semibold mt-0.5">Out of stock</p>
        )}
      </div>
    </button>
  );
}

// ── Empty / idle state ───────────────────────────────────────────────────────
function EmptyState({ query }: { query: string }) {
  const { results } = useInstantSearch();
  const hasQuery = query.trim().length > 0;
  const nbHits = results?.nbHits ?? 0;

  if (!hasQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <TrendingUp className="h-6 w-6 text-primary" />
        </div>
        <p className="text-sm font-semibold text-foreground mb-1">Start typing to search</p>
        <p className="text-xs text-muted-foreground">Search across all products instantly</p>
      </div>
    );
  }

  if (hasQuery && nbHits === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center mb-4">
          <Search className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-semibold text-foreground mb-1">No results for &quot;{query}&quot;</p>
        <p className="text-xs text-muted-foreground">Try a different keyword or browse categories</p>
      </div>
    );
  }

  return null;
}

// ── Results panel (only shown when there's a query) ─────────────────────────
function ResultsPanel({ query, onSelect }: { query: string; onSelect: () => void }) {
  const { results } = useInstantSearch();
  const nbHits = results?.nbHits ?? 0;
  const hasQuery = query.trim().length > 0;

  if (!hasQuery) return <EmptyState query={query} />;

  return (
    <div>
      {nbHits > 0 && (
        <>
          <div className="px-4 py-2.5 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {nbHits} result{nbHits !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="divide-y divide-border/50 max-h-[420px] overflow-y-auto overscroll-contain">
            <Hits
              hitComponent={({ hit }) => <HitCard hit={hit} onSelect={onSelect} />}
              classNames={{ root: '', list: '', item: '' }}
            />
          </div>
        </>
      )}
      {nbHits === 0 && <EmptyState query={query} />}
    </div>
  );
}

// ── Main modal ───────────────────────────────────────────────────────────────
interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      // Small delay to let the animation complete
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    } else {
      setQuery('');
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [onClose]);

  // Close on backdrop click
  const handleBackdrop = useCallback((e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={handleBackdrop}
    >
      <div
        ref={modalRef}
        className="w-full max-w-2xl bg-background rounded-2xl shadow-2xl shadow-black/25 border border-border overflow-hidden"
        style={{ animation: 'searchModalIn 0.18s ease-out' }}
      >
        <InstantSearch searchClient={searchClient} indexName={INDEX_NAME} future={{ preserveSharedStateOnUnmount: true }}>
          <Configure hitsPerPage={8} />

          {/* Search input row */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <SearchBox
              placeholder="Search products, categories…"
              onChangeCapture={(e: any) => setQuery(e.target.value)}
              classNames={{
                root: 'flex-1',
                form: 'flex w-full',
                input: 'flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-base font-medium outline-none border-0 focus:ring-0',
                submit: 'hidden',
                reset: 'hidden',
                loadingIndicator: 'hidden',
              }}
            />
            {query && (
              <button
                onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-xs font-semibold text-muted-foreground bg-secondary hover:bg-border px-2.5 py-1.5 rounded-lg transition-colors ml-1"
            >
              ESC
            </button>
          </div>

          {/* Results */}
          <ResultsPanel query={query} onSelect={onClose} />

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-border flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground font-medium">Press <kbd className="bg-secondary px-1.5 py-0.5 rounded text-[10px] font-mono">↵</kbd> to go to results page</p>
            <PoweredBy classNames={{ root: 'opacity-60 hover:opacity-100 transition-opacity', logo: 'h-4' }} />
          </div>
        </InstantSearch>
      </div>

      <style>{`
        @keyframes searchModalIn {
          from { opacity: 0; transform: translateY(-12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      `}</style>
    </div>
  );
}
