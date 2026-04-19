import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const schema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6, "At least 6 characters").max(72),
  displayName: z.string().trim().min(2, "Name too short").max(60).optional(),
});

const Auth = () => {
  const [params] = useSearchParams();
  const initial = params.get("mode") === "signup";
  const [isSignUp, setIsSignUp] = useState(initial);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { user } = useAuth();

  useEffect(() => { if (user) nav("/dashboard"); }, [user, nav]);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    const parse = schema.safeParse({ email, password, displayName: isSignUp ? displayName : undefined });
    if (!parse.success) {
      toast.error(parse.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { display_name: displayName },
          },
        });
        if (error) throw error;
        toast.success("Welcome to the arena!");
        nav("/dashboard");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
        nav("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-hero p-4">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <Card className="relative w-full max-w-md border-border/60 bg-card/80 p-8 shadow-card backdrop-blur-xl">
        <Link to="/" className="mb-6 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-black">PLAY<span className="text-gradient-primary">ARENA</span></span>
        </Link>
        <h1 className="font-display text-3xl font-black">{isSignUp ? "Join the arena" : "Welcome back"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{isSignUp ? "Create your free player account." : "Sign in to your account."}</p>
        <form onSubmit={handle} className="mt-6 space-y-4">
          {isSignUp && (
            <div className="space-y-1.5">
              <Label htmlFor="name">Display name</Label>
              <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Virat K." required />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pw">Password</Label>
            <Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
            {loading ? "Loading..." : isSignUp ? "Create account" : "Sign in"}
          </Button>
        </form>
        <button onClick={() => setIsSignUp(!isSignUp)} className="mt-6 w-full text-center text-sm text-muted-foreground transition-colors hover:text-primary">
          {isSignUp ? "Already have an account? Sign in" : "New here? Create an account"}
        </button>
      </Card>
    </div>
  );
};

export default Auth;
