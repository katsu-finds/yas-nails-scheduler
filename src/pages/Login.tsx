import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Email and password are required");
    setLoading(true);

    if (isLogin) {
      const { data: signInData, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
      else {
        toast.success("Welcome back!");
        // Check if user is admin
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", signInData.user!.id)
          .eq("role", "admin")
          .maybeSingle();
        if (roleData) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } else {
      if (!name) { toast.error("Name is required"); setLoading(false); return; }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name, phone },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) toast.error(error.message);
      else toast.success("Check your email to verify your account!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background bg-marble">
      <Navbar />
      <div className="pt-24 pb-20 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-4"
        >
          <div className="bg-card rounded-2xl p-8 shadow-card">
            <div className="text-center mb-8">
              <Sparkles className="h-8 w-8 text-salon-blush mx-auto mb-3" />
              <h1 className="font-display text-3xl font-bold text-foreground">
                {isLogin ? "Welcome Back" : "Join Yas Nails"}
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                {isLogin ? "Sign in to manage your appointments" : "Create an account to start booking"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Phone Number</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+63 9XX XXX XXXX"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
              </div>
              <Button variant="hero" size="lg" className="w-full mt-2" type="submit" disabled={loading}>
                {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-salon-blush hover:underline">
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
