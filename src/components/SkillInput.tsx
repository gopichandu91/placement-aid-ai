import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { X, ChevronDown, Search, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export interface UserSkill {
  skill: string;
  level: SkillLevel;
}

const COMMON_SKILLS = [
  "Python", "Java", "C++", "C", "C#", "SQL", "JavaScript", "TypeScript",
  "HTML", "CSS", "React", "Node.js", "Django", "Flask", "FastAPI",
  "Machine Learning", "Deep Learning", "Data Analysis", "Statistics",
  "TensorFlow", "PyTorch", "Pandas", "NumPy", "Scikit-learn",
  "Git", "Docker", "Kubernetes", "AWS", "Azure", "GCP",
  "Power BI", "Tableau", "Excel", "Cloud Computing", "Linux",
  "MongoDB", "PostgreSQL", "Redis", "REST APIs", "GraphQL",
  "Spring Boot", "Kotlin", "Swift", "Flutter", "React Native",
  "Figma", "Selenium", "Cypress", "Unity", "Unreal Engine",
  "Solidity", "Web3", "Blockchain", "NLP", "Computer Vision",
  "Agile", "Scrum", "JIRA", "CI/CD", "Terraform",
];

interface SkillInputProps {
  skills: UserSkill[];
  onChange: (skills: UserSkill[]) => void;
}

const levelColor: Record<SkillLevel, string> = {
  Beginner: "bg-warning/15 text-warning border-warning/25",
  Intermediate: "bg-primary/15 text-primary border-primary/25",
  Advanced: "bg-success/15 text-success border-success/25",
};

export default function SkillInput({ skills, onChange }: SkillInputProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedNames = useMemo(() => new Set(skills.map((s) => s.skill)), [skills]);

  const filtered = useMemo(
    () => COMMON_SKILLS.filter(
      (s) => s.toLowerCase().includes(search.toLowerCase()) && !selectedNames.has(s)
    ),
    [search, selectedNames]
  );

  const addSkill = (skill: string) => {
    if (!selectedNames.has(skill)) {
      onChange([...skills, { skill, level: "Intermediate" }]);
    }
  };

  const removeSkill = (skill: string) => {
    onChange(skills.filter((s) => s.skill !== skill));
  };

  const updateLevel = (skill: string, level: SkillLevel) => {
    onChange(skills.map((s) => (s.skill === skill ? { ...s, level } : s)));
  };

  const addCustomSkill = () => {
    const trimmed = search.trim();
    if (trimmed && !selectedNames.has(trimmed)) {
      onChange([...skills, { skill: trimmed, level: "Intermediate" }]);
      setSearch("");
    }
  };

  return (
    <div className="space-y-3">
      {/* Skill Selector */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center justify-between w-full min-h-[44px] px-3 py-2 rounded-xl border border-border bg-secondary text-sm text-foreground hover:border-primary/50 transition-all duration-200 text-left"
          >
            <span className="text-muted-foreground">
              {skills.length === 0 ? "Search and add your skills..." : `${skills.length} skill${skills.length > 1 ? "s" : ""} selected — add more`}
            </span>
            <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 ml-2 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[340px] p-0 bg-card border-border rounded-xl overflow-hidden" align="start">
          <div className="p-3 border-b border-border/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search skills..."
                className="pl-9 bg-secondary border-border h-9 text-sm rounded-lg"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomSkill();
                  }
                }}
              />
            </div>
          </div>
          <ScrollArea className="h-[240px]">
            <div className="p-2 space-y-0.5">
              {search.trim() && !COMMON_SKILLS.some((s) => s.toLowerCase() === search.trim().toLowerCase()) && !selectedNames.has(search.trim()) && (
                <button
                  type="button"
                  onClick={addCustomSkill}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-primary hover:bg-primary/10 transition-all duration-150 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add "{search.trim()}"
                </button>
              )}
              {filtered.length === 0 && !search.trim() && (
                <p className="text-sm text-muted-foreground text-center py-6">All skills selected!</p>
              )}
              {filtered.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => addSkill(skill)}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-secondary transition-all duration-150"
                >
                  <span className="flex items-center gap-2.5">
                    <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                    {skill}
                  </span>
                </button>
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {/* Selected Skills with Level Selectors */}
      <AnimatePresence mode="popLayout">
        {skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {skills.map((s) => (
              <motion.div
                key={s.skill}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                layout
                className="flex items-center gap-2 bg-secondary/50 border border-border/50 rounded-lg px-3 py-2"
              >
                <Badge variant="outline" className={`${levelColor[s.level]} text-xs rounded-md px-2 py-0.5 font-medium`}>
                  {s.skill}
                </Badge>
                <div className="ml-auto flex items-center gap-2">
                  <Select value={s.level} onValueChange={(v) => updateLevel(s.skill, v as SkillLevel)}>
                    <SelectTrigger className="h-7 w-[120px] text-xs bg-background border-border rounded-md">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <button
                    type="button"
                    onClick={() => removeSkill(s.skill)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
