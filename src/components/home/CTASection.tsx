import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-[hsl(40_100%_50%)] p-8 md:p-12">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-primary-foreground rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-primary-foreground rounded-full translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-primary-foreground/80 text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4" />
                Start earning today
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                Have Game Accounts to Sell?
              </h2>
              <p className="text-primary-foreground/80 max-w-md">
                Join thousands of sellers on PlayTrade. List your accounts in minutes 
                and reach millions of buyers.
              </p>
            </div>
            <Link to="/seller-dashboard">
              <Button
                size="lg"
                variant="secondary"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                Start Selling
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
