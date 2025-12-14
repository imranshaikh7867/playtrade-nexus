import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/cards/GameCard";
import { listings } from "@/data/mockData";

export function FeaturedListings() {
  const featuredListings = listings.filter((l) => l.isFeatured).slice(0, 4);

  return (
    <section className="py-16">
      <div className="container">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Listings</h2>
            <p className="text-muted-foreground">
              Hand-picked premium accounts from verified sellers
            </p>
          </div>
          <Link to="/marketplace" className="hidden sm:block">
            <Button variant="outline">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredListings.map((listing) => (
            <GameCard key={listing.id} listing={listing} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link to="/marketplace">
            <Button>
              View All Listings
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
