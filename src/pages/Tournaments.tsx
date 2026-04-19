import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Trophy, Plus } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

interface T { id: string; title: string; sport: string; location: string; start_date: string; prize: string | null; rules: string | null; description: string | null; }

const schema = z.object({
  title: z.string().trim().min(3).max(120),
  sport: z.string().trim().min(2).max(40),
  location: z.string().trim().min(2).max(120),
  start_date: z.string().min(1),
  prize: z.string().max(60).optional(),
  description: z.string().max(1000).optional(),
});

const Tournaments = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<T[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", sport: "", location: "", start_date: "", prize: "", rules: "", description: "" });

  const load = () => supabase.from("tournaments").select("*").order("start_date").then(({ data }) => setItems(data ?? []));
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!user) return;
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    const { error } = await supabase.from("tournaments").insert({ ...form, organizer_id: user.id });
    if (error) toast.error(error.message);
    else { toast.success("Tournament created"); setOpen(false); setForm({ title: "", sport: "", location: "", start_date: "", prize: "", rules: "", description: "" }); load(); }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent">Compete</p>
            <h1 className="mt-2 font-display text-4xl font-black md:text-5xl">Live <span className="text-gradient-accent">tournaments</span></h1>
          </div>
          {user && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild><Button variant="accent" size="lg"><Plus className="h-4 w-4" /> Host tournament</Button></DialogTrigger>
              <DialogContent className="bg-card">
                <DialogHeader><DialogTitle className="font-display text-2xl">New tournament</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div><Label>Title</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Sport</Label><Input value={form.sport} onChange={e => setForm({ ...form, sport: e.target.value })} placeholder="Football" /></div>
                    <div><Label>Date</Label><Input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} /></div>
                  </div>
                  <div><Label>Location</Label><Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></div>
                  <div><Label>Prize</Label><Input value={form.prize} onChange={e => setForm({ ...form, prize: e.target.value })} placeholder="₹50,000" /></div>
                  <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                  <Button variant="hero" className="w-full" onClick={create}>Create</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map(t => (
            <Card key={t.id} className="group relative overflow-hidden border-border/60 bg-card/50 p-6 backdrop-blur transition-all hover:-translate-y-1 hover:border-accent/50 hover:shadow-accent-glow">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-accent">
                  <Trophy className="h-6 w-6 text-accent-foreground" />
                </div>
                <Badge variant="secondary" className="border border-primary/30 bg-primary/10 text-primary">{t.sport}</Badge>
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">{t.title}</h3>
              {t.description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{t.description}</p>}
              <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />{new Date(t.start_date).toLocaleDateString()}</div>
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{t.location}</div>
                {t.prize && <div className="flex items-center gap-2"><Trophy className="h-4 w-4 text-accent" />Prize: <span className="font-semibold text-foreground">{t.prize}</span></div>}
              </div>
            </Card>
          ))}
          {items.length === 0 && <Card className="col-span-full border-dashed border-border/60 bg-transparent p-12 text-center text-muted-foreground">No tournaments yet. {user ? "Be the first to host one!" : "Sign in to host one."}</Card>}
        </div>
      </main>
    </div>
  );
};

export default Tournaments;
