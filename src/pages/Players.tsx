import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search } from "lucide-react";

interface P {
  id: string; display_name: string; age: number | null; location: string | null;
  sports: string[] | null; skill_level: string | null; bio: string | null;
}

const Players = () => {
  const [players, setPlayers] = useState<P[]>([]);
  const [q, setQ] = useState("");
  const [sport, setSport] = useState("all");
  const [skill, setSkill] = useState("all");

  useEffect(() => {
    supabase.from("profiles").select("id, display_name, age, location, sports, skill_level, bio").then(({ data }) => setPlayers(data ?? []));
  }, []);

  const filtered = useMemo(() => players.filter(p => {
    if (q && !(`${p.display_name} ${p.location ?? ""}`.toLowerCase().includes(q.toLowerCase()))) return false;
    if (sport !== "all" && !p.sports?.includes(sport)) return false;
    if (skill !== "all" && p.skill_level !== skill) return false;
    return true;
  }), [players, q, sport, skill]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-12">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Roster</p>
        <h1 className="mt-2 font-display text-4xl font-black md:text-5xl">Find your <span className="text-gradient-primary">teammates</span></h1>

        <div className="mt-8 grid gap-3 md:grid-cols-[1fr_200px_200px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name or city" />
          </div>
          <Select value={sport} onValueChange={setSport}>
            <SelectTrigger><SelectValue placeholder="Sport" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sports</SelectItem>
              {["Cricket","Football","Basketball","Tennis","Badminton","Volleyball","Hockey","Kabaddi"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={skill} onValueChange={setSkill}>
            <SelectTrigger><SelectValue placeholder="Skill" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All skills</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(p => (
            <Card key={p.id} className="group border-border/60 bg-card/50 p-6 backdrop-blur transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary font-display text-xl font-black text-primary-foreground">
                  {p.display_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-display text-lg font-bold">{p.display_name}</div>
                  {p.location && <div className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{p.location}</div>}
                </div>
              </div>
              {p.bio && <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">{p.bio}</p>}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.skill_level && <Badge variant="secondary" className="border border-accent/30 bg-accent/10 text-accent">{p.skill_level}</Badge>}
                {p.sports?.slice(0, 3).map(s => <Badge key={s} variant="secondary" className="border border-primary/30 bg-primary/10 text-primary">{s}</Badge>)}
              </div>
            </Card>
          ))}
          {filtered.length === 0 && <Card className="col-span-full border-dashed border-border/60 bg-transparent p-12 text-center text-muted-foreground">No players match your filters yet.</Card>}
        </div>
      </main>
    </div>
  );
};

export default Players;
