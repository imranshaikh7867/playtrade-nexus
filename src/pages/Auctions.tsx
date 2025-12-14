import { Clock, Gavel, Trophy, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GameCard } from "@/components/cards/GameCard";
import { Badge } from "@/components/ui/badge";
import { listings } from "@/data/mockData";

const auctionListings = listings.filter((l) => l.isAuction);

export default function Auctions() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
          <div className="container">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary">
                <Gavel className="h-6 w-6 text-primary-foreground" />
              </div>
              <Badge variant="secondary" className="text-sm">
                <Clock className="h-3 w-3 mr-1" />
                Live Now
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Live Auctions
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Bid on rare and premium game accounts. Don't miss out on 
              exclusive deals - auctions end soon!
            </p>

            {/* Stats */}
            <div className="flex gap-8 mt-8">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                <span className="text-sm">
                  <strong>{auctionListings.length}</strong> Active Auctions
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-sm">
                  <strong>₹2.5L+</strong> Total Bids Today
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Auctions Grid */}
        <section className="container py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold">
              Ending Soon
            </h2>
            <Badge variant="outline" className="text-destructive border-destructive">
              <Clock className="h-3 w-3 mr-1" />
              Limited Time
            </Badge>
          </div>

          {auctionListings.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {auctionListings.map((listing) => (
                <GameCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Gavel className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No active auctions</h2>
              <p className="text-muted-foreground">
                Check back later for new auction listings
              </p>
            </div>
          )}
        </section>

        {/* How It Works */}
        <section className="bg-muted/30 py-16">
          <div className="container">
            <h2 className="text-2xl font-bold text-center mb-10">
              How Auctions Work
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  1
                </div>
                <h3 className="font-semibold mb-2">Find an Auction</h3>
                <p className="text-sm text-muted-foreground">
                  Browse live auctions and find accounts you're interested in
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  2
                </div>
                <h3 className="font-semibold mb-2">Place Your Bid</h3>
                <p className="text-sm text-muted-foreground">
                  Enter your maximum bid amount. You'll only pay what's needed to win
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  3
                </div>
                <h3 className="font-semibold mb-2">Win & Claim</h3>
                <p className="text-sm text-muted-foreground">
                  If you win, complete payment and receive account details securely
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
