import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Brain, Lock, Eye, EyeOff, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const getPasswordStrength = (pw: string) => {
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
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden items-center justify-center p-6">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-[100px] gradient-bg pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-display font-bold gradient-text">CareerPredict AI</span>
          </Link>
        </div>

        <div className="glass rounded-2xl p-8 glow-border">
          {isRecovery ? (
            <>
              <h2 className="text-2xl font-display font-bold text-foreground mb-1">Set New Password</h2>
              <p className="text-muted-foreground text-sm mb-6">Create a strong new password for your account.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground text-sm">New Password</Label>
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
                      minLength={8}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {password.length > 0 && (
                    <div className="space-y-1">
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${strength.color}`} style={{ width: strength.width }} />
                      </div>
                      <p className="text-xs text-muted-foreground">Password strength: {strength.label}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground text-sm">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 rounded-xl bg-secondary/50 border-border focus:border-primary focus:ring-primary"
                      required
                      minLength={8}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword.length > 0 && password !== confirmPassword && (
                    <p className="text-xs text-destructive">Passwords do not match</p>
                  )}
                </div>

                <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl gradient-bg text-primary-foreground font-semibold text-sm">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Update Password <ArrowRight className="w-4 h-4 ml-2" /></>}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
              <h2 className="text-2xl font-display font-bold text-foreground">Check Your Email</h2>
              <p className="text-muted-foreground text-sm">
                If you arrived here without a reset link, please go back and request a password reset first.
              </p>
              <Link to="/auth">
                <Button variant="outline" className="rounded-xl">Back to Sign In</Button>
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
