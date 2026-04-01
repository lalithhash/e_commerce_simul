'use client';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RootState } from '@/store/store';
import { usePlaceOrder } from '@/lib/queries';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { MapPin, CreditCard, ChevronRight, CheckCircle2, Package } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const router = useRouter();
  const orderMutation = usePlaceOrder();

  const [address, setAddress] = useState('');
  const [step, setStep] = useState(1);
  const [successOrder, setSuccessOrder] = useState<any>(null);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 99;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0 && !successOrder) {
    if (typeof window !== 'undefined') router.replace('/cart');
    return null;
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) { toast.error('Address is required'); return; }
    orderMutation.mutate(address, {
      onSuccess: (res) => { setSuccessOrder(res.data); setStep(3); },
      onError: (err: any) => toast.error(err.message || 'Failed to place order'),
    });
  };

  // Success screen
  if (step === 3 && successOrder) {
    return (
      <>
        <Navbar />
        <div className="min-h-[80vh] bg-muted flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center bg-card rounded-3xl border border-border shadow-xl p-10">
            <div className="h-20 w-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-3">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-2">Thank you for your purchase.</p>
            <p className="text-sm font-bold text-foreground mb-8 bg-muted px-4 py-2 rounded-lg inline-block">
              Order #{successOrder.id.slice(0, 8).toUpperCase()}
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/orders">
                <Button variant="outline" className="font-semibold">View Orders</Button>
              </Link>
              <Link href="/">
                <Button className="font-semibold">Continue Shopping</Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-muted min-h-[80vh] py-10">
        <div className="container mx-auto px-4">

          {/* Progress indicator */}
          <div className="max-w-5xl mx-auto mb-8">
            <div className="flex items-center gap-2 text-sm font-medium">
              {['Shipping', 'Payment', 'Confirmation'].map((label, idx) => (
                <span key={label} className="flex items-center gap-2">
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    step > idx + 1 ? 'bg-success text-white' :
                    step === idx + 1 ? 'bg-primary text-white' :
                    'bg-border text-muted-foreground'
                  }`}>{step > idx + 1 ? '✓' : idx + 1}</span>
                  <span className={step === idx + 1 ? 'text-foreground font-bold' : 'text-muted-foreground'}>
                    {label}
                  </span>
                  {idx < 2 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto">
            {/* Steps */}
            <div className="flex-1 space-y-5">

              {/* Shipping */}
              <div className={`bg-card rounded-2xl border border-border shadow-sm p-6 transition-opacity ${step !== 1 ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-foreground">Shipping Address</h2>
                    <p className="text-xs text-muted-foreground font-medium">Where should we deliver?</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-semibold">Full Address</Label>
                    <Textarea
                      id="address"
                      placeholder="Street, city, state, ZIP code..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="resize-none bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-primary"
                      rows={4}
                    />
                  </div>
                  <Button
                    className="font-bold"
                    onClick={() => address ? setStep(2) : toast.error('Address is required')}
                  >
                    Continue to Payment
                  </Button>
                </div>
              </div>

              {/* Payment */}
              <div className={`bg-card rounded-2xl border border-border shadow-sm p-6 transition-opacity ${step !== 2 ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-extrabold text-foreground">Payment</h2>
                      <p className="text-xs text-muted-foreground font-medium">Choose your payment method</p>
                    </div>
                  </div>
                  <button onClick={() => setStep(1)} className="text-xs font-semibold text-primary hover:underline">
                    Edit Address
                  </button>
                </div>

                <div className="p-4 bg-success/5 rounded-xl border border-success/20 flex items-start gap-3 mb-6">
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-foreground">Cash on Delivery</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Pay when your order arrives at your doorstep.</p>
                  </div>
                </div>

                {address && (
                  <div className="p-3 bg-muted rounded-lg mb-6 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Delivering to: </span>{address}
                  </div>
                )}

                <Button
                  className="w-full h-12 text-base font-bold bg-cta hover:bg-cta-dark text-cta-foreground border-0 shadow-lg shadow-cta/20 rounded-xl"
                  onClick={handlePlaceOrder}
                  disabled={orderMutation.isPending}
                >
                  {orderMutation.isPending ? 'Processing…' : `Place Order • ₹${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                </Button>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="w-full lg:w-96 flex-shrink-0">
              <div className="bg-card rounded-2xl border border-border shadow-sm p-6 sticky top-24">
                <h3 className="font-extrabold text-foreground text-lg mb-5 flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" /> Order Summary
                </h3>
                <div className="space-y-4 mb-5 max-h-[28vh] overflow-auto -mr-2 pr-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative h-14 w-14 bg-muted rounded-xl overflow-hidden flex-shrink-0 border border-border">
                        <img src={item.product?.images[0]} alt="" className="object-cover w-full h-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground line-clamp-1">{item.product?.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Qty: {item.quantity}</p>
                        <p className="font-bold text-sm text-foreground mt-0.5">₹{(item.product?.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="mb-4" />
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-medium">Subtotal</span>
                    <span className="font-semibold text-foreground">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-medium">Shipping</span>
                    <span className={`font-semibold ${shipping === 0 ? 'text-success' : 'text-foreground'}`}>
                      {shipping === 0 ? 'Free' : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-medium">Tax (18%)</span>
                    <span className="font-semibold text-foreground">₹{tax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-foreground text-lg">Total</span>
                  <span className="font-extrabold text-primary text-2xl">₹{total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
