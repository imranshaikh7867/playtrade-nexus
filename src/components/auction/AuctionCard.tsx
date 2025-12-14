import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, BadgeCheck, Gavel, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AuctionTimer } from "./AuctionTimer";
import { BidDialog } from "./BidDialog";
import { WinnerAnnouncement } from "./WinnerAnnouncement";
import { useAuctionBidding } from "@/hooks/useAuctionBidding";

interface Listing {
  id: string;
  game: string;
  title: string;
  level: number;
  rank: string;
  price: number;
  seller: {
    name: string;
    rating: number;
    verified: boolean;
    sales: number;
  };
  image: string;
  features: string[];
  currentBid?: number;
  endsAt?: Date;
  isFeatured?: boolean;
}

interface AuctionCardProps {
  listing: Listing;
  className?: string;
}

export function AuctionCard({ listing, className }: AuctionCardProps) {
  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  const auction = useAuctionBidding(listing.currentBid || listing.price, listing.id);

  // Simulate competing bids randomly
  useEffect(() => {
    if (auction.isEnded) return;
    
    const interval = setInterval(() => {
      // 10% chance of a competing bid every 15 seconds
      if (Math.random() < 0.1) {
        auction.simulateCompetingBid();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [auction.isEnded]);

  const handleAuctionEnd = () => {
    auction.endAuction();
  };

  const isUserWinner = auction.winner?.bidder === "You";

  return (
    <>
      <div className={cn("gaming-card overflow-hidden", className)}>
        {/* Image */}
        <Link to={`/listing/${listing.id}`}>
          <div className="relative aspect-[4/3] overflow-hidden group">
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
                  Hot 🔥
                </Badge>
              )}
            </div>

            {/* Live indicator */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              LIVE
            </div>
          </div>
        </Link>

        {/* Content */}
        <div className="p-4 space-y-4">
          <Link to={`/listing/${listing.id}`}>
            <h3 className="font-semibold text-sm line-clamp-1 hover:text-primary transition-colors">
              {listing.title}
            </h3>
          </Link>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Level {listing.level}</span>
            <span>•</span>
            <span>{listing.rank}</span>
          </div>

          {/* Seller Info */}
          <div className="flex items-center gap-2">
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

          {/* Auction Status */}
          {auction.isEnded && auction.winner ? (
            <WinnerAnnouncement 
              winner={auction.winner} 
              listingTitle={listing.title}
              isCurrentUser={isUserWinner}
            />
          ) : (
            <>
              {/* Timer */}
              <div className="pt-2">
                <p className="text-xs text-muted-foreground mb-2">Ends in:</p>
                <AuctionTimer 
                  endDate={listing.endsAt!} 
                  size="sm"
                  onExpired={handleAuctionEnd}
                />
              </div>

              {/* Current Bid & Stats */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Current Bid</p>
                  <div className="flex items-center gap-1">
                    <Gavel className="h-4 w-4 text-primary" />
                    <span className="font-bold text-lg">₹{auction.currentBid.toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    {auction.bidCount} bids
                  </div>
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <TrendingUp className="h-3 w-3" />
                    +₹{(auction.currentBid - (listing.currentBid || listing.price)).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Bid Button */}
              <Button 
                className="w-full gap-2" 
                onClick={() => setBidDialogOpen(true)}
              >
                <Gavel className="h-4 w-4" />
                Place Bid
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Bid Dialog */}
      <BidDialog
        open={bidDialogOpen}
        onOpenChange={setBidDialogOpen}
        currentBid={auction.currentBid}
        listingTitle={listing.title}
        onPlaceBid={(amount) => auction.placeBid(amount, "You")}
      />
    </>
  );
}
