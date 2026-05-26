import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Newspaper, Lock, User as UserIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8085";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { 
        toast.error("कृपया ईमेल और पासवर्ड दोनों भरें!"); 
        return; 
    }

    setIsLoading(true);

    try {
        const response = await fetch(`${API_URL}/api/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        });

        if (response.ok) {
            const userData = await response.json();
            localStorage.setItem("user", JSON.stringify(userData));
            
            login(
              userData.name || "Admin", 
              userData.role || "admin", 
              userData.email || email,  
              userData.token || "no-token"   
            ); 

            toast.success(`स्वागत है ${userData.name || "Admin"}!`);
            navigate("/admin");
        } else {
            toast.error("ईमेल या पासवर्ड गलत है!");
        }
    } catch (error) {
        toast.error("सर्वर से कनेक्ट नहीं हो पाया।");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    // 👉 असली न्यूज़ वाली ऑनलाइन बैकग्राउंड इमेज (कोई डाउनलोड की ज़रूरत नहीं)
    <div 
      className="relative flex min-h-screen items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1495020689067-958852a7765e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80')" }}
    >
      {/* 👉 इमेज के ऊपर एक हल्का डार्क कवर (ताकि टेक्स्ट साफ दिखे) */}
      <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-[3px]"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-orange-500 shadow-lg shadow-primary/20 border border-white/20">
            <Newspaper className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">APNO RAJASTHAN</h1>
          <p className="mt-2 text-sm text-slate-300 font-medium tracking-wide">Admin Panel · व्यवस्थापक लॉगिन</p>
        </div>
        
        {/* 👉 शीशे जैसा चमकता हुआ (Glassmorphism) कार्ड */}
        <div className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="u" className="text-white font-semibold">Email Address</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
                <Input 
                  id="u" 
                  type="email" 
                  className="pl-10 h-12 bg-black/30 border-white/20 text-white placeholder:text-slate-400 focus-visible:ring-primary focus-visible:border-primary transition-all" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="admin@gmail.com" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="p" className="text-white font-semibold">Password</Label>
                <Link to="/forgot-password" className="text-xs text-primary-foreground font-medium hover:underline transition-all">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
                <Input 
                  id="p" 
                  type="password" 
                  className="pl-10 h-12 bg-black/30 border-white/20 text-white placeholder:text-slate-400 focus-visible:ring-primary focus-visible:border-primary transition-all" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••"
                />
              </div>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full h-12 text-base font-bold gradient-primary shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2"/> : null}
              {isLoading ? "Logging in..." : "Secure Login"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}