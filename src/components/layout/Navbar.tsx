import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles, SunMedium, Moon, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/framework", label: "Framework" },
  { href: "/#workflow", label: "Workflow" },
  { href: "/demo", label: "Demo" },
  { href: "/#benefits", label: "Benefits" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = saved ? saved === 'dark' : prefersDark;
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "backdrop-blur-xl bg-background/80 border-b border-border/50 py-3"
          : "py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-bold text-foreground">
            Pharma<span className="text-primary">AI</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            link.href.startsWith('/#') ? (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                to={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
              >
                {link.label}
              </Link>
            )
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {/* Theme toggle */}
          <button
            aria-label="Toggle theme"
            className="p-2 rounded-md hover:bg-secondary/60 text-foreground"
            onClick={toggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <SunMedium className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              aria-label="Notifications"
              className="p-2 rounded-md hover:bg-secondary/60 text-foreground relative"
              onClick={() => setShowNotifications(v => !v)}
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 rounded-md border border-border bg-background/95 backdrop-blur-xl shadow-lg">
                <div className="p-3">
                  <p className="text-sm text-muted-foreground">No notifications</p>
                </div>
              </div>
            )}
          </div>

          {/* Auth Links */}
          <AuthArea />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/50 p-4 animate-slide-up">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              link.href.startsWith('/#') ? (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
                >
                  {link.label}
                </Link>
              )
            ))}
            <div className="flex gap-2 mt-4">
              <Link to="/signup" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="glow" size="sm" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="mt-3 flex gap-2">
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">
                <Button variant="ghost" className="w-full">Login</Button>
              </Link>
              <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">
                <Button variant="glow" className="w-full">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function AuthArea() {
  try {
    const { user, logout } = useAuth();
    if (user) {
      return (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground">{`Hi, ${user.name}`}</span>
          <Button variant="ghost" size="sm" onClick={() => logout()}>
            Logout
          </Button>
        </div>
      );
    }
  } catch (e) {
    // if provider not mounted yet, fall back to links
  }

  return (
    <div className="flex items-center gap-2">
      <Link to="/login">
        <Button variant="ghost" size="sm">Login</Button>
      </Link>
      <Link to="/signup">
        <Button variant="glow" size="sm">Sign Up</Button>
      </Link>
    </div>
  );
}
