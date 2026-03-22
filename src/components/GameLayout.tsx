import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface GameLayoutProps {
  title: string;
  emoji: string;
  children: React.ReactNode;
}

const GameLayout = ({ title, emoji, children }: GameLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container flex h-14 items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-display font-semibold text-primary">envon</span>
          </Link>
          <div className="h-4 w-px bg-border" />
          <span className="font-display font-medium">{emoji} {title}</span>
        </div>
      </header>
      <main className="container py-8">
        {children}
      </main>
    </div>
  );
};

export default GameLayout;
