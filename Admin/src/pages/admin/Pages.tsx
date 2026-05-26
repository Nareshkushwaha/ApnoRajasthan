import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

// 👉 Base URL .env se
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8085";

export default function Pages() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Backend model ke hisaab se state
  const [data, setData] = useState({
    aboutContent: "",
    privacyContent: "",
    termsContent: ""
  });

  // 1. Backend se data load karna
  useEffect(() => {
    fetch(`${API_URL}/api/pages/current`)
      .then(res => res.json())
      .then(dbData => {
        if (dbData) {
            setData({
                aboutContent: dbData.aboutContent || "",
                privacyContent: dbData.privacyContent || "",
                termsContent: dbData.termsContent || ""
            });
        }
        setLoading(false);
      })
      .catch(err => {
        toast.error("Pages load nahi ho paye!");
        setLoading(false);
      });
  }, []);

  // Handle typing changes
  const handleChange = (key: string, value: string) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  // 2. Data ko backend me save karna
  const save = async (pageName: string) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/pages/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      
      if (res.ok) {
        toast.success(`${pageName} page saved successfully!`);
      } else {
        toast.error("Save failed!");
      }
    } catch (error) {
      toast.error("Server connection error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex h-96 items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  }

  return (
    <div>
      <PageHeader title="Static Pages" description="अतिरिक्त पेज प्रबंधन (About, Privacy, Terms)" />
      
      <Tabs defaultValue="aboutContent">
        <TabsList className="mb-4">
          <TabsTrigger value="aboutContent">About Us</TabsTrigger>
          <TabsTrigger value="privacyContent">Privacy Policy</TabsTrigger>
          <TabsTrigger value="termsContent">Terms & Conditions</TabsTrigger>
        </TabsList>
        
        {/* Loop lagakar 3 tabs render kiye hain */}
        {(["aboutContent", "privacyContent", "termsContent"] as const).map(k => (
          <TabsContent key={k} value={k}>
            <Card className="shadow-card">
              <CardContent className="space-y-4 p-6">
                <Textarea 
                  value={data[k]} 
                  onChange={e => handleChange(k, e.target.value)} 
                  className="min-h-[400px] text-base" 
                  placeholder="Yahan page ka text likhein..."
                />
                <Button className="gradient-primary" disabled={saving} onClick={() => save(k === "aboutContent" ? "About" : k === "privacyContent" ? "Privacy Policy" : "Terms")}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  {saving ? "Saving..." : "Save Page"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}