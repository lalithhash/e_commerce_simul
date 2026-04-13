'use client';
import Link from 'next/link';
import { ShoppingCart, User, Search, Menu, Package, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import CartDrawer from '../cart/CartDrawer';
import SearchModal from '../search/SearchModal';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/products', label: 'All Products' },
  { href: '/products?category=electronics', label: 'Electronics' },
  { href: '/products?category=fashion', label: 'Fashion' },
  { href: '/products?category=home-kitchen', label: 'Home & Kitchen' },
  { href: '/products?category=books', label: 'Books' },
  { href: '/products?category=sports-fitness', label: 'Sports & Fitness' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const activeCategory =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('category') || ''
      : '';

  // Cmd+K / Ctrl+K shortcut to open search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const isLinkActive = (href: string) => {
    if (href === '/products') {
      return pathname === '/products' && !activeCategory;
    }
    const match = href.match(/category=([^&]+)/);
    const linkCategory = match?.[1] || '';
    return pathname === '/products' && activeCategory === linkCategory;
  };


  return (
    <>
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Mobile Menu + Logo */}
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger render={<button className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" />}>
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <SheetHeader className="p-6 pb-4 border-b">
                <SheetTitle className="text-left">
                  <span className="text-xl font-extrabold tracking-tight text-primary">ShopNest</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col p-4 gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium px-3 py-2.5 rounded-lg transition-colors ${
                      isLinkActive(link.href)
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-secondary hover:text-primary text-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Separator className="my-3" />
                {user ? (
                  <>
                    <Link href="/orders" className="text-sm font-medium px-3 py-2.5 rounded-lg hover:bg-secondary hover:text-primary transition-colors flex items-center gap-2 text-foreground">
                      <Package className="h-4 w-4" /> My Orders
                    </Link>
                    <button
                      onClick={logout}
                      className="text-sm font-medium px-3 py-2.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors text-left"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <Link href="/auth/login" className="text-sm font-semibold px-3 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-center">
                    Sign In
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="text-2xl font-extrabold tracking-tight text-primary hover:text-primary/90 transition-colors">
            ShopNest
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1 overflow-x-auto no-scrollbar">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                isLinkActive(link.href)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: Search + Cart + User */}
        <div className="flex items-center gap-2">
          {/* Desktop Search — Algolia trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden lg:flex items-center gap-2 h-9 w-64 px-3 rounded-lg bg-secondary text-muted-foreground text-sm hover:bg-border/70 transition-colors border border-transparent hover:border-border"
          >
            <Search className="h-4 w-4 flex-shrink-0" />
            <span className="flex-1 text-left">Search products…</span>
            <kbd className="hidden xl:inline-flex items-center gap-0.5 text-[10px] font-mono bg-background border border-border px-1.5 py-0.5 rounded">
              ⌘K
            </kbd>
          </button>

          {/* Mobile Search Icon */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
            className="lg:hidden h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Cart */}
          <CartDrawer>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-cta text-[9px] font-bold text-cta-foreground shadow-sm">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Button>
          </CartDrawer>

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger render={<button className="flex items-center justify-center h-9 w-9 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20 hover:bg-primary/20 transition-all" />}>
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                {user.role === 'ADMIN' && (
                  <DropdownMenuItem render={<Link href="/admin/dashboard" />}>
                    <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
                    Admin Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem render={<Link href="/orders" />}>
                  <Package className="mr-2 h-4 w-4 text-primary" />
                  My Orders
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive focus:bg-destructive/10 font-medium cursor-pointer">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/auth/login" className="hidden md:block">
                <Button size="sm" className="h-9 px-4 font-semibold">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/login" className="md:hidden">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>

    {/* Algolia Search Modal — full screen overlay */}
    <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
  </>
  );
}
