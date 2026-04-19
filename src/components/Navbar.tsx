import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Zap } from "lucide-react";

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const nav = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-black tracking-tight">
            PLAY<span className="text-gradient-primary">ARENA</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/players" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Players</Link>
          <Link to="/tournaments" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Tournaments</Link>
          {user && <Link to="/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Dashboard</Link>}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => nav("/profile")}>Profile</Button>
              <Button variant="outline" size="sm" onClick={async () => { await signOut(); nav("/"); }}>Sign out</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => nav("/auth")}>Sign in</Button>
              <Button variant="hero" size="sm" onClick={() => nav("/auth?mode=signup")}>Join now</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
