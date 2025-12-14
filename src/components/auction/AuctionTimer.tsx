import { useAuctionTimer } from "@/hooks/useAuctionTimer";
import { cn } from "@/lib/utils";

interface AuctionTimerProps {
  endDate: Date;
  onExpired?: () => void;
  size?: "sm" | "md" | "lg";
}

export function AuctionTimer({ endDate, onExpired, size = "md" }: AuctionTimerProps) {
  const time = useAuctionTimer(endDate);

  // Trigger onExpired callback when timer expires
  if (time.isExpired && onExpired) {
    onExpired();
  }

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className={cn(
      "flex flex-col items-center",
      size === "sm" && "min-w-[40px]",
      size === "md" && "min-w-[56px]",
      size === "lg" && "min-w-[72px]"
    )}>
      <div className={cn(
        "bg-card border border-border rounded-lg font-mono font-bold flex items-center justify-center",
        size === "sm" && "text-lg px-2 py-1",
        size === "md" && "text-2xl px-3 py-2",
        size === "lg" && "text-4xl px-4 py-3",
        time.total < 300000 && "text-destructive border-destructive/50 animate-pulse"
      )}>
        {String(value).padStart(2, "0")}
      </div>
      <span className={cn(
        "text-muted-foreground uppercase tracking-wide mt-1",
        size === "sm" && "text-[10px]",
        size === "md" && "text-xs",
        size === "lg" && "text-sm"
      )}>
        {label}
      </span>
    </div>
  );

  if (time.isExpired) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-destructive/10 text-destructive rounded-lg font-semibold",
        size === "sm" && "px-3 py-2 text-sm",
        size === "md" && "px-4 py-3 text-base",
        size === "lg" && "px-6 py-4 text-lg"
      )}>
        Auction Ended
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {time.days > 0 && <TimeBlock value={time.days} label="Days" />}
      <TimeBlock value={time.hours} label="Hours" />
      <span className={cn(
        "font-bold text-muted-foreground",
        size === "lg" && "text-2xl",
        time.total < 300000 && "text-destructive animate-pulse"
      )}>:</span>
      <TimeBlock value={time.minutes} label="Mins" />
      <span className={cn(
        "font-bold text-muted-foreground",
        size === "lg" && "text-2xl",
        time.total < 300000 && "text-destructive animate-pulse"
      )}>:</span>
      <TimeBlock value={time.seconds} label="Secs" />
    </div>
  );
}
