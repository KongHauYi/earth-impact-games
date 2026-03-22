import { useState, useEffect, useCallback } from "react";
import GameLayout from "@/components/GameLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const milestones: Record<number, string> = {
  1000: "1,000 pieces — enough to fill a bathtub!",
  10000: "10,000 pieces — that's a full dumpster!",
  50000: "50,000 pieces — enough to fill a classroom!",
  100000: "100,000 pieces — enough to fill 2 swimming pools!",
  250000: "250,000 pieces — weighs as much as 5 cars!",
  500000: "500,000 pieces — could cover a football field!",
  750000: "750,000 pieces — halfway to a million!",
  1000000: "🎉 1 MILLION! But that's not even 0.001% of ocean trash...",
};

const TrashProject = () => {
  const [count, setCount] = useState<number>(0);
  const [goal, setGoal] = useState<number>(1000000);
  const [popup, setPopup] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCount = useCallback(async () => {
    const { data } = await supabase.from("trash_counter").select("count, goal").eq("id", 1).single();
    if (data) {
      setCount(Number(data.count));
      setGoal(Number(data.goal));
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchCount(); }, [fetchCount]);

  const throwTrash = async () => {
    const { data, error } = await supabase.rpc("increment_trash");
    if (!error && data !== null) {
      const newCount = Number(data);
      setCount(newCount);

      // Check milestones
      for (const [threshold, msg] of Object.entries(milestones)) {
        const t = Number(threshold);
        if (newCount >= t && newCount - 1 < t) {
          setPopup(msg);
          setTimeout(() => setPopup(null), 4000);
          break;
        }
      }

      if (newCount >= 1000000) setGoal(1000000000);
    }
  };

  const pct = Math.min((count / goal) * 100, 100);

  return (
    <GameLayout title="TrashProject" emoji="🗑️">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="font-display text-3xl font-bold mb-2">Throw rubbish into the ocean</h2>
        <p className="text-muted-foreground mb-8">Every click = 1 piece of rubbish. Together we reach the goal.</p>

        {loading ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : (
          <>
            <div className="text-6xl font-display font-bold text-foreground mb-2 animate-counter-tick">
              {count.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground mb-4">
              / {goal.toLocaleString()} pieces
            </div>

            <div className="w-full bg-muted rounded-full h-4 mb-6 overflow-hidden">
              <div
                className="h-full bg-secondary rounded-full transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>

            <Button onClick={throwTrash} size="lg" className="text-lg px-10 py-6">
              🗑️ Throw Rubbish
            </Button>

            <p className="mt-8 text-sm text-muted-foreground max-w-md mx-auto">
              1 Million pieces of rubbish isn't even 0.001% of all the rubbish thrown in the ocean!
            </p>

            {popup && (
              <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-card border border-border rounded-2xl px-6 py-4 shadow-lg animate-fade-in z-50">
                <p className="font-display font-semibold">{popup}</p>
              </div>
            )}
          </>
        )}
      </div>
    </GameLayout>
  );
};

export default TrashProject;
