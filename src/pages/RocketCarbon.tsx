import { useState, useRef, useEffect } from "react";
import GameLayout from "@/components/GameLayout";
import { Button } from "@/components/ui/button";

interface Rocket {
  id: number;
  x: number;
  co2: number;
}

const RocketCarbon = () => {
  const [totalCO2, setTotalCO2] = useState(0);
  const [rockets, setRockets] = useState<Rocket[]>([]);
  const [lastCO2, setLastCO2] = useState(0);
  const idRef = useRef(0);

  const launch = () => {
    const co2 = Math.floor(Math.random() * (76000 - 2800) + 2800);
    const id = idRef.current++;
    const x = 20 + Math.random() * 60;
    setRockets(prev => [...prev, { id, x, co2 }]);
    setTotalCO2(prev => prev + co2);
    setLastCO2(co2);
    setTimeout(() => setRockets(prev => prev.filter(r => r.id !== id)), 1200);
  };

  return (
    <GameLayout title="RocketCarbon" emoji="🚀">
      <div className="max-w-xl mx-auto text-center relative min-h-[60vh]">
        <h2 className="font-display text-3xl font-bold mb-2">Launch Rockets</h2>
        <p className="text-muted-foreground mb-8">Every launch = thousands of tonnes of CO₂</p>

        <div className="text-5xl font-display font-bold text-destructive tabular-nums mb-2">
          {totalCO2.toLocaleString()}
        </div>
        <p className="text-sm text-muted-foreground mb-2">tonnes CO₂ total</p>
        {lastCO2 > 0 && (
          <p className="text-sm text-accent font-medium mb-6 animate-fade-in" key={totalCO2}>
            +{lastCO2.toLocaleString()} tonnes
          </p>
        )}

        <Button onClick={launch} size="lg" className="text-lg px-10 py-6">
          🚀 Launch!
        </Button>

        {/* Flying rockets */}
        {rockets.map(r => (
          <span
            key={r.id}
            className="animate-rocket-launch fixed text-4xl pointer-events-none"
            style={{ left: `${r.x}%`, bottom: "20%" }}
          >
            🚀
          </span>
        ))}

        <div className="mt-10 bg-card border border-border rounded-2xl p-4 text-sm text-muted-foreground">
          <p>A single SpaceX Falcon 9 launch produces ~336 tonnes of CO₂.</p>
          <p className="mt-1">A Saturn V (Apollo missions) produced ~76,000 tonnes.</p>
        </div>
      </div>
    </GameLayout>
  );
};

export default RocketCarbon;
