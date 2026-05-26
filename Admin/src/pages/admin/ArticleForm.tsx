import { useNavigate, useParams, Link } from "react-router-dom";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch"; 
import { ArrowLeft, Save, Send, Upload, Search, Link as LinkIcon, Image as ImageIcon, Bolt, Wrench, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth"; // 👉 NAYA: User check karne ke liye

import { CKEditor } from 'ckeditor4-react';

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8085";

export default function ArticleForm({ mode }: { mode: "new" | "edit" }) {
  const { id } = useParams();
  const nav = useNavigate();
  
  // 👉 NAYA: Login wale user ka data nikalna
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === "admin"; // Check ki ye Admin hai ya Editor
  
  const [title, setTitle] = useState("");
  const [urlSlug, setUrlSlug] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [author, setAuthor] = useState(""); // Edit ke time purana author save rakhne ke liye
  const [metaTitle, setMetaTitle] = useState("");
  const [keywords, setKeywords] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [publishType, setPublishType] = useState("now");
  const [scheduleTime, setScheduleTime] = useState("");
  
  const [isBreaking, setIsBreaking] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  
  const [dbCategories, setDbCategories] = useState<any[]>([]);

  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [showTools, setShowTools] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/categories/all`).then(res => res.json()).then(data => { if(Array.isArray(data)) setDbCategories(data); }).catch(() => console.log("Category load fail"));

    if (mode === "edit" && id) {
      fetch(`${API_URL}/api/news/${id}`)
        .then(res => res.json())
        .then(data => {
          setTitle(data.title || "");
          setUrlSlug(data.urlSlug || "");
          setContent(data.content || "");
          setCategory(data.category || "");
          setSubCategory(data.subCategory || "");
          setAuthor(data.author || "");
          setExistingImageUrl(data.imageUrl || ""); 
          setMetaTitle(data.metaTitle || "");
          setKeywords(data.keywords || "");
          setMetaDesc(data.metaDesc || "");
          setPublishType(data.publishType || "now");
          setScheduleTime(data.scheduleTime || "");
          setIsBreaking(data.isBreaking || false);
        })
        .catch(err => toast.error("Purani news load nahi ho payi."));
    }
  }, [mode, id]);

  const save = async (publish: boolean) => {
    if (!title) return toast.error("Title is required");
    if (!urlSlug) return toast.error("English URL (Slug) is required");
    if (!content) return toast.error("Content is required"); 
    if (!category) return toast.error("Category is required");
    
    setIsSubmitting(true);

    // 👉 NAYA: Author ka naam auto-set karna. (Agar purana hai to wo, nahi to login user ka naam)
    const finalAuthor = author || user?.name || "Staff";

    const newsData: any = { 
        title, urlSlug, content, category, subCategory, 
        author: finalAuthor, imageUrl: existingImageUrl, 
        status: publish ? "Published" : "Draft",
        metaTitle, keywords, metaDesc, publishType, scheduleTime, isBreaking
    };
    
    if (mode === "edit" && id) newsData.id = Number(id);

    const formData = new FormData();
    formData.append("news", JSON.stringify(newsData));
    if (selectedImage) formData.append("image", selectedImage);

    try {
      const response = await fetch(`${API_URL}/api/admin/news/add`, { method: "POST", body: formData });
      if (response.ok) {
        toast.success(publish ? "News published! 🎉" : "Draft saved");
        nav("/admin/articles");
      } else {
        toast.error("Backend error aayi. Save nahi ho paya!");
      }
    } catch (error) {
      toast.error("Server se connect nahi ho paya.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInsertLink = () => {
    if (!editorInstance) return toast.error("Editor abhi load ho raha hai...");
    let url = prompt("🔗 Link ka URL daaliye (e.g., https://youtube.com):");
    if (url && url.trim() !== "") {
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = "https://" + url;
        }
        let text = prompt("📝 Link ka Text kya dikhana hai?", "यहाँ क्लिक करें");
        if (!text || text.trim() === "") text = url;
        
        const linkHtml = `<a href="${url}" target="_blank" style="color: #0ea5e9; text-decoration: underline; font-weight: 600;">${text}</a>`;
        editorInstance.insertHtml(linkHtml);
    }
  };

  const handleInsertImage = (e: any) => {
    if (!editorInstance) return;
    const file = e.target.files[0];
    if (file) {
        let altText = prompt("🔍 SEO के लिए इस फोटो का नाम (Alt Tag) लिखें:", "News Image");
        if (altText == null) altText = ""; 
        
        const reader = new FileReader();
        reader.onload = (event: any) => {
            const imgHtml = `<div style="text-align: center;"><img src="${event.target.result}" alt="${altText}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 15px auto; display: inline-block;" /></div><p><br></p>`;
            editorInstance.insertHtml(imgHtml);
        }
        reader.readAsDataURL(file);
    }
    e.target.value = ""; 
  };

  return (
    <div className="pb-10">
      <PageHeader title={mode === "new" ? "New Article" : "Edit Article"} actions={
          <>
            <Button asChild variant="outline"><Link to="/admin/articles"><ArrowLeft className="mr-1 h-4 w-4" /> Back</Link></Button>
            
            {/* 👉 1. Draft Button: Sabko dikhega */}
            <Button variant="outline" disabled={isSubmitting} onClick={() => save(false)}><Save className="mr-1 h-4 w-4" /> Save Draft</Button>
            
            {/* 👉 2. Publish Button: SIRF Admin ko dikhega */}
            {isAdmin && (
              <Button className="gradient-primary" disabled={isSubmitting} onClick={() => save(true)}>
                <Send className="mr-1 h-4 w-4" /> {isSubmitting ? "Saving..." : "Publish"}
              </Button>
            )}
          </>
        }
      />
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT COLUMN: Main Content & SEO */}
        <Card className="lg:col-span-2 shadow-card border-t-4 border-t-primary">
          <CardContent className="space-y-6 p-6">
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-base">Headline (Hindi) <span className="text-destructive">*</span></Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="लेख का शीर्षक..." className="text-lg py-5" />
              </div>
              <div className="space-y-2">
                <Label className="text-base text-primary flex items-center gap-1"><LinkIcon className="h-4 w-4" /> English URL <span className="text-destructive">*</span></Label>
                <Input value={urlSlug} onChange={(e) => setUrlSlug(e.target.value)} placeholder="eg: modi-visit-jaipur" className="text-lg py-5" />
              </div>
            </div>

            {/* SEO Section */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 space-y-3">
              <h6 className="font-bold flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Search className="h-4 w-4" /> SEO & Metadata
              </h6>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Google Title</Label><Input value={metaTitle} onChange={e => setMetaTitle(e.target.value)} placeholder="SEO Title" /></div>
                <div className="space-y-2"><Label>Focus Keywords</Label><Input value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="Comma separated keywords..." /></div>
                <div className="col-span-1 md:col-span-2 space-y-2"><Label>Meta Description</Label><Textarea value={metaDesc} onChange={e => setMetaDesc(e.target.value)} rows={2} placeholder="खबर का छोटा सारांश..." /></div>
              </div>
            </div>

            {/* Editor Section */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <Label className="text-lg">Full Story <span className="text-destructive">*</span></Label>
                
                <div className="flex flex-wrap gap-2">
                  <Button 
                    type="button" 
                    variant={showTools ? "secondary" : "outline"} 
                    size="sm" 
                    onClick={() => setShowTools(!showTools)}
                  >
                    {showTools ? <EyeOff className="mr-1 h-4 w-4" /> : <Wrench className="mr-1 h-4 w-4" />} 
                    {showTools ? "Hide Tools" : "Show Tools"}
                  </Button>
                  
                  <Button type="button" variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10" onClick={handleInsertLink}>
                    <LinkIcon className="mr-1 h-4 w-4" /> Add Link
                  </Button>
                  
                  <Button 
                    type="button" 
                    size="sm" 
                    className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 border-none" 
                    onClick={() => document.getElementById('ckCustomImageUpload')?.click()}
                  >
                    <ImageIcon className="mr-1 h-4 w-4" /> Insert Image
                  </Button>
                  <input type="file" id="ckCustomImageUpload" accept="image/*" style={{ display: 'none' }} onChange={handleInsertImage} />
                </div>
              </div>

              <div className={`rounded-md border border-slate-300 shadow-sm overflow-hidden min-h-[400px] bg-white ${!showTools ? 'hide-editor-toolbar' : ''}`}>
                <style>{`
                  .hide-editor-toolbar .cke_top { display: none !important; }
                `}</style>
                
                <CKEditor
                  initData={content}
                  editorUrl="https://cdn.ckeditor.com/4.22.1/full/ckeditor.js"
                  onInstanceReady={(evt: any) => setEditorInstance(evt.editor)} 
                  onChange={(evt: any) => setContent(evt.editor.getData())}
                  config={{
                    height: 400,
                    versionCheck: false, 
                    filebrowserUploadUrl: `${API_URL}/api/admin/upload/editor-image`
                  }}
                />
              </div>
            </div>

            {/* 👉 3. Breaking News: SIRF Admin ko dikhega */}
            {isAdmin && (
              <div className="flex items-center justify-between bg-card text-foreground p-4 rounded-lg border border-border mt-4 shadow-sm">
                <div className="space-y-0.5">
                  <Label htmlFor="breaking-mode" className="text-base font-bold flex items-center gap-2 cursor-pointer text-foreground">
                    <Bolt className="h-4 w-4 text-primary" /> Mark as Breaking News
                  </Label>
                  <p className="text-sm text-muted-foreground">This will display the article in the scrolling ticker on the homepage.</p>
                </div>
                <Switch 
                  id="breaking-mode" 
                  checked={isBreaking} 
                  onCheckedChange={setIsBreaking} 
                  className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-300 dark:data-[state=unchecked]:bg-slate-700"
                />
              </div>
            )}

          </CardContent>
        </Card>

        {/* RIGHT COLUMN: Settings */}
        <div className="space-y-6">
          <Card className="shadow-card"><CardContent className="space-y-3 p-5">
            <Label className="text-base">Featured Image</Label>
            {mode === "edit" && existingImageUrl && !selectedImage && (
                <div className="mb-2"><img src={existingImageUrl} alt="Current" className="h-32 w-full object-cover rounded border shadow-sm" /></div>
            )}
            <div className="flex aspect-video flex-col items-center justify-center rounded-md border-2 border-dashed border-border bg-muted/30 p-4 text-center hover:bg-muted/50 transition-colors">
              <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-xs text-muted-foreground mb-2 font-medium">{selectedImage ? selectedImage.name : "Click to upload new image"}</p>
              <Input type="file" accept="image/*" onChange={(e) => setSelectedImage(e.target.files?.[0] || null)} className="cursor-pointer" />
            </div>
          </CardContent></Card>

          <Card className="shadow-card"><CardContent className="space-y-5 p-5">
            <div className="space-y-2">
              <Label>Category <span className="text-destructive">*</span></Label>
              <Select value={category} onValueChange={(v) => { setCategory(v); setSubCategory(""); }}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent className="bg-card text-foreground border-border">
                  {dbCategories.map(c => <SelectItem key={c.id} value={c.name} className="focus:bg-muted focus:text-foreground cursor-pointer">{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {(category === "Rajasthan" || category === "राजस्थान") && (
              <div className="space-y-2 p-3 bg-primary/5 rounded border border-primary/20">
                <Label className="text-primary font-semibold">संभाग (Division)</Label>
                <Select value={subCategory} onValueChange={setSubCategory}>
                  <SelectTrigger className="bg-background"><SelectValue placeholder="संभाग चुनें" /></SelectTrigger>
                  <SelectContent className="bg-card text-foreground border-border">
                    <SelectItem value="Jaipur" className="focus:bg-muted focus:text-foreground cursor-pointer">जयपुर</SelectItem>
                    <SelectItem value="Jodhpur" className="focus:bg-muted focus:text-foreground cursor-pointer">जोधपुर</SelectItem>
                    <SelectItem value="Kota" className="focus:bg-muted focus:text-foreground cursor-pointer">कोटा</SelectItem>
                    <SelectItem value="Udaipur" className="focus:bg-muted focus:text-foreground cursor-pointer">उदयपुर</SelectItem>
                    <SelectItem value="Bikaner" className="focus:bg-muted focus:text-foreground cursor-pointer">बीकानेर</SelectItem>
                    <SelectItem value="Ajmer" className="focus:bg-muted focus:text-foreground cursor-pointer">अजमेर</SelectItem>
                    <SelectItem value="Bharatpur" className="focus:bg-muted focus:text-foreground cursor-pointer">भरतपुर</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {(category === "जीवन शैली" || category === "Lifestyle") && (
              <div className="space-y-2 p-3 bg-primary/5 rounded border border-primary/20">
                <Label className="text-primary font-semibold">सब-कैटिगरी</Label>
                <Select value={subCategory} onValueChange={setSubCategory}>
                  <SelectTrigger className="bg-background"><SelectValue placeholder="चुनें" /></SelectTrigger>
                  <SelectContent className="bg-card text-foreground border-border">
                    <SelectItem value="स्वास्थ्य" className="focus:bg-muted focus:text-foreground cursor-pointer">स्वास्थ्य</SelectItem>
                    <SelectItem value="फैशन" className="focus:bg-muted focus:text-foreground cursor-pointer">फैशन</SelectItem>
                    <SelectItem value="यात्रा" className="focus:bg-muted focus:text-foreground cursor-pointer">यात्रा</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Author wala dropdown delete kar diya gaya hai */}

            <div className="space-y-3 pt-3 border-t">
              <Label>Publishing Timing</Label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" name="publishType" value="now" checked={publishType === "now"} onChange={() => setPublishType("now")} className="w-4 h-4" /> Publish Immediately
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" name="publishType" value="schedule" checked={publishType === "schedule"} onChange={() => setPublishType("schedule")} className="w-4 h-4" /> Schedule Later
                </label>
              </div>
              {publishType === "schedule" && (
                <div className="mt-2">
                  <Input type="datetime-local" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} />
                </div>
              )}
            </div>

          </CardContent></Card>
        </div>
      </div>
    </div>
  );
}