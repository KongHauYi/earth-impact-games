import { Link } from "react-router-dom";

const games = [
  { path: "/carbonasium", emoji: "🏭", title: "Carbonasium", desc: "How bad is YOUR carbon footprint? Take the quiz." },
  { path: "/trash-project", emoji: "🗑️", title: "TrashProject", desc: "1 click = 1 rubbish in the ocean. Reach 1 million together." },
  { path: "/deforestation", emoji: "🌳", title: "Deforestation", desc: "Plant vs Cut. Which side are you on?" },
  { path: "/endangered", emoji: "🦏", title: "Endangered", desc: "Meet the animals we're losing. Learn why." },
  { path: "/secondly-rubbishly", emoji: "⏱️", title: "SecondlyRubbishly", desc: "Watch rubbish pile up in real-time. It's horrifying." },
  { path: "/flight-radar-co2", emoji: "✈️", title: "FlightRadarCO2", desc: "Planes are flying. CO2 is rising." },
  { path: "/element-star", emoji: "⭐", title: "ElementStar", desc: "Rate your favourite greenhouse gases. Yes, really." },
  { path: "/rocket-carbon", emoji: "🚀", title: "RocketCarbon", desc: "Launch rockets. Watch CO2 skyrocket." },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="py-16 text-center">
        <h1 className="font-display text-6xl font-bold tracking-tight text-primary mb-3">
          envon
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Small games about our big planet. Explore, play, and maybe feel a little guilty.
        </p>
      </header>

      <main className="container max-w-4xl pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {games.map((game, i) => (
            <Link
              key={game.path}
              to={game.path}
              className="game-card group"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className="animate-fade-in" style={{ animationDelay: `${i * 0.07}s` }}>
                <span className="text-3xl mb-3 block">{game.emoji}</span>
                <h2 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {game.title}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">{game.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="text-center pb-8 text-sm text-muted-foreground">
        inspired by neal.fun · built for the planet 🌍
      </footer>
    </div>
  );
};

export default Index;
