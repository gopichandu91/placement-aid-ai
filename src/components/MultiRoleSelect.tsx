import { AVAILABLE_ROLES, RoleName } from "@/lib/roles-data";
import { Badge } from "@/components/ui/badge";
import { X, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";

interface MultiRoleSelectProps {
  selected: RoleName[];
  onChange: (roles: RoleName[]) => void;
  placeholder?: string;
}

export default function MultiRoleSelect({ selected, onChange, placeholder = "Select roles..." }: MultiRoleSelectProps) {
  const [open, setOpen] = useState(false);

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
          className="flex items-center justify-between w-full min-h-[44px] px-3 py-2 rounded-md border border-border bg-secondary text-sm text-foreground hover:border-primary/50 transition-colors text-left"
        >
          <div className="flex flex-wrap gap-1.5 flex-1">
            {selected.length === 0 && <span className="text-muted-foreground">{placeholder}</span>}
            {selected.map((role) => (
              <Badge
                key={role}
                variant="secondary"
                className="bg-primary/10 text-primary border-primary/20 gap-1 text-xs"
              >
                {role}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(role);
                  }}
                />
              </Badge>
            ))}
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-2 bg-card border-border" align="start">
        <div className="space-y-1">
          {AVAILABLE_ROLES.map((role) => {
            const isSelected = selected.includes(role);
            return (
              <button
                key={role}
                type="button"
                onClick={() => toggle(role)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  isSelected
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${
                    isSelected ? "bg-primary border-primary text-primary-foreground" : "border-border"
                  }`}>
                    {isSelected && "✓"}
                  </span>
                  {role}
                </span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
