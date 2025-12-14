import { Link } from "react-router-dom";
import { Star, ShoppingCart, BadgeCheck, Clock, Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Listing {
  id: string;
  game: string;
  title: string;
  level: number;
  rank: string;
  price: number;
  originalPrice?: number;
  seller: {
    name: string;
    rating: number;
    verified: boolean;
    sales: number;
  };
  image: string;
  features: string[];
  isAuction?: boolean;
  currentBid?: number;
  endsAt?: Date;
  isFeatured?: boolean;
}

interface GameCardProps {
  listing: Listing;
  className?: string;
}

function getTimeRemaining(endDate: Date) {
  const total = endDate.getTime() - Date.now();
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  return `${hours}h ${minutes}m`;
}

export function GameCard({ listing, className }: GameCardProps) {
  return (
    <Link to={`/listing/${listing.id}`}>
      <div
        className={cn(
          "group gaming-card overflow-hidden cursor-pointer",
          className
        )}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={listing.image}
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
              {listing.game}
            </Badge>
            {listing.isFeatured && (
              <Badge className="bg-primary text-primary-foreground">
                Featured
              </Badge>
            )}
          </div>

          {/* Auction Timer */}
          {listing.isAuction && listing.endsAt && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-destructive/90 text-destructive-foreground px-2 py-1 rounded-md text-xs font-medium backdrop-blur-sm">
              <Clock className="h-3 w-3" />
              {getTimeRemaining(listing.endsAt)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
            {listing.title}
          </h3>
          
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <span>Level {listing.level}</span>
            <span>•</span>
            <span>{listing.rank}</span>
          </div>

          {/* Seller Info */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">{listing.seller.name}</span>
              {listing.seller.verified && (
                <BadgeCheck className="h-3.5 w-3.5 text-primary" />
              )}
            </div>
            <div className="flex items-center gap-0.5 text-xs">
              <Star className="h-3 w-3 fill-primary text-primary" />
              <span className="font-medium">{listing.seller.rating}</span>
            </div>
          </div>

          {/* Price & Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div>
              {listing.isAuction ? (
                <div className="flex items-center gap-1">
                  <Gavel className="h-4 w-4 text-primary" />
                  <span className="font-bold text-lg">₹{listing.currentBid?.toLocaleString()}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">₹{listing.price.toLocaleString()}</span>
                  {listing.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{listing.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              )}
            </div>
            <Button
              size="sm"
              variant={listing.isAuction ? "outline" : "default"}
              className="gap-1"
              onClick={(e) => {
                e.preventDefault();
                // Mock add to cart
              }}
            >
              {listing.isAuction ? (
                <>
                  <Gavel className="h-3.5 w-3.5" />
                  Bid
                </>
              ) : (
                <>
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Add
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
