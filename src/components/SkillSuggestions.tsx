import { RoleName, ROLE_SKILLS } from "@/lib/roles-data";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SkillSuggestionsProps {
  roles: RoleName[];
}

const levelValue = { Beginner: 33, Intermediate: 66, Advanced: 100 };
const levelColor = { Beginner: "text-warning", Intermediate: "text-primary", Advanced: "text-success" };

export default function SkillSuggestions({ roles }: SkillSuggestionsProps) {
  if (roles.length === 0) return null;

  // Deduplicate skills across roles
  const seen = new Set<string>();
  const skills: { skill: typeof ROLE_SKILLS[RoleName][number]; role: RoleName }[] = [];

  for (const role of roles) {
    for (const skill of ROLE_SKILLS[role]) {
      if (!seen.has(skill.name)) {
        seen.add(skill.name);
        skills.push({ skill, role });
      }
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6">
      <h3 className="text-lg font-display font-semibold text-foreground mb-5 flex items-center gap-2">
        <Zap className="w-5 h-5 text-warning" />
        Suggested Skills for Your Roles
      </h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {skills.map(({ skill, role }, i) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-secondary/50 rounded-lg p-4 border border-border/50"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-foreground">{skill.name}</span>
              <span className={`text-xs font-medium ${levelColor[skill.level]}`}>{skill.level}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{skill.description}</p>
            <Progress value={levelValue[skill.level]} className="h-1.5" />
            <span className="text-[10px] text-muted-foreground mt-1 block">For: {role}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
