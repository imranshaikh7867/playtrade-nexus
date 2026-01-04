import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, Package, ArrowRight, Home } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { listings } from "@/data/mockData";

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

export default function OrderSuccess() {
  const { orderNumber } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && orderNumber) {
      fetchOrder();
    }
  }, [user, orderNumber]);

  const fetchOrder = async () => {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("order_number", orderNumber)
        .eq("user_id", user!.id)
        .maybeSingle();

      if (orderError) throw orderError;

      if (orderData) {
        setOrder(orderData);

        const { data: itemsData, error: itemsError } = await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", orderData.id);

        if (itemsError) throw itemsError;
        setOrderItems(itemsData || []);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="h-16 w-16 bg-muted rounded-full mx-auto mb-4"></div>
            <div className="h-6 w-48 bg-muted rounded mx-auto"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Order not found</h2>
            <Link to="/">
              <Button>Go Home</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-8 max-w-2xl">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-4">
              <CheckCircle className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Placed!</h1>
            <p className="text-muted-foreground">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="p-6 rounded-xl border border-border bg-card mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Order Details
              </h2>
              <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Order Number</span>
                <span className="font-medium">{order.order_number}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date</span>
                <span>{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Method</span>
                <span>Cash on Delivery</span>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Delivery Info */}
            <div className="mb-4">
              <h3 className="font-medium mb-2">Delivery Information</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>{order.full_name}</p>
                <p>{order.phone}</p>
                <p>{order.address}</p>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Order Items */}
            <div className="mb-4">
              <h3 className="font-medium mb-3">Items Ordered</h3>
              <div className="space-y-3">
                {orderItems.map((item) => {
                  const listing = listings.find((l) => l.id === item.listing_id);
                  if (!listing) return null;
                  return (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">
                          {listing.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-medium">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{Number(order.total_amount).toLocaleString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Link to="/buyer-dashboard" className="flex-1">
              <Button variant="outline" className="w-full">
                View My Orders
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/" className="flex-1">
              <Button className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
