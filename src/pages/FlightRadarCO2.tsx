import { useState, useEffect, useRef } from "react";
import GameLayout from "@/components/GameLayout";

interface Plane {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  progress: number;
  co2Rate: number; // tons per second
}

// Simple world map coordinates (normalized 0-100)
const routes = [
  { from: [22, 35], to: [75, 32] },  // US to Europe
  { from: [75, 35], to: [90, 55] },  // Europe to Southeast Asia
  { from: [22, 35], to: [85, 60] },  // US to Australia
  { from: [55, 25], to: [85, 35] },  // Middle East to East Asia
  { from: [15, 55], to: [55, 30] },  // South America to Middle East
  { from: [75, 30], to: [22, 40] },  // Europe to US (return)
  { from: [85, 35], to: [50, 55] },  // East Asia to Africa
  { from: [50, 55], to: [75, 35] },  // Africa to Europe
  { from: [22, 30], to: [85, 35] },  // US to Japan
  { from: [90, 60], to: [75, 30] },  // Australia to Europe
];

const FlightRadarCO2 = () => {
  const [planes, setPlanes] = useState<Plane[]>([]);
  const [totalCO2, setTotalCO2] = useState(0);
  const idRef = useRef(0);
  const co2Ref = useRef(0);

  useEffect(() => {
    // Spawn initial planes
    const initial: Plane[] = routes.slice(0, 6).map((r, i) => ({
      id: idRef.current++,
      startX: r.from[0], startY: r.from[1],
      endX: r.to[0], endY: r.to[1],
      progress: Math.random() * 0.5,
      co2Rate: 0.8 + Math.random() * 1.2,
    }));
    setPlanes(initial);

    // Animation loop
    const interval = setInterval(() => {
      setPlanes(prev => {
        let co2Delta = 0;
        const updated = prev.map(p => {
          const speed = 0.002 + Math.random() * 0.001;
          const newProgress = p.progress + speed;
          co2Delta += p.co2Rate * 0.05;
          return { ...p, progress: newProgress };
        }).filter(p => p.progress < 1);

        // Respawn planes
        while (updated.length < 6) {
          const r = routes[Math.floor(Math.random() * routes.length)];
          updated.push({
            id: idRef.current++,
            startX: r.from[0], startY: r.from[1],
            endX: r.to[0], endY: r.to[1],
            progress: 0,
            co2Rate: 0.8 + Math.random() * 1.2,
          });
        }

        co2Ref.current += co2Delta;
        return updated;
      });
      setTotalCO2(co2Ref.current);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <GameLayout title="FlightRadarCO2" emoji="✈️">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="font-display text-3xl font-bold mb-2">Flight Radar CO₂</h2>
          <p className="text-muted-foreground">Watch planes fly. Watch CO₂ rise.</p>
        </div>

        <div className="text-center mb-6">
          <span className="text-4xl font-display font-bold text-destructive tabular-nums">
            {totalCO2.toFixed(1)}
          </span>
          <span className="text-lg text-muted-foreground ml-2">tonnes CO₂</span>
        </div>

        {/* Map */}
        <div className="relative bg-card border border-border rounded-2xl overflow-hidden" style={{ paddingBottom: "50%" }}>
          {/* Simple continent outlines using emoji */}
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 text-[10rem] select-none">
            🌍
          </div>

          {/* Continent labels */}
          {[
            { label: "N. America", x: 18, y: 30 },
            { label: "S. America", x: 25, y: 60 },
            { label: "Europe", x: 55, y: 25 },
            { label: "Africa", x: 55, y: 55 },
            { label: "Asia", x: 78, y: 30 },
            { label: "Australia", x: 85, y: 65 },
          ].map(c => (
            <span
              key={c.label}
              className="absolute text-xs text-muted-foreground/40 font-display"
              style={{ left: `${c.x}%`, top: `${c.y}%`, transform: "translate(-50%, -50%)" }}
            >
              {c.label}
            </span>
          ))}

          {/* Flight paths and planes */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {planes.map(p => {
              const x = p.startX + (p.endX - p.startX) * p.progress;
              const y = p.startY + (p.endY - p.startY) * p.progress;
              const angle = Math.atan2(p.endY - p.startY, p.endX - p.startX) * (180 / Math.PI);
              return (
                <g key={p.id}>
                  <line
                    x1={p.startX} y1={p.startY}
                    x2={x} y2={y}
                    stroke="hsl(var(--secondary))"
                    strokeWidth="0.3"
                    strokeDasharray="1 1"
                    opacity={0.4}
                  />
                  <text
                    x={x} y={y}
                    fontSize="3"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${angle}, ${x}, ${y})`}
                  >
                    ✈️
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <p className="text-sm text-muted-foreground text-center mt-4">
          Aviation accounts for ~2.5% of global CO₂ emissions — and growing fast.
        </p>
      </div>
    </GameLayout>
  );
};

export default FlightRadarCO2;
