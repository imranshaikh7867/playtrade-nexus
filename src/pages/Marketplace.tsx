import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GameCard } from "@/components/cards/GameCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { games, listings } from "@/data/mockData";

export default function Marketplace() {
  const [search, setSearch] = useState("");
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [showAuctionsOnly, setShowAuctionsOnly] = useState(false);

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.title.toLowerCase().includes(search.toLowerCase()) ||
      listing.game.toLowerCase().includes(search.toLowerCase());
    const matchesGame = selectedGames.length === 0 || selectedGames.includes(listing.gameId);
    const matchesPrice = listing.price >= priceRange[0] && listing.price <= priceRange[1];
    const matchesAuction = !showAuctionsOnly || listing.isAuction;
    return matchesSearch && matchesGame && matchesPrice && matchesAuction;
  });

  const toggleGame = (gameId: string) => {
    setSelectedGames((prev) =>
      prev.includes(gameId) ? prev.filter((g) => g !== gameId) : [...prev, gameId]
    );
  };

  const clearFilters = () => {
    setSelectedGames([]);
    setPriceRange([0, 50000]);
    setShowAuctionsOnly(false);
    setSearch("");
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Games Filter */}
      <div>
        <h3 className="font-semibold mb-3">Games</h3>
        <div className="space-y-2">
          {games.map((game) => (
            <label
              key={game.id}
              className="flex items-center gap-3 cursor-pointer"
            >
              <Checkbox
                checked={selectedGames.includes(game.id)}
                onCheckedChange={() => toggleGame(game.id)}
              />
              <span className="text-sm">{game.icon} {game.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={50000}
          step={1000}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>₹{priceRange[0].toLocaleString()}</span>
          <span>₹{priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      {/* Auction Filter */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <Checkbox
            checked={showAuctionsOnly}
            onCheckedChange={(checked) => setShowAuctionsOnly(checked as boolean)}
          />
          <span className="text-sm">Auctions Only</span>
        </label>
      </div>

      <Button variant="outline" className="w-full" onClick={clearFilters}>
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
            <p className="text-muted-foreground">
              Browse {listings.length}+ verified game accounts
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search games, accounts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Active Filters */}
          {(selectedGames.length > 0 || showAuctionsOnly) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedGames.map((gameId) => {
                const game = games.find((g) => g.id === gameId);
                return (
                  <Badge
                    key={gameId}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => toggleGame(gameId)}
                  >
                    {game?.name}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                );
              })}
              {showAuctionsOnly && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => setShowAuctionsOnly(false)}
                >
                  Auctions Only
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
            </div>
          )}

          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 p-4 rounded-xl border border-border bg-card">
                <FilterContent />
              </div>
            </aside>

            {/* Listings Grid */}
            <div className="flex-1">
              {filteredListings.length > 0 ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredListings.map((listing) => (
                    <GameCard key={listing.id} listing={listing} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground mb-4">No listings found</p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
