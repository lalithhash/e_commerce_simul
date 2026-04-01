'use client';
import { useAdminStats } from '@/lib/queries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Package, ShoppingCart, IndianRupee, ArrowUpRight, TrendingUp } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboard() {
  const { data: res, isLoading } = useAdminStats();
  const stats = res?.data;

  const statCards = [
    {
      label: 'Total Revenue',
      value: stats?.totalRevenue ? `₹${stats.totalRevenue.toLocaleString()}` : '₹0',
      icon: IndianRupee,
      trend: '+20% from last month',
      gradient: true,
    },
    {
      label: 'Total Orders',
      value: stats?.orderCount ?? 0,
      icon: ShoppingCart,
      trend: `${stats?.recentOrders?.length || 0} recent orders`,
      gradient: false,
    },
    {
      label: 'Products Listed',
      value: stats?.productCount ?? 0,
      icon: Package,
      trend: 'In your catalog',
      gradient: false,
    },
    {
      label: 'Customers',
      value: stats?.userCount ?? 0,
      icon: Users,
      trend: 'Registered users',
      gradient: false,
    },
  ];

  const getStatusStyle = (status: string) => {
    const map: Record<string, string> = {
      PLACED: 'bg-amber-100 text-amber-800 border-amber-200',
      CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
      SHIPPED: 'bg-primary/10 text-primary border-primary/20',
      DELIVERED: 'bg-success/10 text-success border-success/20',
      CANCELLED: 'bg-destructive/10 text-destructive border-destructive/20',
    };
    return map[status] || 'bg-secondary text-foreground border-border';
  };

  return (
    <div className="min-h-screen bg-muted">
      <Navbar />

      <div className="container mx-auto px-4 py-8 md:py-10 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Admin</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1 text-sm font-medium">Overview of your store&apos;s performance.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="font-semibold">Manage Users</Button>
            <Button className="font-semibold">View All Orders</Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-none shadow-sm">
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-28 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))
          ) : (
            statCards.map(({ label, value, icon: Icon, trend, gradient }) => (
              gradient ? (
                <Card key={label} className="border-none shadow-md bg-gradient-to-br from-primary to-violet-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-semibold opacity-80">{label}</CardTitle>
                    <div className="h-8 w-8 rounded-lg bg-white/15 flex items-center justify-center">
                      <Icon className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-extrabold mb-1.5">{value}</div>
                    <p className="text-xs opacity-70 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> {trend}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card key={label} className="border-none shadow-sm bg-card">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-extrabold text-foreground mb-1.5">{value}</div>
                    <p className="text-xs text-muted-foreground font-medium">{trend}</p>
                  </CardContent>
                </Card>
              )
            ))
          )}
        </div>

        {/* Lower Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <Card className="lg:col-span-2 border-none shadow-sm bg-card">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-lg font-extrabold text-foreground">Recent Orders</CardTitle>
              <CardDescription className="text-muted-foreground text-sm font-medium">Latest transactions from your store.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted border-b border-border">
                        <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">Order ID</th>
                        <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">Customer</th>
                        <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground hidden md:table-cell">Date</th>
                        <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                        <th className="px-5 py-3.5 text-right text-xs font-bold uppercase tracking-widest text-muted-foreground">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {stats?.recentOrders?.map((order: any) => (
                        <tr key={order.id} className="hover:bg-muted/60 transition-colors">
                          <td className="px-5 py-4 font-bold text-foreground text-xs uppercase">#{order.id.slice(0, 6)}</td>
                          <td className="px-5 py-4">
                            <div className="font-semibold text-foreground text-sm">{order.user?.name}</div>
                            <div className="text-muted-foreground text-xs">{order.user?.email}</div>
                          </td>
                          <td className="px-5 py-4 text-muted-foreground text-xs font-medium hidden md:table-cell whitespace-nowrap">
                            {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-5 py-4">
                            <Badge
                              variant="outline"
                              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getStatusStyle(order.status)}`}
                            >
                              {order.status}
                            </Badge>
                          </td>
                          <td className="px-5 py-4 text-right font-extrabold text-foreground">
                            ₹{order.total.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                      {!stats?.recentOrders?.length && (
                        <tr>
                          <td colSpan={5} className="px-5 py-12 text-center text-muted-foreground text-sm font-medium">
                            No recent orders found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-none shadow-sm bg-card h-fit">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-lg font-extrabold text-foreground">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              <Button className="w-full justify-start text-left h-11 bg-primary/10 text-primary hover:bg-primary/20 border-0 shadow-none font-semibold" variant="outline">
                <Package className="mr-2.5 h-4 w-4" /> Add New Product
              </Button>
              <Button className="w-full justify-start text-left h-11 bg-primary/10 text-primary hover:bg-primary/20 border-0 shadow-none font-semibold" variant="outline">
                <Users className="mr-2.5 h-4 w-4" /> Manage Customers
              </Button>
              <Button className="w-full justify-start text-left h-11 bg-primary/10 text-primary hover:bg-primary/20 border-0 shadow-none font-semibold" variant="outline">
                <ArrowUpRight className="mr-2.5 h-4 w-4" /> View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
