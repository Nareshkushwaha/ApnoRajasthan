import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Lock, KeyRound, Loader2 } from "lucide-react";

import { API_BASE_URL } from "@/lib/api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e: any) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter email");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        toast.success("OTP आपकी ईमेल पर भेज दिया गया है!");
        setStep(2);
      } else {
        toast.error("ईमेल नहीं मिला! कृपया सही ईमेल दर्ज करें।");
      }
    } catch (err) {
      toast.error("सर्वर एरर!");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e: any) => {
    e.preventDefault();
    if (!otp || !newPassword) return toast.error("Please enter OTP and New Password");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      if (res.ok) {
        toast.success("पासवर्ड सफलतापूर्वक बदल गया! अब आप लॉगिन कर सकते हैं।");
        navigate("/login");
      } else {
        toast.error("गलत OTP!");
      }
    } catch (err) {
      toast.error("सर्वर एरर!");
    } finally {
      setLoading(false);
    }
  };

  return (
    // 👉 असली न्यूज़ वाली ऑनलाइन बैकग्राउंड इमेज
    <div 
      className="relative flex min-h-screen items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1495020689067-958852a7765e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80')" }}
    >
      
      {/* 👉 डार्क कवर */}
      <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-[3px]"></div>

      <div className="w-full max-w-md relative z-10">
        
        {/* 👉 शीशे जैसा (Glassmorphism) कार्ड */}
        <div className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white drop-shadow-md">Forgot Password</h1>
            <p className="text-sm text-slate-300 mt-2 font-medium">पासवर्ड भूल गए? कोई बात नहीं!</p>
          </div>
          
          <div>
            {step === 1 ? (
              <form onSubmit={sendOtp} className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-white font-semibold">Registered Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
                    <Input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="pl-10 h-12 bg-black/30 border-white/20 text-white placeholder:text-slate-400 focus-visible:ring-primary focus-visible:border-primary transition-all" 
                      placeholder="admin@gmail.com" 
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-12 text-base font-bold gradient-primary shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all" disabled={loading}>
                  {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2"/> : null}
                  {loading ? "Sending..." : "Send OTP"}
                </Button>
              </form>
            ) : (
              <form onSubmit={resetPassword} className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-white font-semibold">Enter 4-Digit OTP</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
                    <Input 
                      type="text" 
                      maxLength={4} 
                      value={otp} 
                      onChange={(e) => setOtp(e.target.value)} 
                      className="pl-10 h-12 bg-black/30 border-white/20 text-white placeholder:text-slate-400 focus-visible:ring-primary focus-visible:border-primary tracking-[0.5em] text-center transition-all" 
                      placeholder="••••" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white font-semibold">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
                    <Input 
                      type="password" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                      className="pl-10 h-12 bg-black/30 border-white/20 text-white placeholder:text-slate-400 focus-visible:ring-primary focus-visible:border-primary transition-all" 
                      placeholder="••••••••" 
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-12 text-base font-bold gradient-primary shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all" disabled={loading}>
                  {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2"/> : null}
                  {loading ? "Saving..." : "Reset Password"}
                </Button>
              </form>
            )}
            
            <div className="mt-6 text-center">
              <Link to="/login" className="text-sm text-slate-300 hover:text-white font-medium transition-colors flex items-center justify-center gap-1">
                &larr; Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}