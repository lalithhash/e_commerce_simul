'use client';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useCart } from '@/lib/queries';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ShoppingBag, ShieldCheck, Truck, Tag } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartItem, { CartItemSkeleton } from '@/components/cart/CartItem';

export default function CartPage() {
  const { isLoading } = useCart();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 99;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  return (
    <>
      <Navbar />
      <div className="bg-muted min-h-[80vh]">
        <div className="container mx-auto px-4 py-10">
          {/* Page header */}
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Your Bag</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Shopping Cart</h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1 bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              {isLoading ? (
                <div className="p-6 space-y-1 divide-y divide-border">
                  <CartItemSkeleton />
                  <CartItemSkeleton />
                  <CartItemSkeleton />
                </div>
              ) : cartItems.length === 0 ? (
                <div className="py-20 text-center px-6">
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 mb-6">
                    <ShoppingBag className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2">Your cart is empty</h2>
                  <p className="text-muted-foreground mb-8 max-w-xs mx-auto text-sm">
                    Looks like you haven&apos;t added anything yet. Let&apos;s start shopping!
                  </p>
                  <Link href="/products">
                    <Button size="lg" className="font-bold">Browse Products</Button>
                  </Link>
                </div>
              ) : (
                <>
                  {/* Header row */}
                  <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-6 py-4 bg-muted border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    <div className="col-span-8">Product</div>
                    <div className="col-span-2 text-center">Qty</div>
                    <div className="col-span-2 text-right">Price</div>
                  </div>
                  <div className="divide-y divide-border px-6">
                    {cartItems.map((item) => (
                      <CartItem key={item.id} item={item} isUpdating={false} />
                    ))}
                  </div>
                  <div className="px-6 py-4 border-t border-border">
                    <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                      <ArrowLeft className="h-4 w-4" /> Continue Shopping
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Order Summary */}
            {cartItems.length > 0 && (
              <div className="w-full lg:w-96 flex-shrink-0">
                <div className="bg-card rounded-2xl border border-border shadow-sm p-6 sticky top-24 space-y-6">
                  <h2 className="text-lg font-extrabold text-foreground">Order Summary</h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-medium">Subtotal ({cartItems.reduce((a, i) => a + i.quantity, 0)} items)</span>
                      <span className="font-semibold text-foreground">₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-medium">Shipping</span>
                      <span className={`font-semibold ${shipping === 0 ? 'text-success' : 'text-foreground'}`}>
                        {shipping === 0 ? 'Free' : `₹${shipping}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-medium">GST (18%)</span>
                      <span className="font-semibold text-foreground">₹{tax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                    {shipping === 0 && (
                      <div className="flex items-center gap-2 text-xs text-success font-semibold bg-success/10 px-3 py-2 rounded-lg">
                        <Truck className="h-3.5 w-3.5" /> You saved ₹99 on shipping!
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-foreground text-lg">Total</span>
                    <span className="font-extrabold text-foreground text-2xl">₹{total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>

                  <Link href="/checkout">
                    <Button className="w-full h-12 text-base font-bold bg-cta hover:bg-cta-dark text-cta-foreground border-0 shadow-lg shadow-cta/20 rounded-xl">
                      Proceed to Checkout
                    </Button>
                  </Link>

                  {/* Trust badges */}
                  <div className="flex items-center justify-center gap-4 pt-1 text-[11px] text-muted-foreground font-medium">
                    <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-success" /> Secure Checkout</span>
                    <span className="flex items-center gap-1"><Tag className="h-3 w-3 text-primary" /> Best Price</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
