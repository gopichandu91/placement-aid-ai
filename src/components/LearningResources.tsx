import { RoleName, ROLE_RESOURCES, getSourceIcon, getSourceColor } from "@/lib/roles-data";
import { motion } from "framer-motion";
import { BookOpen, ExternalLink, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface LearningResourcesProps {
  roles: RoleName[];
}

export default function LearningResources({ roles }: LearningResourcesProps) {
  const [search, setSearch] = useState("");

  if (roles.length === 0) return null;

  // Collect resources, deduplicate by URL
  const seen = new Set<string>();
  const allResources: { resource: (typeof ROLE_RESOURCES)[RoleName][number]; role: RoleName }[] = [];

  for (const role of roles) {
    for (const resource of ROLE_RESOURCES[role]) {
      if (!seen.has(resource.url)) {
        seen.add(resource.url);
        allResources.push({ resource, role });
      }
    }
  }

  const filtered = search
    ? allResources.filter(
        ({ resource }) =>
          resource.title.toLowerCase().includes(search.toLowerCase()) ||
          resource.description.toLowerCase().includes(search.toLowerCase()) ||
          resource.source.toLowerCase().includes(search.toLowerCase())
      )
    : allResources;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h3 className="text-lg font-display font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Learning Resources
        </h3>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="pl-9 bg-secondary border-border h-9 text-sm"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map(({ resource, role }, i) => (
          <motion.a
            key={resource.url}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group bg-secondary/50 rounded-lg p-4 border border-border/50 hover:border-primary/30 hover:bg-secondary transition-all block"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getSourceIcon(resource.source)}</span>
                <Badge variant="secondary" className={`text-[10px] ${getSourceColor(resource.source)}`}>
                  {resource.source}
                </Badge>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
            </div>
            <h4 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
              {resource.title}
            </h4>
            <p className="text-xs text-muted-foreground">{resource.description}</p>
            <span className="text-[10px] text-muted-foreground mt-2 block">For: {role}</span>
          </motion.a>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">No resources found matching your search.</p>
      )}
    </motion.div>
  );
}
