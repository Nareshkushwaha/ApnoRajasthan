import { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { API_BASE_URL } from "@/lib/api";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sirf zaroori settings bachi hain
  const [settings, setSettings] = useState({
    siteName: "APNO RAJASTHAN",
    tagline: "राजस्थान की आवाज़",
    logoUrl: "",
    contactEmail: "",
    facebook: "",
    twitter: "",
    youtube: "",
    instagram: "",
  });

  // Backend se settings lana
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings/current`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setSettings(data);
        }
        setLoading(false);
      })
      .catch(err => {
        toast.error("Settings load nahi ho payi!");
        setLoading(false);
      });
  }, []);

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  // Settings Save karna
  const saveSettings = async (tabName: string) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/settings/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        toast.success(`${tabName} Settings Saved Successfully!`);
      } else {
        toast.error("Save failed!");
      }
    } catch (err) {
      toast.error("Server connection error.");
    } finally {
      setSaving(false);
    }
  };

  // Logo Upload karna
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${API_BASE_URL}/api/settings/upload-logo`, {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        const url = await res.text();
        handleChange("logoUrl", url);
        toast.success("Logo uploaded! Now click Save to apply.");
      } else {
        toast.error("Logo upload failed!");
      }
    } catch (err) {
      toast.error("Server upload error.");
    } finally {
      setUploadingLogo(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div>
      <PageHeader title="Settings" description="साइट कॉन्फ़िगरेशन" />
      
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
        </TabsList>

        {/* GENERAL TAB */}
        <TabsContent value="general">
          <Card className="max-w-2xl shadow-card"><CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <Label>Site Name</Label>
              <Input value={settings.siteName} onChange={e => handleChange("siteName", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input value={settings.tagline} onChange={e => handleChange("tagline", e.target.value)} />
            </div>
            
            <div className="space-y-2">
              <Label>Logo</Label>
              <div className="flex items-center gap-4 border p-3 rounded-md bg-muted/20">
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt="Logo" className="h-16 w-auto max-w-[150px] object-contain rounded bg-white p-1 border" />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-md gradient-primary text-xl font-bold text-primary-foreground">AR</div>
                )}
                
                <div className="flex flex-col gap-2">
                    <Input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleLogoUpload} />
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploadingLogo}>
                      {uploadingLogo ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                      {uploadingLogo ? "Uploading..." : "Upload New Logo"}
                    </Button>
                    <p className="text-[10px] text-muted-foreground">Recommended: Transparent PNG (200x80px)</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Contact Email</Label>
              <Input value={settings.contactEmail} onChange={e => handleChange("contactEmail", e.target.value)} />
            </div>
            <Button className="gradient-primary mt-2" disabled={saving} onClick={() => saveSettings("General")}>
                <Save className="mr-2 h-4 w-4" /> {saving ? "Saving..." : "Save General Settings"}
            </Button>
          </CardContent></Card>
        </TabsContent>

        {/* SOCIAL TAB */}
        <TabsContent value="social">
          <Card className="max-w-2xl shadow-card"><CardContent className="space-y-4 p-6">
            <div className="space-y-2"><Label>Facebook</Label><Input value={settings.facebook} onChange={e => handleChange("facebook", e.target.value)} placeholder="https://facebook.com/..." /></div>
            <div className="space-y-2"><Label>Twitter / X</Label><Input value={settings.twitter} onChange={e => handleChange("twitter", e.target.value)} placeholder="https://x.com/..." /></div>
            <div className="space-y-2"><Label>YouTube</Label><Input value={settings.youtube} onChange={e => handleChange("youtube", e.target.value)} placeholder="https://youtube.com/@..." /></div>
            <div className="space-y-2"><Label>Instagram</Label><Input value={settings.instagram} onChange={e => handleChange("instagram", e.target.value)} placeholder="https://instagram.com/..." /></div>
            <Button className="gradient-primary" disabled={saving} onClick={() => saveSettings("Social")}>
                <Save className="mr-2 h-4 w-4" /> {saving ? "Saving..." : "Save Social Links"}
            </Button>
          </CardContent></Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}