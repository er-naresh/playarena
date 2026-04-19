import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Trophy, User, MapPin } from "lucide-react";

const tiles = [
  { to: "/profile", icon: User, title: "My Profile", desc: "Set your sport, skill, location.", tone: "primary" as const },
  { to: "/players", icon: Users, title: "Find Teammates", desc: "Browse players near you.", tone: "accent" as const },
  { to: "/tournaments", icon: Trophy, title: "Tournaments", desc: "Join or create competitions.", tone: "primary" as const },
  { to: "#", icon: MapPin, title: "Grounds (soon)", desc: "Booking module coming next.", tone: "muted" as const },
];

const Dashboard = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-12">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Your arena</p>
        <h1 className="mt-2 font-display text-4xl font-black md:text-5xl">Welcome, <span className="text-gradient-primary">{user.email?.split("@")[0]}</span></h1>
        <p className="mt-2 text-muted-foreground">Pick a move below.</p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {tiles.map((t) => (
            <Card key={t.title} className="group relative overflow-hidden border-border/60 bg-card/50 p-6 backdrop-blur transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow">
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${t.tone === "primary" ? "bg-gradient-primary" : t.tone === "accent" ? "bg-gradient-accent" : "bg-secondary"}`}>
                <t.icon className={`h-6 w-6 ${t.tone === "muted" ? "text-muted-foreground" : "text-primary-foreground"}`} />
              </div>
              <h3 className="font-display text-xl font-bold">{t.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
              {t.to !== "#" && (
                <Button asChild variant="ghost" size="sm" className="mt-4 -ml-3">
                  <Link to={t.to}>Open →</Link>
                </Button>
              )}
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
