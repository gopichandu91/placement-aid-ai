import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { predictPlacement, PredictionInput, PredictionResult } from "@/lib/prediction";
import { Target, TrendingUp, AlertTriangle, CheckCircle, Lightbulb } from "lucide-react";
import MultiRoleSelect from "@/components/MultiRoleSelect";
import SkillSuggestions from "@/components/SkillSuggestions";
import LearningResources from "@/components/LearningResources";
import { RoleName } from "@/lib/roles-data";

const Predict = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<RoleName[]>([]);

  const [form, setForm] = useState({
    fullName: "",
    cgpa: "",
    internships: "",
    projects: "",
    certifications: "",
    codingSkill: "Intermediate" as "Beginner" | "Intermediate" | "Advanced",
    communicationRating: "",
    backlogs: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (selectedRoles.length === 0) {
      toast.error("Please select at least one target role");
      return;
    }
    setLoading(true);

    try {
      const input: PredictionInput = {
        cgpa: parseFloat(form.cgpa),
        internships: parseInt(form.internships) || 0,
        projects: parseInt(form.projects) || 0,
        certifications: parseInt(form.certifications) || 0,
        codingSkill: form.codingSkill,
        communicationRating: parseInt(form.communicationRating) || 5,
        backlogs: form.backlogs,
      };

      const prediction = predictPlacement(input);
      setResult(prediction);

      const { error } = await supabase.from("prediction_history").insert({
        user_id: user.id,
        full_name: form.fullName,
        cgpa: input.cgpa,
        internships: input.internships,
        projects: input.projects,
        certifications: input.certifications,
        coding_skill: input.codingSkill,
        communication_rating: input.communicationRating,
        backlogs: input.backlogs,
        probability: prediction.probability,
        classification: prediction.classification,
        suggestions: prediction.suggestions,
      });

      if (error) throw error;
      toast.success("Prediction saved!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const classColor = result?.classification === "High" ? "text-success" : result?.classification === "Medium" ? "text-warning" : "text-destructive";
  const classIcon = result?.classification === "High" ? CheckCircle : result?.classification === "Medium" ? TrendingUp : AlertTriangle;
  const ClassIcon = classIcon;

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Placement Predictor</h1>
          <p className="text-muted-foreground mt-1">Enter your academic profile to predict placement probability</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-xl p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground">Full Name</Label>
                <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Enter your name" className="bg-secondary border-border" required />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Target Roles</Label>
                <MultiRoleSelect selected={selectedRoles} onChange={setSelectedRoles} placeholder="Select target roles..." />
                {selectedRoles.length === 0 && <p className="text-xs text-muted-foreground">Select one or more roles you're targeting</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">CGPA</Label>
                  <Input type="number" step="0.01" min="0" max="10" value={form.cgpa} onChange={(e) => setForm({ ...form, cgpa: e.target.value })} placeholder="8.5" className="bg-secondary border-border" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Internships</Label>
                  <Input type="number" min="0" max="20" value={form.internships} onChange={(e) => setForm({ ...form, internships: e.target.value })} placeholder="2" className="bg-secondary border-border" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Projects</Label>
                  <Input type="number" min="0" max="50" value={form.projects} onChange={(e) => setForm({ ...form, projects: e.target.value })} placeholder="5" className="bg-secondary border-border" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Certifications</Label>
                  <Input type="number" min="0" max="30" value={form.certifications} onChange={(e) => setForm({ ...form, certifications: e.target.value })} placeholder="3" className="bg-secondary border-border" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Coding Skill Level</Label>
                <Select value={form.codingSkill} onValueChange={(v) => setForm({ ...form, codingSkill: v as any })}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Communication Rating (1-10)</Label>
                <Input type="number" min="1" max="10" value={form.communicationRating} onChange={(e) => setForm({ ...form, communicationRating: e.target.value })} placeholder="7" className="bg-secondary border-border" required />
              </div>

              <div className="flex items-center justify-between py-2">
                <Label className="text-foreground">Any Backlogs?</Label>
                <Switch checked={form.backlogs} onCheckedChange={(v) => setForm({ ...form, backlogs: v })} />
              </div>

              <Button type="submit" disabled={loading} className="w-full gradient-bg text-primary-foreground font-semibold h-11 rounded-xl hover:opacity-90 transition-opacity">
                <Target className="w-4 h-4 mr-2" />
                {loading ? "Analyzing..." : "Predict Placement"}
              </Button>
            </form>
          </motion.div>

          {/* Result */}
          {result && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="glass rounded-xl p-6 text-center glow-border animate-pulse-glow">
                <ClassIcon className={`w-12 h-12 ${classColor} mx-auto mb-3`} />
                <div className="text-5xl font-display font-bold text-foreground mb-1">{result.probability.toFixed(1)}%</div>
                <div className={`text-lg font-semibold ${classColor}`}>{result.classification} Probability</div>
              </div>

              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-warning" />
                  Improvement Suggestions
                </h3>
                <ul className="space-y-3">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </div>

        {/* Skill Suggestions & Resources - shown after prediction or when roles selected */}
        {selectedRoles.length > 0 && (
          <div className="space-y-8">
            <SkillSuggestions roles={selectedRoles} />
            <LearningResources roles={selectedRoles} />
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Predict;
