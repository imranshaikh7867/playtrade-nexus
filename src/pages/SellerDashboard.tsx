import { useState } from "react";
import { Plus, LayoutDashboard, Package, Settings, LogOut, Search, MoreVertical, Eye, Edit, Trash2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { games } from "@/data/mockData";

const mockSellerListings = [
  { id: "1", title: "BGMI Conqueror Account", game: "BGMI", price: 12999, status: "active", views: 234, created: "2024-01-10" },
  { id: "2", title: "Valorant Immortal Acc", game: "Valorant", price: 8499, status: "pending", views: 0, created: "2024-01-12" },
  { id: "3", title: "CoC TH14 Max", game: "Clash of Clans", price: 25000, status: "sold", views: 567, created: "2024-01-05" },
  { id: "4", title: "Free Fire Heroic", game: "Free Fire", price: 5999, status: "in_review", views: 0, created: "2024-01-14" },
];

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Package, label: "My Listings", active: false },
  { icon: Settings, label: "Settings", active: false },
];

const statusColors: Record<string, string> = {
  active: "bg-green-500/10 text-green-600 border-green-500/20",
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  sold: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  in_review: "bg-orange-500/10 text-orange-600 border-orange-500/20",
};

export default function SellerDashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-bold">Seller Dashboard</h1>
                  <p className="text-muted-foreground">Manage your listings and sales</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Listing
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Add New Listing</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label>Game</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a game" />
                          </SelectTrigger>
                          <SelectContent>
                            {games.map((game) => (
                              <SelectItem key={game.id} value={game.id}>
                                {game.icon} {game.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input placeholder="e.g., Level 500 Account with Rare Skins" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Account Level</Label>
                          <Input type="number" placeholder="e.g., 100" />
                        </div>
                        <div className="space-y-2">
                          <Label>Rank</Label>
                          <Input placeholder="e.g., Diamond" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Price (₹)</Label>
                        <Input type="number" placeholder="e.g., 5000" />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea placeholder="Describe your account..." rows={3} />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="flex-1" disabled>
                          Create Listing
                        </Button>
                      </div>
                      <p className="text-xs text-center text-muted-foreground">
                        Form submission is disabled in this demo
                      </p>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Stats */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="p-4 rounded-xl border border-border bg-card">
                  <p className="text-sm text-muted-foreground">Total Listings</p>
                  <p className="text-2xl font-bold">4</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card">
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-green-600">1</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card">
                  <p className="text-sm text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold">801</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card">
                  <p className="text-sm text-muted-foreground">Sold</p>
                  <p className="text-2xl font-bold text-primary">₹25,000</p>
                </div>
              </div>

              {/* Listings Table */}
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h2 className="font-semibold">My Listings</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search..." className="pl-9 w-48" />
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Listing</TableHead>
                      <TableHead>Game</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSellerListings.map((listing) => (
                      <TableRow key={listing.id}>
                        <TableCell className="font-medium">{listing.title}</TableCell>
                        <TableCell>{listing.game}</TableCell>
                        <TableCell>₹{listing.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusColors[listing.status]}>
                            {listing.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>{listing.views}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
