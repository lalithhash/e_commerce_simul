'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import api from '@/lib/api';
import { ShieldCheck, Truck, RefreshCcw, UserPlus, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      const res: any = await api.post('/auth/register', { name, email, password });
      if (res.success) {
        login(res.data.user);
        toast.success('Account created successfully!');
        window.location.href = '/';
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to create account');
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
            Join millions of<br />happy shoppers.
          </h1>
          <p className="text-indigo-200 text-lg leading-relaxed mb-10">
            Create a free account and start exploring the best deals.
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
          <Link href="/auth/login" className="text-sm font-semibold text-primary hover:underline">Sign in</Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                <UserPlus className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
                Create an account
              </h2>
              <p className="text-muted-foreground mt-1.5 text-sm">
                Sign up with your name, email, and password.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">Full name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="h-11 bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
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
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  minLength={6}
                  required
                  className="h-11 bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
              <Button type="submit" className="w-full h-11 font-bold text-sm" disabled={loading}>
                {loading ? 'Creating…' : (
                  <span className="flex items-center gap-2">Create Account <ArrowRight className="h-4 w-4" /></span>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                By signing up, you agree to our{' '}
                <Link href="/terms" className="underline hover:text-foreground">Terms</Link> and{' '}
                <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
              </p>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-semibold text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
