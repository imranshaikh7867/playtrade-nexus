import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Clock, Shield, Eye, Download, MessageCircle, LayoutDashboard, ShoppingBag, Settings, LogOut, Loader2, ShoppingCart } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { listings } from "@/data/mockData";
import { toast } from "sonner";

interface Order {
  id: string;
  order_number: string;
  full_name: string;
  phone: string;
  address: string;
  payment_method: string;
  status: string;
  total_amount: number;
  created_at: string;
}

interface OrderItem {
  id: string;
  listing_id: string;
  quantity: number;
  price: number;
}

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: ShoppingBag, label: "My Orders", active: false },
  { icon: Settings, label: "Settings", active: false },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  completed: "bg-green-500/10 text-green-600 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
};

export default function BuyerDashboard() {
  const { user, signOut, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      setOrders(ordersData || []);

      // Fetch order items for each order
      const itemsMap: Record<string, OrderItem[]> = {};
      for (const order of ordersData || []) {
        const { data: itemsData, error: itemsError } = await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", order.id);

        if (!itemsError && itemsData) {
          itemsMap[order.id] = itemsData;
        }
      }
      setOrderItems(itemsMap);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  if (!user && !authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Sign in to view your orders</h2>
            <p className="text-muted-foreground mb-6">
              Please sign in to access your dashboard
            </p>
            <Link to="/auth">
              <Button>Sign In</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 space-y-2">
                {sidebarLinks.map((link) => (
                  <button
                    key={link.label}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      link.active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </button>
                ))}
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold">Buyer Dashboard</h1>
                <p className="text-muted-foreground">Track your orders and purchases</p>
              </div>

              {/* Stats */}
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-xl border border-border bg-card">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                      <p className="text-xl font-bold">{orders.length}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-yellow-500/10">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-xl font-bold">{pendingOrders}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <Shield className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                      <p className="text-xl font-bold">₹{totalSpent.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders */}
              <div className="space-y-4">
                <h2 className="font-semibold text-lg">Recent Orders</h2>

                {orders.length === 0 ? (
                  <div className="text-center py-12 rounded-xl border border-border bg-card">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">No orders yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start shopping to see your orders here
                    </p>
                    <Link to="/marketplace">
                      <Button>Browse Marketplace</Button>
                    </Link>
                  </div>
                ) : (
                  orders.map((order) => {
                    const items = orderItems[order.id] || [];
                    const orderDate = new Date(order.created_at);
                    const hoursAgo = Math.floor((Date.now() - orderDate.getTime()) / (1000 * 60 * 60));
                    const escrowTimeLeft = Math.max(0, 48 - hoursAgo);

                    return (
                      <div
                        key={order.id}
                        className="p-4 rounded-xl border border-border bg-card"
                      >
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm text-muted-foreground">
                                #{order.order_number}
                              </span>
                              <Badge
                                variant="outline"
                                className={statusColors[order.status] || statusColors.pending}
                              >
                                {order.status === "pending" ? "In Escrow" : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="space-y-1">
                              {items.map((item) => {
                                const listing = listings.find((l) => l.id === item.listing_id);
                                return (
                                  <p key={item.id} className="font-semibold">
                                    {listing?.title || "Unknown Item"} x{item.quantity}
                                  </p>
                                );
                              })}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Delivered to: {order.full_name}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">₹{Number(order.total_amount).toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">
                              {orderDate.toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {order.status === "pending" && escrowTimeLeft > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-muted-foreground flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                Escrow Protection
                              </span>
                              <span className="font-medium">
                                {escrowTimeLeft}h remaining
                              </span>
                            </div>
                            <Progress value={(escrowTimeLeft / 48) * 100} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-2">
                              Verify your account details before the escrow period ends
                            </p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          {order.status === "pending" ? (
                            <>
                              <Button size="sm" variant="outline" onClick={() => toast.info("Credentials will be available after payment confirmation")}>
                                <Eye className="h-4 w-4 mr-1" />
                                View Credentials
                              </Button>
                              <Button size="sm" onClick={() => toast.success("Order confirmed!")}>
                                Confirm Receipt
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button size="sm" variant="outline" onClick={() => toast.info("Download feature coming soon!")}>
                                <Download className="h-4 w-4 mr-1" />
                                Download Details
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => toast.info("Contact feature coming soon!")}>
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Contact Seller
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
