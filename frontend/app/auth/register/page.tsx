'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import api from '@/lib/api';
import { ShieldCheck, Truck, RefreshCcw, UserPlus, ArrowRight } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      const res: any = await api.post('/auth/register', { name, email, password });
      if (res.success) {
        login(res.data.user);
        toast.success('Account created successfully! Welcome to ShopNest 🎉');
        window.location.href = '/';
      }
    } catch (err: any) {
      // 409 = account already exists → redirect to login
      if (err.status === 409 || err.message?.toLowerCase().includes('already exists')) {
        toast.info('Account already exists. Redirecting to sign in…');
        setTimeout(() => router.push('/auth/login'), 1200);
      } else {
        toast.error(err.message || 'Failed to create account');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (tokenResponse: any) => {
    setGoogleLoading(true);
    try {
      const res: any = await api.post('/auth/google', { access_token: tokenResponse.access_token });
      if (res.success) {
        login(res.data.user);
        // isNew flag tells us if this was a fresh account or an existing one
        if (res.data.isNew === false) {
          toast.info('Welcome back! You already have an account — signing you in.');
        } else {
          toast.success('Account created with Google! Welcome 🎉');
        }
        window.location.href = '/';
      }
    } catch (err: any) {
      toast.error(err.message || 'Google sign-up failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => toast.error('Google sign-up was cancelled or failed.'),
    flow: 'implicit',
  });

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
                Join ShopNest in seconds.
              </p>
            </div>

            {/* Google Sign-Up Button */}
            <button
              type="button"
              onClick={() => googleLogin()}
              disabled={googleLoading || loading}
              className="w-full h-11 flex items-center justify-center gap-3 rounded-xl border border-border bg-card hover:bg-secondary transition-colors duration-200 font-semibold text-sm text-foreground shadow-sm disabled:opacity-60 disabled:cursor-not-allowed mb-5"
            >
              {googleLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating account…
                </span>
              ) : (
                <>
                  <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs font-medium text-muted-foreground">or sign up with email</span>
              <div className="flex-1 h-px bg-border" />
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
                  disabled={loading || googleLoading}
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
                  disabled={loading || googleLoading}
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
                  disabled={loading || googleLoading}
                  minLength={6}
                  required
                  className="h-11 bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
              <Button type="submit" className="w-full h-11 font-bold text-sm" disabled={loading || googleLoading}>
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
