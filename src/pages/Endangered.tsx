import GameLayout from "@/components/GameLayout";

const animals = [
  {
    name: "Amur Leopard",
    emoji: "🐆",
    status: "Critically Endangered",
    population: "~120",
    why: "Habitat loss from logging, roads, and encroaching civilization. Also hunted for their beautiful spotted fur.",
    facts: ["Can run at speeds of up to 37 mph", "Can leap more than 19 feet horizontally", "They are solitary creatures"],
  },
  {
    name: "Sumatran Orangutan",
    emoji: "🦧",
    status: "Critically Endangered",
    population: "~14,000",
    why: "Massive deforestation for palm oil plantations has destroyed 80% of their habitat in 20 years.",
    facts: ["Share 96.4% of our DNA", "Use tools to eat and build shelters", "A mother stays with her baby for 7 years"],
  },
  {
    name: "Javan Rhino",
    emoji: "🦏",
    status: "Critically Endangered",
    population: "~76",
    why: "Poaching for their horns (used in traditional medicine) and habitat loss.",
    facts: ["Only found in one national park in Java", "Their horn can sell for $30,000/kg", "They are excellent swimmers"],
  },
  {
    name: "Hawksbill Turtle",
    emoji: "🐢",
    status: "Critically Endangered",
    population: "~25,000 nesting females",
    why: "Killed for their beautiful shells, and their nesting beaches are being destroyed by development.",
    facts: ["They can't retract into their shells", "They eat toxic sponges", "Can live over 50 years"],
  },
  {
    name: "Mountain Gorilla",
    emoji: "🦍",
    status: "Endangered",
    population: "~1,000",
    why: "Habitat destruction, poaching, and disease from human contact.",
    facts: ["DNA is 98% identical to humans", "Males can weigh up to 430 lbs", "They laugh when tickled"],
  },
  {
    name: "Vaquita",
    emoji: "🐬",
    status: "Critically Endangered",
    population: "~10",
    why: "Accidentally caught in gillnets set for shrimp and fish. The world's rarest marine mammal.",
    facts: ["Discovered only in 1958", "Found only in the Gulf of California", "They are shy and avoid boats"],
  },
  {
    name: "Snow Leopard",
    emoji: "🐆",
    status: "Vulnerable",
    population: "~4,000-6,500",
    why: "Climate change is shrinking their mountain habitat. Also killed by farmers protecting livestock.",
    facts: ["Can't roar — they purr!", "Their tails are nearly as long as their bodies", "Can leap 50 feet in a single bound"],
  },
  {
    name: "Blue Whale",
    emoji: "🐋",
    status: "Endangered",
    population: "~10,000-25,000",
    why: "Nearly hunted to extinction by commercial whaling. Now threatened by ship strikes and ocean noise.",
    facts: ["Largest animal to ever exist", "Heart is the size of a small car", "Their tongue weighs as much as an elephant"],
  },
  {
    name: "Pangolin",
    emoji: "🦔",
    status: "Critically Endangered",
    population: "Unknown (declining rapidly)",
    why: "Most trafficked mammal in the world. Hunted for their scales and meat.",
    facts: ["Only mammal covered in scales", "Can consume 70 million ants per year", "They curl into a ball when threatened"],
  },
  {
    name: "Polar Bear",
    emoji: "🐻‍❄️",
    status: "Vulnerable",
    population: "~22,000-31,000",
    why: "Sea ice is melting due to climate change, reducing their hunting grounds for seals.",
    facts: ["Their skin is actually black under white fur", "Can swim for days without rest", "Have an incredible sense of smell — can detect seals 1 mile away"],
  },
];

const Endangered = () => {
  return (
    <GameLayout title="Endangered" emoji="🦏">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl font-bold mb-2 text-center">Endangered Animals</h2>
        <p className="text-muted-foreground text-center mb-8">They need us. We're failing them.</p>

        <div className="space-y-4">
          {animals.map((animal, i) => (
            <div
              key={animal.name}
              className="game-card animate-fade-in"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{animal.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display text-xl font-semibold">{animal.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium">
                      {animal.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Population: {animal.population}</p>
                  <p className="text-sm mt-2"><strong>Why endangered:</strong> {animal.why}</p>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    {animal.facts.map(fact => (
                      <li key={fact}>• {fact}</li>
                    ))}
                  </ul>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(animal.name + " endangered animal")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-sm text-secondary hover:underline"
                  >
                    Learn more →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GameLayout>
  );
};

export default Endangered;
