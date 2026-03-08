import { motion } from "framer-motion";
import { CheckCircle, TrendingUp, AlertTriangle, Lightbulb, Zap, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { EnhancedPredictionResult } from "@/lib/prediction";

interface PredictionResultProps {
  result: EnhancedPredictionResult;
}

export default function PredictionResult({ result }: PredictionResultProps) {
  const classColor = result.classification === "High" ? "text-success" : result.classification === "Medium" ? "text-warning" : "text-destructive";
  const ClassIcon = result.classification === "High" ? CheckCircle : result.classification === "Medium" ? TrendingUp : AlertTriangle;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
      {/* Score Card */}
      <div className="glass rounded-xl p-6 text-center glow-border animate-pulse-glow">
        <ClassIcon className={`w-12 h-12 ${classColor} mx-auto mb-3`} />
        <div className="text-5xl font-display font-bold text-foreground mb-1">{result.probability.toFixed(1)}%</div>
        <div className={`text-lg font-semibold ${classColor}`}>{result.classification} Probability</div>
      </div>

      {/* Personalized Reason */}
      {result.reason && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-xl p-5">
          <h3 className="text-sm font-display font-semibold text-foreground mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" /> Why This Score?
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{result.reason}</p>
        </motion.div>
      )}

      {/* Skill Strengths */}
      {result.skillStrengths.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass rounded-xl p-5">
          <h3 className="text-sm font-display font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" /> Your Skill Strengths
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.skillStrengths.map((s) => (
              <Badge key={s} variant="outline" className="bg-success/10 text-success border-success/25 text-xs">{s}</Badge>
            ))}
          </div>
        </motion.div>
      )}

      {/* Skills to Improve */}
      {result.skillsToImprove.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-xl p-5">
          <h3 className="text-sm font-display font-semibold text-foreground mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-warning" /> Skills to Improve
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.skillsToImprove.map((s) => (
              <Badge key={s} variant="outline" className="bg-warning/10 text-warning border-warning/25 text-xs">{s}</Badge>
            ))}
          </div>
        </motion.div>
      )}

      {/* Score Breakdown */}
      {result.breakdown && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass rounded-xl p-5">
          <h3 className="text-sm font-display font-semibold text-foreground mb-3">Score Breakdown</h3>
          <div className="space-y-3">
            {[
              { label: "Skill Match", value: result.breakdown.skillMatchScore, weight: "40%" },
              { label: "Skill Level", value: result.breakdown.skillLevelScore, weight: "25%" },
              { label: "Education", value: result.breakdown.educationScore, weight: "15%" },
              { label: "Experience", value: result.breakdown.experienceScore, weight: "10%" },
              { label: "Other Factors", value: result.breakdown.otherScore, weight: "10%" },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{item.label} <span className="text-muted-foreground/60">({item.weight})</span></span>
                  <span className="text-foreground font-medium">{Math.round(item.value)}%</span>
                </div>
                <Progress value={item.value} className="h-1.5" />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Suggestions */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-xl p-5">
        <h3 className="text-sm font-display font-semibold text-foreground mb-3 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-warning" /> Improvement Suggestions
        </h3>
        <ul className="space-y-2.5">
          {result.suggestions.map((s, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              {s}
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}
