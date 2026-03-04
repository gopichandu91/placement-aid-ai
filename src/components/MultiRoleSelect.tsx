import { AVAILABLE_ROLES, RoleName } from "@/lib/roles-data";
import { Badge } from "@/components/ui/badge";
import { X, ChevronDown, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useMemo } from "react";

interface MultiRoleSelectProps {
  selected: RoleName[];
  onChange: (roles: RoleName[]) => void;
  placeholder?: string;
}

export default function MultiRoleSelect({ selected, onChange, placeholder = "Select roles..." }: MultiRoleSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => AVAILABLE_ROLES.filter((role) => role.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  const toggle = (role: RoleName) => {
    if (selected.includes(role)) {
      onChange(selected.filter((r) => r !== role));
    } else {
      onChange([...selected, role]);
    }
  };

  const remove = (role: RoleName) => {
    onChange(selected.filter((r) => r !== role));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center justify-between w-full min-h-[44px] px-3 py-2 rounded-xl border border-border bg-secondary text-sm text-foreground hover:border-primary/50 transition-all duration-200 text-left group"
        >
          <div className="flex flex-wrap gap-1.5 flex-1">
            {selected.length === 0 && <span className="text-muted-foreground">{placeholder}</span>}
            {selected.map((role) => (
              <Badge
                key={role}
                variant="secondary"
                className="bg-primary/15 text-primary border-primary/25 gap-1 text-xs rounded-lg px-2.5 py-1 font-medium hover:bg-primary/25 transition-colors"
              >
                {role}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-destructive transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(role);
                  }}
                />
              </Badge>
            ))}
          </div>
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
              placeholder="Search roles..."
              className="pl-9 bg-secondary border-border h-9 text-sm rounded-lg"
              autoFocus
            />
          </div>
          {selected.length > 0 && (
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">{selected.length} selected</span>
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-xs text-destructive hover:text-destructive/80 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
        <ScrollArea className="h-[280px]">
          <div className="p-2 space-y-0.5">
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">No roles found</p>
            )}
            {filtered.map((role) => {
              const isSelected = selected.includes(role);
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggle(role)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                    isSelected
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className={`w-4 h-4 rounded border-2 flex items-center justify-center text-[10px] transition-all duration-150 ${
                      isSelected ? "bg-primary border-primary text-primary-foreground scale-110" : "border-muted-foreground/40"
                    }`}>
                      {isSelected && "✓"}
                    </span>
                    {role}
                  </span>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
