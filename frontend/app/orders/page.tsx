'use client';
import { useOrders } from '@/lib/queries';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Package, Truck, CheckCircle2, XCircle, ShoppingBag, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PLACED:    { label: 'Placed',     color: 'bg-amber-100 text-amber-800 border-amber-200',     icon: <Clock className="h-3.5 w-3.5" /> },
  CONFIRMED: { label: 'Confirmed',  color: 'bg-blue-100 text-blue-800 border-blue-200',         icon: <Package className="h-3.5 w-3.5" /> },
  SHIPPED:   { label: 'Shipped',    color: 'bg-primary/10 text-primary border-primary/20',      icon: <Truck className="h-3.5 w-3.5" /> },
  DELIVERED: { label: 'Delivered',  color: 'bg-success/10 text-success border-success/20',      icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  CANCELLED: { label: 'Cancelled',  color: 'bg-destructive/10 text-destructive border-destructive/20', icon: <XCircle className="h-3.5 w-3.5" /> },
};

export default function OrdersPage() {
  const { data: res, isLoading } = useOrders();
  const orders = res?.data || [];

  return (
    <>
      <Navbar />
      <div className="bg-muted min-h-[80vh]">
        <div className="container mx-auto px-4 py-10 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Account</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">My Orders</h1>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="space-y-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-2xl border border-border p-6 space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                  <div className="flex gap-4">
                    <Skeleton className="h-20 w-20 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && orders.length === 0 && (
            <div className="bg-card rounded-2xl border border-border p-14 text-center shadow-sm">
              <div className="h-20 w-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <ShoppingBag className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-8 text-sm max-w-xs mx-auto">
                You haven&apos;t placed any orders. Start shopping to see your orders here!
              </p>
              <Link href="/products">
                <Button className="font-bold">Start Shopping</Button>
              </Link>
            </div>
          )}

          {/* Orders list */}
          {!isLoading && orders.length > 0 && (
            <div className="space-y-5">
              {orders.map((order: any) => {
                const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.PLACED;
                return (
                  <div key={order.id} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md hover:shadow-primary/5 transition-shadow">
                    {/* Order header */}
                    <div className="border-b border-border bg-muted/50 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-x-8 gap-y-2">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Order ID</p>
                          <p className="font-bold text-foreground text-sm">#{order.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Placed On</p>
                          <p className="font-semibold text-foreground text-sm">
                            {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Total</p>
                          <p className="font-bold text-foreground text-sm">₹{order.total.toLocaleString()}</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full border w-fit ${statusConfig.color}`}
                      >
                        {statusConfig.icon}
                        {statusConfig.label}
                      </Badge>
                    </div>

                    {/* Order items */}
                    <div className="px-6 divide-y divide-border">
                      {order.items.map((item: any) => (
                        <div key={item.id} className="py-5 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <Link href={`/products/${item.product.slug}`} className="relative h-16 w-16 rounded-xl overflow-hidden bg-muted border border-border flex-shrink-0 group">
                              <img
                                src={item.product?.images?.[0]}
                                alt={item.product?.name}
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                              />
                            </Link>
                            <div>
                              <Link href={`/products/${item.product.slug}`} className="font-semibold text-sm text-foreground hover:text-primary transition-colors line-clamp-1">
                                {item.product.name}
                              </Link>
                              <p className="text-xs text-muted-foreground mt-1 font-medium">
                                ₹{item.price.toLocaleString()} × {item.quantity}
                              </p>
                            </div>
                          </div>
                          <Link href={`/products/${item.product.slug}`} className="hidden sm:block flex-shrink-0">
                            <Button variant="outline" size="sm" className="text-xs font-semibold h-8">
                              Buy Again
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-3 bg-muted/30 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">Delivery: </span>{order.address}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
