import { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { analyzeResume, ResumeAnalysisResult } from "@/lib/prediction";
import { FileText, Upload, CheckCircle, XCircle, Lightbulb } from "lucide-react";

const JOB_ROLES = ["Software Developer", "Data Scientist", "Web Developer", "DevOps Engineer", "Mobile Developer"];

const Resume = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null);
  const [jobRole, setJobRole] = useState("Software Developer");
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const extractTextFromFile = async (file: File): Promise<string> => {
    // For simplicity, read as text. For real PDFs you'd use pdfjs-dist.
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        resolve(text || "");
      };
      reader.readAsText(file);
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!user) return;

    setFileName(file.name);
    setLoading(true);

    try {
      const text = await extractTextFromFile(file);
      if (!text || text.length < 10) {
        toast.error("Could not extract text from file. Try a .txt file or paste your resume content.");
        setLoading(false);
        return;
      }

      const analysis = analyzeResume(text, jobRole);
      setResult(analysis);

      // Save to DB
      const { error } = await supabase.from("resume_analysis").insert({
        user_id: user.id,
        job_role: jobRole,
        ats_score: analysis.atsScore,
        matched_skills: analysis.matchedSkills,
        missing_skills: analysis.missingSkills,
        suggestions: analysis.suggestions,
      });

      if (error) throw error;
      toast.success("Analysis saved!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = result ? (result.atsScore >= 70 ? "text-success" : result.atsScore >= 40 ? "text-warning" : "text-destructive") : "";

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Resume Analyzer</h1>
          <p className="text-muted-foreground mt-1">Get an ATS compatibility score for your resume</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-xl p-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-foreground">Target Job Role</Label>
              <Select value={jobRole} onValueChange={setJobRole}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {JOB_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div
              className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" accept=".txt,.pdf,.doc,.docx" className="hidden" onChange={handleUpload} />
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-foreground font-medium">{fileName || "Click to upload resume"}</p>
              <p className="text-sm text-muted-foreground mt-1">Supports .txt files (best results)</p>
            </div>

            {loading && (
              <div className="text-center py-4">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground mt-2">Analyzing your resume...</p>
              </div>
            )}
          </motion.div>

          {/* Result */}
          {result && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="glass rounded-xl p-6 text-center glow-border">
                <FileText className="w-10 h-10 text-primary mx-auto mb-3" />
                <div className={`text-5xl font-display font-bold ${scoreColor} mb-1`}>{result.atsScore}%</div>
                <div className="text-muted-foreground">ATS Compatibility Score</div>
              </div>

              <div className="glass rounded-xl p-6">
                <h3 className="text-base font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  Matched Skills ({result.matchedSkills.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.matchedSkills.map((skill) => (
                    <span key={skill} className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium">{skill}</span>
                  ))}
                  {result.matchedSkills.length === 0 && <p className="text-sm text-muted-foreground">None found</p>}
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h3 className="text-base font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-destructive" />
                  Missing Skills ({result.missingSkills.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills.slice(0, 10).map((skill) => (
                    <span key={skill} className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h3 className="text-base font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-warning" />
                  Suggestions
                </h3>
                <ul className="space-y-2">
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
      </div>
    </AppLayout>
  );
};

export default Resume;
