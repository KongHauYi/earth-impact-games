import { useState, useEffect, useCallback, useRef } from "react";
import GameLayout from "@/components/GameLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface FallingEmoji {
  id: number;
  emoji: string;
  x: number;
  top: number;
  type: "tree" | "axe";
}

const Deforestation = () => {
  const [count, setCount] = useState<number>(1000000);
  const [winner, setWinner] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [emojis, setEmojis] = useState<FallingEmoji[]>([]);
  const [displayCount, setDisplayCount] = useState(1000000);
  const idRef = useRef(0);

  const fetchCount = useCallback(async () => {
    const { data } = await supabase.from("tree_counter").select("count, winner").eq("id", 1).single();
    if (data) {
      setCount(Number(data.count));
      setDisplayCount(Number(data.count));
      setWinner(data.winner);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchCount(); }, [fetchCount]);

  // Animate display count toward actual count
  useEffect(() => {
    if (displayCount === count) return;
    const timer = setTimeout(() => {
      setDisplayCount(prev => {
        if (prev < count) return prev + 1;
        if (prev > count) return prev - 1;
        return count;
      });
    }, 20);
    return () => clearTimeout(timer);
  }, [displayCount, count]);

  const addEmoji = (type: "tree" | "axe") => {
    const id = idRef.current++;
    const x = Math.random() * 90 + 5;
    const emoji: FallingEmoji = { id, emoji: type === "tree" ? "🌱" : "🪓", x, top: type === "tree" ? -5 : Math.random() * 80 + 10, type };
    setEmojis(prev => [...prev, emoji]);
    setTimeout(() => setEmojis(prev => prev.filter(e => e.id !== id)), type === "tree" ? 3000 : 200);
  };

  const handleAction = async (delta: number) => {
    if (winner) return;
    const { data, error } = await supabase.rpc("change_trees", { delta });
    if (!error && data && data.length > 0) {
      setCount(Number(data[0].new_count));
      setWinner(data[0].winner);
      addEmoji(delta > 0 ? "tree" : "axe");
    }
  };

  return (
    <GameLayout title="Deforestation" emoji="🌳">
      <div className="max-w-xl mx-auto text-center relative">
        {/* Falling emojis */}
        {emojis.map(e => (
          <span
            key={e.id}
            className={e.type === "tree" ? "animate-tree-fall" : ""}
            style={{
              position: "fixed",
              left: `${e.x}%`,
              top: e.type === "tree" ? 0 : `${e.top}%`,
              fontSize: "1.5rem",
              opacity: e.type === "tree" ? 0.5 : 0.75,
              pointerEvents: "none",
              zIndex: 40,
              ...(e.type === "axe" ? { animation: "fade-in 0.1s ease-out reverse forwards" } : {}),
            }}
          >
            {e.emoji}
          </span>
        ))}

        <h2 className="font-display text-3xl font-bold mb-2">The Forest</h2>
        <p className="text-muted-foreground mb-8">Started with 1,000,000 trees. Choose your side.</p>

        {loading ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : winner ? (
          <div className="animate-fade-in">
            <p className="text-5xl mb-4">🪓</p>
            <h3 className="font-display text-4xl font-bold text-destructive mb-2">Cut Wins.</h3>
            <p className="text-muted-foreground">All trees have been cut down. The forest is gone.</p>
          </div>
        ) : (
          <>
            <div className="text-7xl font-display font-bold text-foreground mb-6 tabular-nums">
              {displayCount.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mb-8">trees remaining</p>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => handleAction(1)}
                size="lg"
                className="text-lg px-8 py-6 bg-primary hover:bg-primary/90"
              >
                🌱 Plant
              </Button>
              <Button
                onClick={() => handleAction(-1)}
                size="lg"
                variant="destructive"
                className="text-lg px-8 py-6"
              >
                🪓 Cut
              </Button>
            </div>
          </>
        )}
      </div>
    </GameLayout>
  );
};

export default Deforestation;
