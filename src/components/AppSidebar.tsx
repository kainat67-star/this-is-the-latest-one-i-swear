import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  Table2,
  Lightbulb,
  Settings,
  LogOut,
  Menu,
  X,
  Activity,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Channel Comparison", url: "/channels", icon: BarChart3 },
  { title: "Campaign Details", url: "/campaigns", icon: Table2 },
  { title: "Insights", url: "/insights", icon: Lightbulb },
  { title: "Settings", url: "/settings", icon: Settings },
] as const;

function NavItem({
  item,
  active,
  collapsed,
  onNavigate,
  layoutInstance,
}: {
  item: (typeof navItems)[number];
  active: boolean;
  collapsed: boolean;
  onNavigate: () => void;
  layoutInstance: "desktop" | "drawer";
}) {
  const inner = (
    <Link
      to={item.url}
      onClick={onNavigate}
      className={cn(
        "relative flex items-center gap-3 rounded-xl text-[13px] font-medium transition-all duration-200 group",
        collapsed ? "justify-center px-2 py-3" : "px-4 py-3",
        active ? "text-primary" : "text-sidebar-foreground hover:text-foreground",
      )}
    >
      {active && (
        <motion.div
          layoutId={`nav-active-bg-${layoutInstance}-${item.url}`}
          className="absolute inset-0 rounded-xl bg-primary/8 border border-primary/15"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          style={{ boxShadow: "0 0 20px -4px hsl(160 84% 39% / 0.15)" }}
        />
      )}
      <item.icon
        className={cn(
          "w-[18px] h-[18px] relative z-10 shrink-0 transition-colors",
          active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
        )}
      />
      {!collapsed && <span className="relative z-10 truncate">{item.title}</span>}
      {!collapsed && active && <ChevronRight className="w-3.5 h-3.5 ml-auto relative z-10 text-primary/50 shrink-0" />}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{inner}</TooltipTrigger>
        <TooltipContent side="right" className="text-xs font-medium">
          {item.title}
        </TooltipContent>
      </Tooltip>
    );
  }

  return inner;
}

function SidebarContent({
  collapsed,
  onNavigate,
  toggleCollapsed,
  layoutInstance,
}: {
  collapsed: boolean;
  onNavigate: () => void;
  toggleCollapsed: () => void;
  layoutInstance: "desktop" | "drawer";
}) {
  const location = useLocation();

  const handleLogout = () => {
    toast.success("Signed out", { description: "You have been logged out successfully." });
    onNavigate();
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <div
        className={cn(
          "flex items-center gap-3 shrink-0 border-b border-border/40",
          collapsed ? "px-3 py-5 flex-col" : "px-5 py-6 justify-between",
        )}
      >
        <div className={cn("flex items-center gap-3 min-w-0", collapsed && "flex-col")}>
          <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center relative shrink-0">
            <Activity className="w-5 h-5 text-primary" />
            <div className="absolute inset-0 rounded-xl bg-primary/10 blur-md" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <span className="text-foreground font-bold text-[17px] tracking-tight block leading-none">AdPulse</span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">Analytics</span>
            </div>
          )}
        </div>
        {!collapsed && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={toggleCollapsed}
                className="hidden lg:flex p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              Collapse sidebar
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {collapsed && (
        <div className="hidden lg:flex justify-center py-2 border-b border-border/40">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={toggleCollapsed}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all"
                aria-label="Expand sidebar"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              Expand sidebar
            </TooltipContent>
          </Tooltip>
        </div>
      )}

      <div className={cn("px-3 mb-2 mt-4", collapsed && "text-center")}>
        {!collapsed ? (
          <span className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase px-1">Menu</span>
        ) : (
          <span className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase block">·</span>
        )}
      </div>

      <nav className="flex-1 px-2 space-y-0.5 min-h-0 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.url}
            item={item}
            active={location.pathname === item.url}
            collapsed={collapsed}
            onNavigate={onNavigate}
            layoutInstance={layoutInstance}
          />
        ))}
      </nav>

      <div className={cn("p-3 mt-auto border-t border-border/40 space-y-2 shrink-0", collapsed && "px-2")}>
        <div className={cn("flex items-center gap-2", collapsed ? "flex-col" : "flex-row")}>
          <ThemeToggle collapsed={collapsed} className={cn(collapsed ? "w-full" : "shrink-0")} />
        </div>

        <div
          className={cn(
            "rounded-xl border border-border/50 bg-accent/25 backdrop-blur-sm",
            collapsed ? "p-2 flex flex-col items-center gap-2" : "p-3",
          )}
        >
          <div className={cn("flex items-center gap-3", collapsed ? "flex-col" : "flex-row w-full")}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
              JD
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate leading-tight">John Doe</p>
                <p className="text-[11px] text-muted-foreground truncate">john@company.com</p>
              </div>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleLogout}
                  className={cn(
                    "rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]",
                    collapsed ? "p-2" : "p-2",
                  )}
                  aria-label="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                Log out
              </TooltipContent>
            </Tooltip>
          </div>
          {!collapsed && (
            <button
              type="button"
              onClick={handleLogout}
              className="mt-3 w-full text-xs font-semibold py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function AppSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { collapsed, toggleCollapsed } = useSidebar();
  const width = collapsed ? 88 : 264;

  const asideClass =
    "flex flex-col fixed inset-y-0 left-0 z-40 border-r border-border/50 bg-sidebar text-sidebar-foreground transition-[width] duration-300 ease-out";

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl glass-card text-foreground hover:bg-accent/50 transition-colors shadow-lg"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <aside className={cn(asideClass, "hidden lg:flex")} style={{ width }}>
        <SidebarContent
          collapsed={collapsed}
          onNavigate={() => setMobileOpen(false)}
          toggleCollapsed={toggleCollapsed}
          layoutInstance="desktop"
        />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-md z-50"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className={cn(asideClass, "lg:hidden w-[280px] shadow-2xl")}
            >
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors z-10"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
              <SidebarContent
                collapsed={false}
                onNavigate={() => setMobileOpen(false)}
                toggleCollapsed={toggleCollapsed}
                layoutInstance="drawer"
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
