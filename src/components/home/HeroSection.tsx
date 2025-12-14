import { Link } from "react-router-dom";
import { ArrowRight, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
      </div>

      {/* Content */}
      <div className="container relative z-10 py-20">
        <div className="max-w-2xl">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium mb-6">
            <Shield className="h-4 w-4 text-primary" />
            <span>Trusted by 50,000+ Gamers</span>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Buy & Sell Game IDs{" "}
            <span className="text-gradient">Safely</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl">
            India's #1 marketplace for gaming accounts. Escrow-style protection, 
            verified sellers, and 48-hour buyer guarantee on every transaction.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/marketplace">
              <Button size="lg" className="w-full sm:w-auto glow-primary-sm">
                Browse Marketplace
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/seller-dashboard">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sell Your Game ID
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-12 border-t border-border/50">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-primary">₹10Cr+</div>
              <div className="text-sm text-muted-foreground">Traded Volume</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-primary">25K+</div>
              <div className="text-sm text-muted-foreground">Successful Trades</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-primary">4.9★</div>
              <div className="text-sm text-muted-foreground">User Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
