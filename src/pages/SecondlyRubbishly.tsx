import { useState, useEffect, useRef } from "react";
import GameLayout from "@/components/GameLayout";

const RATE = 17.35; // kg per 0.5 seconds
const ELEPHANT_KG = 6000;
const CAR_KG = 1400;
const PLANE_KG = 41000;
const WHALE_KG = 150000;

const SecondlyRubbishly = () => {
  const [kg, setKg] = useState(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime.current) / 500; // number of 0.5s intervals
      setKg(elapsed * RATE);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const conversions = [
    { label: "kilograms", value: kg, unit: "kg" },
    { label: "tonnes", value: kg / 1000, unit: "t" },
    { label: "elephants", value: kg / ELEPHANT_KG, unit: "🐘" },
    { label: "cars", value: kg / CAR_KG, unit: "🚗" },
    { label: "planes", value: kg / PLANE_KG, unit: "✈️" },
    { label: "blue whales", value: kg / WHALE_KG, unit: "🐋" },
  ];

  return (
    <GameLayout title="SecondlyRubbishly" emoji="⏱️">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="font-display text-3xl font-bold mb-2">Rubbish thrown away since you opened this page</h2>
        <p className="text-muted-foreground mb-10">Watch it pile up. In real-time.</p>

        <div className="text-7xl font-display font-bold text-destructive tabular-nums mb-2">
          {kg.toFixed(1)}
        </div>
        <div className="text-lg text-muted-foreground mb-10">kilograms</div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {conversions.slice(1).map((c) => (
            <div key={c.label} className="bg-card border border-border rounded-2xl p-4">
              <div className="text-2xl mb-1">{c.unit}</div>
              <div className="font-display font-bold text-lg tabular-nums">
                {c.value < 0.01 ? c.value.toExponential(1) : c.value.toFixed(c.value < 1 ? 3 : 1)}
              </div>
              <div className="text-xs text-muted-foreground">{c.label}</div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-sm text-muted-foreground">
          Based on an estimated 2.12 billion tonnes of waste per year globally.
        </p>
      </div>
    </GameLayout>
  );
};

export default SecondlyRubbishly;
