import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const SPORTS = ["Cricket", "Football", "Basketball", "Tennis", "Badminton", "Volleyball", "Hockey", "Kabaddi"];

const Profile = () => {
  const { user, loading } = useAuth();
  const [form, setForm] = useState({ display_name: "", age: "", location: "", skill_level: "intermediate", bio: "", sports: [] as string[] });
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (data) setForm({
        display_name: data.display_name ?? "",
        age: data.age?.toString() ?? "",
        location: data.location ?? "",
        skill_level: data.skill_level ?? "intermediate",
        bio: data.bio ?? "",
        sports: data.sports ?? [],
      });
      setLoaded(true);
    });
  }, [user]);

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  const toggleSport = (s: string) => setForm(f => ({ ...f, sports: f.sports.includes(s) ? f.sports.filter(x => x !== s) : [...f.sports, s] }));

  const save = async () => {
    setSaving(true);
    const payload = {
      user_id: user.id,
      display_name: form.display_name.trim(),
      age: form.age ? parseInt(form.age) : null,
      location: form.location.trim() || null,
      skill_level: form.skill_level,
      bio: form.bio.trim() || null,
      sports: form.sports,
    };
    const { error } = await supabase.from("profiles").upsert(payload, { onConflict: "user_id" });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Profile saved");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-3xl py-12">
        <h1 className="font-display text-4xl font-black">My <span className="text-gradient-primary">Profile</span></h1>
        <p className="mt-2 text-muted-foreground">Help others find and team up with you.</p>

        <Card className="mt-8 border-border/60 bg-card/50 p-8 backdrop-blur">
          {!loaded ? <div className="text-muted-foreground">Loading...</div> : (
            <div className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Display name</Label>
                  <Input value={form.display_name} onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))} maxLength={60} />
                </div>
                <div className="space-y-1.5">
                  <Label>Age</Label>
                  <Input type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} min={10} max={100} />
                </div>
                <div className="space-y-1.5">
                  <Label>Location</Label>
                  <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Mumbai, IN" maxLength={120} />
                </div>
                <div className="space-y-1.5">
                  <Label>Skill level</Label>
                  <Select value={form.skill_level} onValueChange={v => setForm(f => ({ ...f, skill_level: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Sports</Label>
                <div className="flex flex-wrap gap-2">
                  {SPORTS.map(s => {
                    const on = form.sports.includes(s);
                    return (
                      <button key={s} type="button" onClick={() => toggleSport(s)}
                        className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${on ? "border-primary bg-primary/10 text-primary shadow-glow" : "border-border bg-secondary text-muted-foreground hover:text-foreground"}`}>
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Bio</Label>
                <Textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} maxLength={500} placeholder="Tell teammates about your style of play..." />
              </div>

              <Button variant="hero" size="lg" onClick={save} disabled={saving}>{saving ? "Saving..." : "Save profile"}</Button>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default Profile;
