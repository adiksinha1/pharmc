import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "@/components/ui/icons";
import PasswordMeter from "@/components/ui/password-meter";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/dashboard";
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  // Debug: log localStorage on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem('pharma_users');
    console.log('📦 Current localStorage users:', storedUsers || 'empty');
  }, []);

  const clearStorageAndRetry = () => {
    console.log('🔴 NUCLEAR CLEAR STARTED');
    
    // Log what's there before
    console.log('Before:', {
      pharma_users: localStorage.getItem('pharma_users'),
      pharma_current_user: localStorage.getItem('pharma_current_user'),
      allKeys: Object.keys(localStorage),
    });
    
    // AGGRESSIVE CLEAR
    try {
      // Method 1: Direct removal
      localStorage.removeItem('pharma_users');
      localStorage.removeItem('pharma_current_user');
      
      // Method 2: Clear all
      localStorage.clear();
      sessionStorage.clear();
      
      // Method 3: Verify gone
      const verification = {
        pharma_users: localStorage.getItem('pharma_users'),
        pharma_current_user: localStorage.getItem('pharma_current_user'),
        allKeys: Object.keys(localStorage),
      };
      console.log('After:', verification);
      
      if (verification.pharma_users === null && verification.pharma_current_user === null) {
        console.log('✅ Storage successfully cleared!');
      } else {
        console.warn('⚠️ Storage may not be fully cleared');
      }
    } catch (e) {
      console.error('❌ Error clearing storage:', e);
    }
    
    // Reset form completely
    setName('');
    setEmail('');
    setPassword('');
    setError(null);
    setShowPassword(false);
    
    toast({ 
      title: "✅ Storage Cleared!", 
      description: "All data removed. Form is blank. Try signup again with a fresh email.",
    });
    
    console.log('🟢 Clear & Retry completed');
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validation
    if (!name.trim()) {
      setError("Name is required");
      toast({ title: "Validation Error", description: "Please enter your name", variant: "destructive" });
      return;
    }
    if (!email.trim()) {
      setError("Email is required");
      toast({ title: "Validation Error", description: "Please enter your email", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      toast({ title: "Validation Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    
    const ok = await signup(name.trim(), email.trim(), password);
    if (!ok) {
      setError("This email is already registered. Click 'Clear & Retry' below to reset.");
      toast({ 
        title: "Email Already Registered", 
        description: "This email exists in storage. Click 'Clear & Retry' to reset or try logging in.",
        variant: "destructive"
      });
      return;
    }
    toast({ title: "Account created", description: `Welcome, ${name}!` });
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-muted/30 border border-border/50 rounded-xl p-6 backdrop-blur">
        <h1 className="text-2xl font-bold mb-2">Create your account</h1>
        <p className="text-sm text-muted-foreground mb-4">A quick signup to personalize your experience</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Full name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              required
              variant="glass"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Email</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              variant="glass"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Password</label>
            <div className="relative">
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                required
                variant="glass"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <PasswordMeter password={password} />
          </div>
          {error && (
            <div className="space-y-2">
              <p className="text-sm text-rose-400">{error}</p>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  onClick={clearStorageAndRetry}
                  variant="outline"
                  className="flex-1"
                >
                  Clear & Retry
                </Button>
                <Button 
                  type="button" 
                  onClick={() => {
                    // Force reload everything
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.reload();
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Fresh Start
                </Button>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <Button type="submit" variant="glow">Create account</Button>
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">Already have an account?</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
