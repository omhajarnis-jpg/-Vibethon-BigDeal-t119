import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus, Mail, Lock, User } from "lucide-react";
import { motion } from "framer-motion";
import doraemonImg from "@/assets/doraemon.png";
import { useAuth } from "@/hooks/use-auth";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { signup, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (isSignup) {
      if (!name.trim()) { setError("Please enter your name"); return; }
      const res = await signup(email.trim(), password, name.trim());
      if (res.ok) {
        setSuccess("Account created! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 800);
      } else {
        setError(res.error || "Signup failed");
      }
    } else {
      const res = await login(email.trim(), password);
      if (res.ok) {
        setSuccess("Welcome back! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 800);
      } else {
        setError(res.error || "Login failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        className="bg-card rounded-2xl border border-border p-8 shadow-lg w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-6">
          <img src={doraemonImg} alt="Doraemon" className="w-20 h-20 mx-auto object-contain mb-3 animate-bounce-gentle" />
          <h1 className="font-heading text-2xl font-black">
            {isSignup ? "Create Account" : "Welcome Back!"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isSignup ? "Join the AI Learning Lab" : "Log in to continue learning"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="text-sm font-bold text-muted-foreground mb-1 block">Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-bold text-muted-foreground mb-1 block">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-muted-foreground mb-1 block">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="bg-accent/10 border border-accent/30 text-accent text-sm font-semibold px-4 py-2 rounded-xl">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-success/10 border border-success/30 text-success text-sm font-semibold px-4 py-2 rounded-xl">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            {isSignup ? <UserPlus size={16} /> : <LogIn size={16} />}
            {isSignup ? "Sign Up" : "Log In"}
          </button>
        </form>

        <div className="mt-5 text-center">
          <button
            onClick={() => { setIsSignup(!isSignup); setError(""); setSuccess(""); }}
            className="text-sm font-semibold text-primary hover:underline"
          >
            {isSignup ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
