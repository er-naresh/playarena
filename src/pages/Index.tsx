import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Trophy, Users, MapPin, MessageSquare, Zap, Calendar } from "lucide-react";
import hero from "@/assets/hero-sports.jpg";

const features = [
  { icon: Users, title: "Find Teammates", desc: "Match with players by sport, skill, and location." },
  { icon: Trophy, title: "Tournaments", desc: "Discover, join, or organize competitive tournaments." },
  { icon: MapPin, title: "Book Grounds", desc: "Reserve verified grounds in your city by the hour." },
  { icon: MessageSquare, title: "Live Chat", desc: "Talk to teammates and organizers in real time." },
  { icon: Calendar, title: "Schedules", desc: "Track matches, fixtures, and results in one feed." },
  { icon: Zap, title: "Smart Notifs", desc: "Stay alerted on bookings, invites, and updates." },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="container relative grid gap-12 py-20 md:grid-cols-2 md:py-32">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              The arena is live
            </div>
            <h1 className="font-display text-5xl font-black leading-[0.95] md:text-7xl">
              GAME ON.<br />
              <span className="text-gradient-primary">FIND YOUR</span><br />
              <span className="text-gradient-accent">SQUAD.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">
              The smart platform connecting players, teams, ground owners, and tournament organizers — all in one arena.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/auth?mode=signup">Join the arena</Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/tournaments">Browse tournaments</Link>
              </Button>
            </div>
            <div className="mt-10 flex gap-8 border-t border-border/50 pt-6 text-sm">
              <div><div className="font-display text-2xl font-bold text-primary">12k+</div><div className="text-muted-foreground">Players</div></div>
              <div><div className="font-display text-2xl font-bold text-accent">340</div><div className="text-muted-foreground">Tournaments</div></div>
              <div><div className="font-display text-2xl font-bold text-primary">90+</div><div className="text-muted-foreground">Grounds</div></div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-primary opacity-20 blur-3xl" />
            <img
              src={hero}
              alt="Athletes competing under neon stadium lights"
              className="relative animate-float rounded-3xl border border-border shadow-card"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container py-20">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">Everything you need</p>
          <h2 className="font-display text-4xl font-black md:text-5xl">Built for <span className="text-gradient-accent">competitors</span></h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Card key={i} className="group relative overflow-hidden border-border/60 bg-card/50 p-6 backdrop-blur transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary group-hover:bg-gradient-primary">
                <f.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-hero p-10 text-center md:p-16">
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="relative">
            <h2 className="font-display text-3xl font-black md:text-5xl">
              Ready to <span className="text-gradient-primary">play</span>?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Create your player profile in 60 seconds and start matching with athletes near you.
            </p>
            <Button asChild variant="hero" size="xl" className="mt-8">
              <Link to="/auth?mode=signup">Create my profile</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} PlayArena. The arena for competitive sports.
      </footer>
    </div>
  );
};

export default Index;
