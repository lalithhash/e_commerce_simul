'use client';
import { ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setCart } from '@/store/cartSlice';
import { useCart } from '@/lib/queries';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CartItem, { CartItemSkeleton } from './CartItem';
import { useAuth } from '@/lib/auth-context';

export default function CartDrawer({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const router = useRouter();
  
  const { data: cartData, isLoading } = useCart();

  useEffect(() => {
    if (cartData?.success) {
      dispatch(setCart(cartData.data));
    }
  }, [cartData, dispatch]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);

  return (
    <Sheet>
      <SheetTrigger nativeButton={false} render={<span />}>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader className="px-1 border-b pb-4">
          <SheetTitle className="flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Your Cart ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto pr-4 py-4 -mr-4">
          {!user ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">You need to sign in to use the cart.</p>
              <SheetClose nativeButton={false} render={<span />}>
                <Button onClick={() => router.push('/auth/login')}>Sign In</Button>
              </SheetClose>
            </div>
          ) : isLoading ? (
            Array(3).fill(0).map((_, i) => <CartItemSkeleton key={i} />)
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 py-10">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
              <p className="text-lg font-medium text-muted-foreground">Your cart is empty</p>
              <SheetClose nativeButton={false} render={<span />}>
                <Button variant="outline" className="mt-2" onClick={() => router.push('/products')}>
                  Continue Shopping
                </Button>
              </SheetClose>
            </div>
          ) : (
            cartItems.map(item => (
              <CartItem key={item.id} item={item} isUpdating={false} />
            ))
          )}
        </div>

        {cartItems.length > 0 && user && (
          <div className="border-t pt-6 space-y-4 bg-background">
            <div className="flex justify-between text-lg font-semibold">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <p className="text-sm text-muted-foreground">Shipping and taxes calculated at checkout.</p>
            <div className="grid grid-cols-2 gap-4">
              <SheetClose nativeButton={false} render={<span />}>
                <Button variant="outline" className="w-full" onClick={() => router.push('/cart')}>
                  View Cart
                </Button>
              </SheetClose>
              <SheetClose nativeButton={false} render={<span />}>
                <Button className="w-full" onClick={() => router.push('/checkout')}>
                  Checkout
                </Button>
              </SheetClose>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
