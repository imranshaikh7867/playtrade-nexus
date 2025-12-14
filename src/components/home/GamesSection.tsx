import { Link } from "react-router-dom";
import { games } from "@/data/mockData";

export function GamesSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Popular Games</h2>
          <p className="text-muted-foreground">
            Browse accounts from your favorite games
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {games.map((game) => (
            <Link
              key={game.id}
              to={`/marketplace?game=${game.id}`}
              className="group p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 text-center"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {game.icon}
              </div>
              <span className="font-medium text-sm group-hover:text-primary transition-colors">
                {game.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
