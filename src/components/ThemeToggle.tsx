import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className, collapsed }: { className?: string; collapsed?: boolean }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  if (!mounted) {
    return (
      <div className={cn("h-9 w-9 rounded-xl bg-accent/40 animate-pulse", className)} aria-hidden />
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "rounded-xl border border-border/60 bg-accent/20 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
            collapsed && "w-full",
            className,
          )}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          onClick={() => setTheme(isDark ? "light" : "dark")}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right" className="text-xs">
        {theme === "system" ? `Theme: system (${resolvedTheme})` : isDark ? "Dark mode" : "Light mode"}
      </TooltipContent>
    </Tooltip>
  );
}
