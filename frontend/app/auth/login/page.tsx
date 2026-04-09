'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import api from '@/lib/api';
import { ShieldCheck, Truck, RefreshCcw, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      const res: any = await api.post('/auth/login', { email, password });
      if (res.success) {
        login(res.data.user);
        toast.success('Signed in successfully!');
        window.location.href = '/';
      }
    } catch (err: any) {
      toast.error(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br from-indigo-950 via-indigo-800 to-violet-700 text-white p-12">
        <Link href="/" className="text-2xl font-extrabold tracking-tight">ShopNest</Link>
        <div>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight mb-4">
            Your ultimate<br />shopping destination.
          </h1>
          <p className="text-indigo-200 text-lg leading-relaxed mb-10">
            Millions of products. Trusted sellers. Fast delivery.
          </p>
          <div className="space-y-4">
            {[
              { icon: Truck, text: 'Free delivery on orders over ₹500' },
              { icon: RefreshCcw, text: '30-day hassle-free returns' },
              { icon: ShieldCheck, text: 'Encrypted & secure payments' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-indigo-100">
                <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-4 w-4 text-indigo-200" />
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-indigo-400">© {new Date().getFullYear()} ShopNest. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-border">
          <Link href="/" className="text-xl font-extrabold text-primary">ShopNest</Link>
          <Link href="/auth/register" className="text-sm font-semibold text-primary hover:underline">Create account</Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
                Welcome back
              </h2>
              <p className="text-muted-foreground mt-1.5 text-sm">
                Sign in using your email and password.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="h-11 bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="h-11 bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
              <Button type="submit" className="w-full h-11 font-bold text-sm" disabled={loading}>
                {loading ? 'Signing in…' : (
                  <span className="flex items-center gap-2">Sign In <ArrowRight className="h-4 w-4" /></span>
                )}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="font-semibold text-primary hover:underline">
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
