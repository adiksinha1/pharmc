import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Activity,
  BarChart3,
  FileText,
  Settings,
  Brain,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  User,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ParticleBackground } from "@/components/effects/ParticleBackground";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard", path: "/dashboard" },
  { icon: <Search className="w-5 h-5" />, label: "New Query", path: "/dashboard/query" },
  { icon: <Activity className="w-5 h-5" />, label: "Agent Monitor", path: "/dashboard/agents" },
  { icon: <BarChart3 className="w-5 h-5" />, label: "Visual Insights", path: "/dashboard/insights" },
  { icon: <FileText className="w-5 h-5" />, label: "Reports", path: "/dashboard/reports" },
];

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 glass-effect border-b border-border/50">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/20">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <span className="font-bold text-xl text-foreground hidden md:block">
                PharmaRepurpose AI
              </span>
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className="text-muted-foreground hover:text-foreground"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Button>
            <div className="w-px h-8 bg-border/50 mx-2 hidden md:block" />
            <Button variant="ghost" size="sm" className="gap-2 hidden md:flex">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <span className="text-foreground">Dr. Smith</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex pt-16 min-h-screen">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed left-0 top-16 bottom-0 z-40 flex flex-col border-r border-border/50 bg-card/50 backdrop-blur-xl transition-all duration-300",
            collapsed ? "w-16" : "w-64"
          )}
        >
          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <span className={cn(isActive && "text-primary")}>{item.icon}</span>
                  {!collapsed && (
                    <span className="font-medium text-sm">{item.label}</span>
                  )}
                  {isActive && !collapsed && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="p-3 border-t border-border/50 space-y-1">
            <Link
              to="/dashboard/settings"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            >
              <Settings className="w-5 h-5" />
              {!collapsed && <span className="font-medium text-sm">Settings</span>}
            </Link>
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            >
              <LogOut className="w-5 h-5" />
              {!collapsed && <span className="font-medium text-sm">Exit Dashboard</span>}
            </Link>
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-card border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </aside>

        {/* Main Content */}
        <main
          className={cn(
            "flex-1 transition-all duration-300 relative z-10",
            collapsed ? "ml-16" : "ml-64"
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
