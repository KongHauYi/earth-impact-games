import { useState, useEffect, useCallback, useMemo } from "react";
import GameLayout from "@/components/GameLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface Gas {
  name: string;
  formula: string;
  emoji: string;
  description: string;
  facts: string[];
  gwp: string; // global warming potential
}

const gases: Gas[] = [
  {
    name: "Carbon Dioxide", formula: "CO₂", emoji: "💨",
    description: "The poster child of greenhouse gases. Released by burning fossil fuels, deforestation, and breathing (yes, you).",
    facts: ["CO₂ levels are higher now than any point in 800,000 years", "Plants absorb CO₂ but we're cutting them down too", "The ocean absorbs 30% of CO₂ — making it more acidic"],
    gwp: "1x (the baseline)"
  },
  {
    name: "Methane", formula: "CH₄", emoji: "🐄",
    description: "28-80x more potent than CO₂. Comes from cows, rice paddies, landfills, and fossil fuel production.",
    facts: ["Cows burp (not fart) methane", "Landfills are the 3rd largest source of methane", "Methane traps heat 80x more than CO₂ over 20 years"],
    gwp: "28-80x CO₂"
  },
  {
    name: "Nitrous Oxide", formula: "N₂O", emoji: "😂",
    description: "Yes, laughing gas! But 273x more potent than CO₂. Comes from agriculture and industry.",
    facts: ["Stays in the atmosphere for 114 years", "Fertilizers are the main source", "Also destroys the ozone layer"],
    gwp: "273x CO₂"
  },
  {
    name: "Water Vapor", formula: "H₂O", emoji: "💧",
    description: "The most abundant greenhouse gas. Not directly caused by humans but amplifies warming from other gases.",
    facts: ["Responsible for about 60% of the greenhouse effect", "Warmer air holds more water vapor", "Creates a feedback loop with temperature"],
    gwp: "Variable"
  },
  {
    name: "Ozone", formula: "O₃", emoji: "🛡️",
    description: "Good up high (protects from UV), bad nearby (smog). Ground-level ozone is a pollutant.",
    facts: ["The 'ozone hole' is mainly over Antarctica", "CFCs from old fridges damaged the ozone layer", "The ozone layer is slowly recovering!"],
    gwp: "~1,000x CO₂ (short-term)"
  },
  {
    name: "Sulfur Hexafluoride", formula: "SF₆", emoji: "⚡",
    description: "The most potent greenhouse gas known. Used in electrical equipment. Stays in the atmosphere for 3,200 years.",
    facts: ["23,500x more potent than CO₂", "Used as an insulator in power grids", "If you breathe it, your voice gets deeper (opposite of helium)"],
    gwp: "23,500x CO₂"
  },
];

const ElementStar = () => {
  const [selectedGas, setSelectedGas] = useState<Gas | null>(null);
  const [ratings, setRatings] = useState<Record<string, { avg: number; count: number }>>({});
  const [reviews, setReviews] = useState<Record<string, { reviewer_id: string; review_text: string }[]>>({});
  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewerId] = useState(() => {
    let id = localStorage.getItem("envon_reviewer_id");
    if (!id) { id = crypto.randomUUID(); localStorage.setItem("envon_reviewer_id", id); }
    return id;
  });

  // 0.5% chance per session
  const sessionCanReview = useMemo(() => Math.random() < 0.005, []);

  const fetchData = useCallback(async () => {
    const { data: ratingsData } = await supabase.from("element_ratings").select("gas_name, stars");
    if (ratingsData) {
      const grouped: Record<string, number[]> = {};
      ratingsData.forEach(r => {
        if (!grouped[r.gas_name]) grouped[r.gas_name] = [];
        grouped[r.gas_name].push(r.stars);
      });
      const result: Record<string, { avg: number; count: number }> = {};
      Object.entries(grouped).forEach(([name, stars]) => {
        result[name] = { avg: stars.reduce((a, b) => a + b, 0) / stars.length, count: stars.length };
      });
      setRatings(result);
    }

    const { data: reviewsData } = await supabase.from("element_reviews").select("gas_name, reviewer_id, review_text");
    if (reviewsData) {
      const grouped: Record<string, { reviewer_id: string; review_text: string }[]> = {};
      reviewsData.forEach(r => {
        if (!grouped[r.gas_name]) grouped[r.gas_name] = [];
        grouped[r.gas_name].push({ reviewer_id: r.reviewer_id, review_text: r.review_text });
      });
      setReviews(grouped);

      // Check if this user already reviewed
      if (reviewsData.some(r => r.reviewer_id === reviewerId)) {
        setHasReviewed(true);
      }
    }

    setCanReview(sessionCanReview && !hasReviewed);
  }, [reviewerId, sessionCanReview, hasReviewed]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleRate = async (gasName: string, stars: number) => {
    await supabase.from("element_ratings").insert({ gas_name: gasName, stars });
    fetchData();
  };

  const handleReview = async (gasName: string) => {
    if (!reviewText.trim() || hasReviewed) return;
    await supabase.from("element_reviews").insert({ gas_name: gasName, reviewer_id: reviewerId, review_text: reviewText.trim() });
    setReviewText("");
    setHasReviewed(true);
    setCanReview(false);
    fetchData();
  };

  return (
    <GameLayout title="ElementStar" emoji="⭐">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl font-bold mb-2 text-center">Rate the Greenhouse Gases</h2>
        <p className="text-muted-foreground text-center mb-8">Because even gases deserve feedback. ⭐</p>

        {!selectedGas ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {gases.map((gas, i) => (
              <button
                key={gas.formula}
                onClick={() => setSelectedGas(gas)}
                className="game-card text-left animate-fade-in"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <span className="text-3xl">{gas.emoji}</span>
                <h3 className="font-display text-lg font-semibold mt-2">{gas.name}</h3>
                <p className="text-xs text-muted-foreground">{gas.formula} · GWP: {gas.gwp}</p>
                {ratings[gas.name] && (
                  <div className="mt-2 text-sm">
                    {"⭐".repeat(Math.round(ratings[gas.name].avg))} ({ratings[gas.name].count})
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="animate-fade-in">
            <button onClick={() => setSelectedGas(null)} className="text-sm text-muted-foreground hover:text-foreground mb-4 block">
              ← Back to all gases
            </button>
            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="text-center mb-6">
                <span className="text-5xl">{selectedGas.emoji}</span>
                <h3 className="font-display text-3xl font-bold mt-3">{selectedGas.name}</h3>
                <p className="text-muted-foreground text-sm">{selectedGas.formula} · GWP: {selectedGas.gwp}</p>
              </div>

              <p className="text-center mb-6">{selectedGas.description}</p>

              <div className="bg-muted rounded-xl p-4 mb-6">
                <h4 className="font-display font-semibold mb-2">Fun Facts</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {selectedGas.facts.map(f => <li key={f}>• {f}</li>)}
                </ul>
              </div>

              {/* Star rating */}
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground mb-2">Rate this gas:</p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button
                      key={s}
                      onClick={() => handleRate(selectedGas.name, s)}
                      className="text-3xl hover:scale-125 transition-transform"
                    >
                      {s <= Math.round(ratings[selectedGas.name]?.avg || 0) ? "⭐" : "☆"}
                    </button>
                  ))}
                </div>
                {ratings[selectedGas.name] && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {ratings[selectedGas.name].avg.toFixed(1)} avg · {ratings[selectedGas.name].count} ratings
                  </p>
                )}
              </div>

              {/* Reviews */}
              {reviews[selectedGas.name] && reviews[selectedGas.name].length > 0 && (
                <div className="mb-6">
                  <h4 className="font-display font-semibold mb-2">Reviews</h4>
                  <div className="space-y-2">
                    {reviews[selectedGas.name].map((r, i) => (
                      <div key={i} className="bg-muted rounded-lg p-3 text-sm">
                        <span className="text-muted-foreground">Anonymous: </span>{r.review_text}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Review form (0.5% chance) */}
              {canReview && !hasReviewed && (
                <div className="border border-accent rounded-xl p-4 bg-accent/10">
                  <p className="text-sm font-semibold text-accent-foreground mb-2">🎉 You're one of the rare 0.5% who can leave a review!</p>
                  <textarea
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                    placeholder="Write your review..."
                    className="w-full bg-background border border-border rounded-lg p-2 text-sm resize-none h-20 mb-2"
                    maxLength={200}
                  />
                  <Button onClick={() => handleReview(selectedGas.name)} size="sm">
                    Submit Review
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </GameLayout>
  );
};

export default ElementStar;
