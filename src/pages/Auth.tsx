import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, ArrowRight, Eye, EyeOff, Mail, Lock, User, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";

function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { toast.error("Please enter your email."); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
      toast.success("Password reset link sent! Check your email.");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center space-y-4 py-4">
        <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
        <p className="text-foreground font-semibold">Check your email</p>
        <p className="text-muted-foreground text-sm">We sent a password reset link to <strong>{email}</strong></p>
        <button type="button" onClick={onBack} className="text-sm text-primary hover:underline">Back to Sign In</button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button type="button" onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Sign In
      </button>
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground mb-1">Reset Password</h2>
        <p className="text-muted-foreground text-sm">Enter your email and we'll send you a reset link.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="resetEmail" className="text-foreground text-sm">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input id="resetEmail" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-11 rounded-xl bg-secondary/50 border-border focus:border-primary focus:ring-primary" required />
        </div>
      </div>
      <Button type="submit" disabled={loading} onClick={handleSubmit} className="w-full h-11 rounded-xl gradient-bg text-primary-foreground font-semibold text-sm">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Reset Link"}
      </Button>
    </div>
  );
}

type AuthMode = "signin" | "signup";

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const getPasswordStrength = (pw: string): { label: string; color: string; width: string } => {
    if (pw.length === 0) return { label: "", color: "", width: "0%" };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { label: "Weak", color: "bg-destructive", width: "25%" };
    if (score === 2) return { label: "Fair", color: "bg-yellow-500", width: "50%" };
    if (score === 3) return { label: "Good", color: "bg-primary", width: "75%" };
    return { label: "Strong", color: "bg-green-500", width: "100%" };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (mode === "signup") {
      if (!fullName.trim()) {
        toast.error("Please enter your full name.");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        await signUp(email, password, fullName);
        toast.success("Account created! Please check your email to verify your account.");
      } else {
        await signIn(email, password);
        toast.success("Welcome back!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      const msg = error.message || "Authentication failed.";
      if (msg.includes("Invalid login")) {
        toast.error("Incorrect email or password.");
      } else if (msg.includes("User already registered")) {
        toast.error("An account with this email already exists.");
      } else if (msg.includes("Email not confirmed")) {
        toast.error("Please verify your email before signing in.");
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-[100px] gradient-bg pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-accent/20 blur-[80px] pointer-events-none" />

      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
        <div className="absolute inset-0 gradient-bg opacity-[0.07]" />
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-md"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
              <Brain className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-3xl font-display font-bold gradient-text">CareerPredict AI</span>
          </div>
          <h2 className="text-4xl font-display font-bold text-foreground leading-tight mb-4">
            Predict Your <span className="gradient-text">Career Path</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            AI-powered placement intelligence that gives you an edge. Predict your chances, optimize your resume, and plan your career with confidence.
          </p>
          <div className="space-y-4">
            {[
              "AI-powered placement predictions",
              "ATS-optimized resume analysis",
              "Personalized skill roadmaps",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-secondary-foreground">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right auth form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-display font-bold gradient-text">CareerPredict AI</span>
            </Link>
          </div>

          <div className="glass rounded-2xl p-8 glow-border">
            {/* Tabs */}
            <div className="flex rounded-xl bg-secondary/50 p-1 mb-8">
              {(["signin", "signup"] as AuthMode[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setMode(tab); resetForm(); }}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    mode === tab
                      ? "gradient-bg text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "signin" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: mode === "signup" ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: mode === "signup" ? -20 : 20 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-2xl font-display font-bold text-foreground mb-1">
                  {mode === "signin" ? "Welcome back" : "Create account"}
                </h2>
                <p className="text-muted-foreground text-sm mb-6">
                  {mode === "signin"
                    ? "Sign in to access your dashboard"
                    : "Get started with your placement journey"}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === "signin" && forgotMode ? (
                    <ForgotPasswordForm
                      onBack={() => setForgotMode(false)}
                    />
                  ) : (<>
                  {mode === "signup" && (
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-foreground text-sm">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="fullName"
                          placeholder="John Doe"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="pl-10 h-11 rounded-xl bg-secondary/50 border-border focus:border-primary focus:ring-primary"
                          required
                          maxLength={100}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground text-sm">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11 rounded-xl bg-secondary/50 border-border focus:border-primary focus:ring-primary"
                        required
                        maxLength={255}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground text-sm">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-11 rounded-xl bg-secondary/50 border-border focus:border-primary focus:ring-primary"
                        required
                        minLength={6}
                        maxLength={128}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {mode === "signup" && password.length > 0 && (
                      <div className="space-y-1">
                        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                            style={{ width: strength.width }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">Password strength: {strength.label}</p>
                      </div>
                    )}
                  </div>

                  {mode === "signup" && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-foreground text-sm">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10 pr-10 h-11 rounded-xl bg-secondary/50 border-border focus:border-primary focus:ring-primary"
                          required
                          minLength={6}
                          maxLength={128}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 rounded-xl gradient-bg text-primary-foreground font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        {mode === "signin" ? "Sign In" : "Create Account"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>

                  {mode === "signin" && (
                    <button
                      type="button"
                      onClick={() => setForgotMode(true)}
                      className="w-full text-sm text-primary hover:underline transition-colors"
                    >
                      Forgot Password?
                    </button>
                  )}
                  </>)}
                </form>
              </motion.div>
            </AnimatePresence>

            <p className="text-xs text-muted-foreground text-center mt-6">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link to="/" className="text-primary hover:underline">← Back to home</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
