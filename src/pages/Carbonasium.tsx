import { useState, useMemo } from "react";
import GameLayout from "@/components/GameLayout";
import { Button } from "@/components/ui/button";

const questions = [
  { q: "How do you commute to work/school?", options: [
    { label: "Walk/Bike", co2: 0 }, { label: "Public transport", co2: 1.2 }, { label: "Car (alone)", co2: 4.6 }, { label: "Car (shared)", co2: 2.3 }
  ]},
  { q: "How often do you fly per year?", options: [
    { label: "Never", co2: 0 }, { label: "1-2 short flights", co2: 1.1 }, { label: "3-5 flights", co2: 4.4 }, { label: "6+ flights", co2: 11 }
  ]},
  { q: "What's your diet like?", options: [
    { label: "Vegan", co2: 1.5 }, { label: "Vegetarian", co2: 1.7 }, { label: "Occasional meat", co2: 2.5 }, { label: "Daily meat", co2: 3.3 }
  ]},
  { q: "How do you heat/cool your home?", options: [
    { label: "Renewable energy", co2: 0.3 }, { label: "Natural gas", co2: 2.2 }, { label: "Electric (grid)", co2: 1.5 }, { label: "Oil/coal", co2: 3.8 }
  ]},
  { q: "How much do you shop for new clothes?", options: [
    { label: "Rarely / secondhand", co2: 0.2 }, { label: "Seasonally", co2: 0.6 }, { label: "Monthly", co2: 1.0 }, { label: "Weekly", co2: 1.8 }
  ]},
  { q: "Do you recycle?", options: [
    { label: "Everything I can", co2: -0.2 }, { label: "Most things", co2: 0 }, { label: "Sometimes", co2: 0.3 }, { label: "Never", co2: 0.6 }
  ]},
  { q: "How long are your showers?", options: [
    { label: "Under 5 min", co2: 0.1 }, { label: "5-10 min", co2: 0.3 }, { label: "10-20 min", co2: 0.6 }, { label: "20+ min", co2: 1.0 }
  ]},
  { q: "How often do you eat out / order delivery?", options: [
    { label: "Rarely", co2: 0.1 }, { label: "1-2x/week", co2: 0.5 }, { label: "3-5x/week", co2: 1.0 }, { label: "Daily", co2: 1.8 }
  ]},
  { q: "Do you use single-use plastics?", options: [
    { label: "I avoid them", co2: 0.1 }, { label: "Sometimes", co2: 0.3 }, { label: "Often", co2: 0.6 }, { label: "All the time", co2: 1.0 }
  ]},
  { q: "How big is your living space?", options: [
    { label: "Small apartment", co2: 0.5 }, { label: "Average apartment", co2: 1.0 }, { label: "House", co2: 2.0 }, { label: "Large house", co2: 3.5 }
  ]},
  { q: "How many electronic devices do you own?", options: [
    { label: "1-2", co2: 0.2 }, { label: "3-5", co2: 0.5 }, { label: "6-10", co2: 1.0 }, { label: "10+", co2: 1.5 }
  ]},
  { q: "Do you leave lights/appliances on when not using them?", options: [
    { label: "Never", co2: 0 }, { label: "Sometimes", co2: 0.3 }, { label: "Often", co2: 0.6 }, { label: "Always", co2: 1.0 }
  ]},
  { q: "How much food do you waste per week?", options: [
    { label: "Almost none", co2: 0.1 }, { label: "A little", co2: 0.4 }, { label: "Moderate amount", co2: 0.8 }, { label: "A lot", co2: 1.5 }
  ]},
  { q: "Do you use a tumble dryer?", options: [
    { label: "Never (air dry)", co2: 0 }, { label: "Sometimes", co2: 0.3 }, { label: "Most loads", co2: 0.5 }, { label: "Every load", co2: 0.8 }
  ]},
  { q: "How do you get your drinking water?", options: [
    { label: "Tap water", co2: 0 }, { label: "Filtered tap", co2: 0.1 }, { label: "Bottled water", co2: 0.4 }, { label: "Imported bottled", co2: 0.8 }
  ]},
  { q: "Do you have a pet?", options: [
    { label: "No pet", co2: 0 }, { label: "Small pet (fish/hamster)", co2: 0.1 }, { label: "Cat", co2: 0.3 }, { label: "Dog", co2: 0.6 }
  ]},
  { q: "How often do you buy new tech?", options: [
    { label: "Only when broken", co2: 0.1 }, { label: "Every 3-4 years", co2: 0.4 }, { label: "Every 1-2 years", co2: 0.8 }, { label: "Yearly / latest model", co2: 1.5 }
  ]},
  { q: "Do you use streaming services a lot?", options: [
    { label: "Barely", co2: 0.05 }, { label: "1-2 hrs/day", co2: 0.15 }, { label: "3-5 hrs/day", co2: 0.3 }, { label: "6+ hrs/day", co2: 0.5 }
  ]},
  { q: "How do you handle old electronics?", options: [
    { label: "Recycle properly", co2: 0 }, { label: "Donate/sell", co2: 0.1 }, { label: "Keep in drawer", co2: 0.2 }, { label: "Throw in trash", co2: 0.5 }
  ]},
  { q: "What's your laundry temperature?", options: [
    { label: "Cold water", co2: 0.1 }, { label: "Warm", co2: 0.3 }, { label: "Hot", co2: 0.5 }, { label: "Boiling", co2: 0.8 }
  ]},
];

const WORLD_AVG = 4.7; // tonnes CO2 per year (approximate)
const COUNTRY_AVGS: Record<string, number> = {
  "US": 14.7, "UK": 5.2, "India": 1.9, "China": 8.0, "Germany": 7.9,
  "Brazil": 2.0, "Japan": 8.5, "Australia": 15.0, "Canada": 14.2, "France": 4.5,
};

const Carbonasium = () => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const totalCO2 = useMemo(() => answers.reduce((s, v) => s + v, 0), [answers]);
  const treesNeeded = Math.ceil(totalCO2 / 0.022); // ~22kg CO2 per tree per year

  const handleAnswer = (co2: number) => {
    const newAnswers = [...answers, co2];
    setAnswers(newAnswers);
    if (current + 1 >= questions.length) {
      setDone(true);
    } else {
      setCurrent(current + 1);
    }
  };

  return (
    <GameLayout title="Carbonasium" emoji="🏭">
      {!done ? (
        <div className="max-w-xl mx-auto animate-fade-in" key={current}>
          <div className="text-sm text-muted-foreground mb-2">
            Question {current + 1} of {questions.length}
          </div>
          <div className="w-full bg-muted rounded-full h-2 mb-6">
            <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
          </div>
          <h2 className="font-display text-2xl font-semibold mb-6">{questions[current].q}</h2>
          <div className="grid grid-cols-1 gap-3">
            {questions[current].options.map((opt) => (
              <button
                key={opt.label}
                onClick={() => handleAnswer(opt.co2)}
                className="text-left p-4 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all duration-200 font-medium"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto animate-fade-in text-center">
          <h2 className="font-display text-4xl font-bold mb-2">Your Carbon Footprint</h2>
          <p className="text-6xl font-display font-bold text-destructive my-6">
            {totalCO2.toFixed(1)} <span className="text-2xl text-muted-foreground">tonnes CO₂/year</span>
          </p>

          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <h3 className="font-display font-semibold text-lg mb-4">🌲 You need <span className="text-primary">{treesNeeded.toLocaleString()}</span> trees to offset your footprint</h3>
            <p className="text-sm text-muted-foreground">That's about {(treesNeeded * 5).toLocaleString()} m² of forest — roughly {(treesNeeded * 5 / 7140).toFixed(1)} football fields.</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <h3 className="font-display font-semibold text-lg mb-4">📊 How you compare</h3>
            <div className="space-y-3">
              <ComparisonBar label="World Average" value={WORLD_AVG} yours={totalCO2} />
              {Object.entries(COUNTRY_AVGS).map(([country, avg]) => (
                <ComparisonBar key={country} label={country} value={avg} yours={totalCO2} />
              ))}
            </div>
          </div>

          <Button onClick={() => { setCurrent(0); setAnswers([]); setDone(false); }} size="lg">
            Try Again
          </Button>
        </div>
      )}
    </GameLayout>
  );
};

const ComparisonBar = ({ label, value, yours }: { label: string; value: number; yours: number }) => {
  const max = Math.max(value, yours, 15);
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-20 text-right text-muted-foreground">{label}</span>
      <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden relative">
        <div className="absolute h-full bg-secondary/60 rounded-full transition-all" style={{ width: `${(value / max) * 100}%` }} />
        <div className="absolute h-full bg-destructive/70 rounded-full transition-all" style={{ width: `${(yours / max) * 100}%`, maxWidth: '100%' }} />
      </div>
      <span className="w-16 text-xs text-muted-foreground">{value}t</span>
    </div>
  );
};

export default Carbonasium;
