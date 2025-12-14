import { Package, Clock, Shield, Eye, Download, MessageCircle, LayoutDashboard, ShoppingBag, Settings, LogOut } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const mockOrders = [
  {
    id: "ORD001",
    title: "BGMI Conqueror Account",
    game: "BGMI",
    price: 12999,
    status: "escrow",
    escrowTimeLeft: 36,
    seller: "ProGamer123",
    date: "2024-01-14",
  },
  {
    id: "ORD002",
    title: "Valorant Immortal Acc",
    game: "Valorant",
    price: 8499,
    status: "completed",
    seller: "ValorantKing",
    date: "2024-01-10",
  },
  {
    id: "ORD003",
    title: "GTA Online Level 500",
    game: "GTA Online",
    price: 15999,
    status: "completed",
    seller: "GTALegend",
    date: "2024-01-05",
  },
];

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: ShoppingBag, label: "My Orders", active: false },
  { icon: Settings, label: "Settings", active: false },
];

const statusColors: Record<string, string> = {
  escrow: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  completed: "bg-green-500/10 text-green-600 border-green-500/20",
  disputed: "bg-red-500/10 text-red-600 border-red-500/20",
};

export default function BuyerDashboard() {
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
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted">
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
                      <p className="text-xl font-bold">3</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-yellow-500/10">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">In Escrow</p>
                      <p className="text-xl font-bold">1</p>
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
                      <p className="text-xl font-bold">₹37,497</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders */}
              <div className="space-y-4">
                <h2 className="font-semibold text-lg">Recent Orders</h2>
                
                {mockOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-xl border border-border bg-card"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-muted-foreground">
                            #{order.id}
                          </span>
                          <Badge
                            variant="outline"
                            className={statusColors[order.status]}
                          >
                            {order.status === "escrow" ? "In Escrow" : "Completed"}
                          </Badge>
                        </div>
                        <h3 className="font-semibold">{order.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {order.game} • Seller: {order.seller}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{order.price.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{order.date}</p>
                      </div>
                    </div>

                    {order.status === "escrow" && order.escrowTimeLeft && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Escrow Protection
                          </span>
                          <span className="font-medium">
                            {order.escrowTimeLeft}h remaining
                          </span>
                        </div>
                        <Progress value={(order.escrowTimeLeft / 48) * 100} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-2">
                          Verify your account details before the escrow period ends
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {order.status === "escrow" ? (
                        <>
                          <Button size="sm" variant="outline" disabled>
                            <Eye className="h-4 w-4 mr-1" />
                            View Credentials
                          </Button>
                          <Button size="sm" disabled>
                            Confirm Receipt
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Download Details
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Contact Seller
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
