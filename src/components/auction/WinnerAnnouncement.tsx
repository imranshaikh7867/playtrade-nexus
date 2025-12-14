import { Trophy, PartyPopper, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Bid } from "@/hooks/useAuctionBidding";

interface WinnerAnnouncementProps {
  winner: Bid;
  listingTitle: string;
  isCurrentUser?: boolean;
}

export function WinnerAnnouncement({ winner, listingTitle, isCurrentUser }: WinnerAnnouncementProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border-2 border-primary/50 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6">
      {/* Decorative elements */}
      <div className="absolute -top-4 -right-4 text-8xl opacity-10">🎉</div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-full bg-primary text-primary-foreground">
            <Trophy className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-lg">Auction Ended!</h3>
        </div>

        <div className="space-y-4">
          <div className="text-center py-4">
            {isCurrentUser ? (
              <>
                <PartyPopper className="h-12 w-12 mx-auto text-primary mb-3" />
                <h4 className="text-2xl font-bold text-primary">Congratulations!</h4>
                <p className="text-muted-foreground mt-1">You won this auction!</p>
              </>
            ) : (
              <>
                <h4 className="text-lg font-semibold">Winner</h4>
                <p className="text-2xl font-bold text-primary">{winner.bidder}</p>
              </>
            )}
          </div>

          <div className="bg-background/80 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Item</span>
              <span className="font-medium">{listingTitle}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Winning Bid</span>
              <span className="font-bold text-primary">₹{winner.amount.toLocaleString()}</span>
            </div>
          </div>

          {isCurrentUser && (
            <Button className="w-full" size="lg">
              Complete Purchase
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
