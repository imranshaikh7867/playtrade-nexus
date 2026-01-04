import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, BadgeCheck, Shield, Clock, ShoppingCart, Gavel, Heart, Share2, MessageCircle, Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { listings } from "@/data/mockData";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

function getTimeRemaining(endDate: Date) {
  const total = endDate.getTime() - Date.now();
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const seconds = Math.floor((total / 1000) % 60);
  return `${hours}h ${minutes}m ${seconds}s`;
}

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const listing = listings.find((l) => l.id === id) || listings[0];
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setIsAdding(true);
    await addToCart(listing.id);
    setIsAdding(false);
  };

  const handleBuyNow = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setIsAdding(true);
    await addToCart(listing.id);
    setIsAdding(false);
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-8">
          {/* Breadcrumb */}
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Marketplace
          </Link>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                {listing.isFeatured && (
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                    Featured
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => toast.success("Saved to favorites!")}>
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied!");
                }}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => toast.info("Contact feature coming soon!")}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>

            {/* Details Section */}
            <div>
              <Badge variant="secondary" className="mb-3">
                {listing.game}
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold mb-4">{listing.title}</h1>

              {/* Seller Info */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 mb-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {listing.seller.name[0]}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{listing.seller.name}</span>
                    {listing.seller.verified && (
                      <BadgeCheck className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                      {listing.seller.rating}
                    </span>
                    <span>{listing.seller.sales} sales</span>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold">Account Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <span className="text-sm text-muted-foreground">Level</span>
                    <p className="font-semibold">{listing.level}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <span className="text-sm text-muted-foreground">Rank</span>
                    <p className="font-semibold">{listing.rank}</p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">What's Included</h3>
                <div className="flex flex-wrap gap-2">
                  {listing.features.map((feature) => (
                    <Badge key={feature} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Price & Auction */}
              {listing.isAuction && listing.endsAt ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-destructive">
                    <Clock className="h-5 w-5" />
                    <span className="font-semibold">
                      Ends in: {getTimeRemaining(listing.endsAt)}
                    </span>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <span className="text-sm text-muted-foreground">Current Bid</span>
                    <p className="text-3xl font-bold text-primary">
                      ₹{listing.currentBid?.toLocaleString()}
                    </p>
                  </div>
                  <Link to="/auctions">
                    <Button size="lg" className="w-full glow-primary-sm">
                      <Gavel className="h-5 w-5 mr-2" />
                      Place Bid
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold">
                      ₹{listing.price.toLocaleString()}
                    </span>
                    {listing.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        ₹{listing.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      size="lg"
                      variant="outline"
                      className="flex-1"
                      onClick={handleAddToCart}
                      disabled={isAdding}
                    >
                      {isAdding ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <ShoppingCart className="h-5 w-5 mr-2" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                    <Button
                      size="lg"
                      className="flex-1 glow-primary-sm"
                      onClick={handleBuyNow}
                      disabled={isAdding}
                    >
                      {isAdding ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        "Buy Now"
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Trust Badges */}
              <div className="mt-6 p-4 rounded-lg border border-primary/20 bg-primary/5">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Shield className="h-5 w-5" />
                  <span className="font-semibold">Buyer Protection</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your payment is held securely until you confirm account details. 
                  48-hour protection on all purchases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
