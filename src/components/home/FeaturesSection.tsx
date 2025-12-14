import { FeatureCard } from "@/components/cards/FeatureCard";
import { features } from "@/data/mockData";

export function FeaturesSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Why Choose PlayTrade?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We've built the safest platform for trading game accounts with 
            industry-leading security features
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
