import { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { analyzeResume, ResumeAnalysisResult } from "@/lib/prediction";
import { FileText, Upload, CheckCircle, XCircle, Lightbulb, BarChart3 } from "lucide-react";
import SkillSuggestions from "@/components/SkillSuggestions";
import LearningResources from "@/components/LearningResources";
import { AVAILABLE_ROLES, RoleName } from "@/lib/roles-data";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const Resume = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<RoleName[]>([]);
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pages: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items.map((item: any) => item.str).join(" ");
      pages.push(text);
    }
    return pages.join("\n");
  };

  const extractTextFromDocx = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const extractTextFromTxt = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || "");
      reader.readAsText(file);
    });
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return extractTextFromPdf(file);
    if (ext === "docx" || ext === "doc") return extractTextFromDocx(file);
    return extractTextFromTxt(file);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (selectedRoles.length === 0) {
      toast.error("Please select at least one target role first");
      return;
    }

    setFileName(file.name);
    setLoading(true);

    try {
      const text = await extractTextFromFile(file);
      if (!text || text.trim().length < 10) {
        toast.error("Could not extract text from file. Try a different format (.txt, .pdf, .docx).");
        setLoading(false);
        return;
      }

      const analysis = analyzeResume(text, selectedRoles[0]);
      setResult(analysis);

      const { error } = await supabase.from("resume_analysis").insert({
        user_id: user.id,
        job_role: selectedRoles.join(", "),
        ats_score: analysis.atsScore,
        matched_skills: analysis.matchedSkills,
        missing_skills: analysis.missingSkills,
        suggestions: analysis.suggestions,
      });

      if (error) throw error;
      toast.success("Analysis saved!");
    } catch (error: any) {
      toast.error(error.message || "Failed to analyze resume");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = result ? (result.atsScore >= 70 ? "text-success" : result.atsScore >= 40 ? "text-warning" : "text-destructive") : "";

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Resume Analyzer</h1>
          <p className="text-muted-foreground mt-1">Get an ATS compatibility score for your resume</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-xl p-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-foreground">Target Roles</Label>
              <MultiRoleSelect selected={selectedRoles} onChange={setSelectedRoles} placeholder="Select target roles..." />
              {selectedRoles.length === 0 && <p className="text-xs text-muted-foreground">Select roles to analyze your resume against</p>}
            </div>

            <div
              className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" accept=".txt,.pdf,.doc,.docx" className="hidden" onChange={handleUpload} />
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-foreground font-medium">{fileName || "Click to upload resume"}</p>
              <p className="text-sm text-muted-foreground mt-1">Supports PDF, DOCX, and TXT files</p>
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

              {/* Score Breakdown */}
              <div className="glass rounded-xl p-6 space-y-4">
                <h3 className="text-base font-display font-semibold text-foreground flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Score Breakdown
                </h3>
                {[
                  { label: "Skills Match (50%)", value: result.breakdown.skillScore },
                  { label: "Projects (25%)", value: result.breakdown.projectScore },
                  { label: "Tools & Tech (15%)", value: result.breakdown.toolsScore },
                  { label: "Education (10%)", value: result.breakdown.educationScore },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="text-foreground font-medium">{item.value}%</span>
                    </div>
                    <Progress value={item.value} className="h-2" />
                  </div>
                ))}
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

export default Resume;
