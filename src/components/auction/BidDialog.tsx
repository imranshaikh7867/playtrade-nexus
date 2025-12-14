import { useState } from "react";
import { Gavel, TrendingUp, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface BidDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBid: number;
  listingTitle: string;
  onPlaceBid: (amount: number) => { success: boolean; message: string };
}

export function BidDialog({
  open,
  onOpenChange,
  currentBid,
  listingTitle,
  onPlaceBid,
}: BidDialogProps) {
  const { toast } = useToast();
  const minimumBid = currentBid + 100;
  const [bidAmount, setBidAmount] = useState(minimumBid);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const quickBidAmounts = [
    { label: "+₹100", value: currentBid + 100 },
    { label: "+₹500", value: currentBid + 500 },
    { label: "+₹1000", value: currentBid + 1000 },
  ];

  const handleSubmit = () => {
    if (bidAmount < minimumBid) {
      toast({
        variant: "destructive",
        title: "Invalid bid amount",
        description: `Minimum bid is ₹${minimumBid.toLocaleString()}`,
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate network delay
    setTimeout(() => {
      const result = onPlaceBid(bidAmount);
      
      if (result.success) {
        toast({
          title: "Bid placed!",
          description: `You've bid ₹${bidAmount.toLocaleString()} on ${listingTitle}`,
        });
        onOpenChange(false);
      } else {
        toast({
          variant: "destructive",
          title: "Bid failed",
          description: result.message,
        });
      }
      
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gavel className="h-5 w-5 text-primary" />
            Place Your Bid
          </DialogTitle>
          <DialogDescription>
            {listingTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current Bid Display */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Current Highest Bid</p>
              <p className="text-2xl font-bold">₹{currentBid.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>

          {/* Quick Bid Buttons */}
          <div className="flex gap-2">
            {quickBidAmounts.map((option) => (
              <Button
                key={option.label}
                variant={bidAmount === option.value ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setBidAmount(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>

          {/* Custom Bid Input */}
          <div className="space-y-2">
            <Label htmlFor="bid-amount">Your Bid Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                ₹
              </span>
              <Input
                id="bid-amount"
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                className="pl-8"
                min={minimumBid}
                step={100}
              />
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Minimum bid: ₹{minimumBid.toLocaleString()}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || bidAmount < minimumBid}>
            {isSubmitting ? "Placing bid..." : `Place Bid - ₹${bidAmount.toLocaleString()}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
