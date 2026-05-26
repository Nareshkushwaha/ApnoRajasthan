import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tv, Radio, Loader2 } from "lucide-react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8085";

export default function LiveTV() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [live, setLive] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Backend se current Live TV setting lana
  useEffect(() => {
    fetch(`${API_URL}/api/livetv/current`)
      .then(res => res.json())
      .then(data => {
        setUrl(data.streamUrl || "");
        setTitle(data.streamTitle || "");
        setLive(data.live || false);
        setIsLoading(false);
      })
      .catch(err => {
        toast.error("Settings load nahi ho payi");
        setIsLoading(false);
      });
  }, []);

  // 2. Settings ko backend me Save karna
  const saveSettings = async () => {
    setIsSaving(true);
    
    const payload = {
      streamUrl: url,
      streamTitle: title,
      live: live
    };

    try {
      const res = await fetch(`${API_URL}/api/livetv/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success("Live TV Settings Saved! 🚀");
      } else {
        toast.error("Save failed!");
      }
    } catch (error) {
      toast.error("Server connection error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-96 items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  }

  return (
    <div>
      <PageHeader title="Live TV Control" description="लाइव स्ट्रीम प्रबंधन" />
      <div className="grid gap-4 lg:grid-cols-3">
        
        {/* Left Side: Preview Area */}
        <Card className="lg:col-span-2 shadow-card overflow-hidden border-0">
          <div className="relative aspect-video bg-black">
            <img src="https://picsum.photos/seed/livetv/1280/720" alt="preview" className={`h-full w-full object-cover transition-opacity duration-500 ${live ? 'opacity-80' : 'opacity-30 grayscale'}`} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`rounded-full p-6 shadow-elegant transition-colors duration-300 ${live ? 'bg-primary/90' : 'bg-muted/80'}`}>
                <Tv className={`h-12 w-12 ${live ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
              </div>
            </div>
            {live && (
              <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-destructive px-3 py-1 text-xs font-bold text-destructive-foreground shadow-sm">
                <Radio className="h-3 w-3 animate-pulse" /> LIVE
              </div>
            )}
            {!live && (
              <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
                OFF AIR
              </div>
            )}
          </div>
          <CardContent className="p-4 text-sm text-muted-foreground flex justify-between items-center bg-card">
            <span>Preview Player</span>
            <span className="font-medium text-foreground">{title || "APNO RAJASTHAN"}</span>
          </CardContent>
        </Card>

        {/* Right Side: Controls */}
        <Card className="shadow-card">
          <CardContent className="space-y-6 p-6">
            
            <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/20">
              <div>
                <p className="font-semibold text-foreground">Stream Status</p>
                <p className="text-xs text-muted-foreground mt-0.5">{live ? "Currently broadcasting live" : "Stream is offline"}</p>
              </div>
              <Switch 
                checked={live} 
                onCheckedChange={(v) => { 
                  setLive(v); 
                  toast(v ? "Live ON karne ke liye Save karein" : "Live OFF karne ke liye Save karein", { icon: '⚠️' }); 
                }} 
                className="data-[state=checked]:bg-destructive"
              />
            </div>

            <div className="space-y-2">
              <Label>Stream Title</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Live Title..." />
            </div>

            <div className="space-y-2">
              <Label>YouTube Live URL / M3U8</Label>
              <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
              <p className="text-[10px] text-muted-foreground">Apne YouTube channel ki live video ka link yahan daalein.</p>
            </div>

            <Button 
              className="w-full gradient-primary mt-4" 
              onClick={saveSettings} 
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}