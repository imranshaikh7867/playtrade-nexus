import { formatDistanceToNow } from "date-fns";
import { Trophy, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Bid } from "@/hooks/useAuctionBidding";

interface BidHistoryProps {
  bids: Bid[];
  maxHeight?: string;
}

export function BidHistory({ bids, maxHeight = "300px" }: BidHistoryProps) {
  if (bids.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No bids yet. Be the first to bid!
      </div>
    );
  }

  return (
    <ScrollArea className="pr-4" style={{ maxHeight }}>
      <div className="space-y-3">
        {bids.map((bid, index) => (
          <div
            key={bid.id}
            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
              bid.isWinning
                ? "bg-primary/5 border-primary/30"
                : "bg-muted/30 border-border"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                bid.isWinning ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}>
                {bid.isWinning ? (
                  <Trophy className="h-4 w-4" />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{bid.bidder}</span>
                  {bid.isWinning && (
                    <Badge variant="default" className="text-[10px] px-1.5 py-0">
                      Highest
                    </Badge>
                  )}
                  {bid.bidder === "You" && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      Your Bid
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(bid.timestamp, { addSuffix: true })}
                </span>
              </div>
            </div>
            <span className={`font-bold ${bid.isWinning ? "text-primary" : ""}`}>
              ₹{bid.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
