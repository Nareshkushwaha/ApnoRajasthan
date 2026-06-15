import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, ArrowLeft, Play, FolderTree, Pencil } from "lucide-react";
import { toast } from "sonner";

// 👉 Base URL yahan set kar diya hai
import { API_BASE_URL } from "@/lib/api";

// 1. VIDEOS LIST COMPONENT
export function VideosList() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/videos/all`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setList(data);
        setLoading(false);
      })
      .catch(err => {
        toast.error("Videos load nahi ho paye!");
        setLoading(false);
      });
  }, []);

  const remove = async (id: number) => {
    if(!window.confirm("Delete karna chahte hain?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/videos/delete/${id}`, { method: "DELETE" });
      if (res.ok) {
        setList(list.filter(x => x.id !== id));
        toast.success("Video deleted");
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div>
      <PageHeader
        title="Videos"
        description={loading ? "Loading..." : `${list.length} videos`}
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm" className="hidden sm:flex"><Link to="/admin/videos/categories"><FolderTree className="mr-1 h-4 w-4" /> Categories</Link></Button>
            <Button asChild className="gradient-primary" size="sm"><Link to="/admin/videos/new"><Plus className="mr-1 h-4 w-4" /> Add Video</Link></Button>
          </div>
        }
      />
      {/* 👇 Yahan 'grid-cols-2' kar diya hai mobile ke liye chote boxes banane ke liye, gap bhi adjust kiya hai */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {list.map(v => (
          <Card key={v.id} className="flex flex-col overflow-hidden shadow-card transition-shadow hover:shadow-elegant">
            <a href={v.url} target="_blank" rel="noopener noreferrer" className="relative aspect-video bg-muted block group">
              <img src={v.thumb || `https://picsum.photos/seed/${v.id}/400/225`} alt={v.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/10">
                  {/* Play icon bhi mobile ke liye chota kiya hai (h-8 w-8) */}
                  <Play className="h-8 w-8 sm:h-12 sm:w-12 text-white opacity-80 group-hover:opacity-100" />
              </div>
            </a>
            
            {/* 👇 Mobile me padding (p-2) aur laptop me (sm:p-4) */}
            <CardContent className="flex flex-col flex-1 p-2 sm:p-4">
              <div className="flex-1">
                {/* Title ko mobile me chota (text-xs) kiya hai taaki fit aa jaye */}
                <h3 className="line-clamp-2 text-xs sm:text-base font-medium leading-tight">{v.title}</h3>
                <div className="mt-1 sm:mt-2 text-xs text-muted-foreground">
                  <Badge variant="secondary" className="font-normal text-[10px] sm:text-xs px-1 sm:px-2.5 py-0 sm:py-0.5">{v.category}</Badge>
                </div>
              </div>
              {/* Buttons ko bhi mobile screen ke hisab se responsive banaya hai */}
              <div className="mt-2 sm:mt-4 flex items-center gap-1 sm:gap-2">
                <Button asChild variant="outline" className="flex-1 h-7 sm:h-9 text-[10px] sm:text-sm px-1 sm:px-3">
                  <Link to={`/admin/videos/${v.id}/edit`}>
                    <Pencil className="mr-1 h-3 w-3 sm:mr-2 sm:h-3.5 sm:w-3.5" /> 
                    <span className="hidden min-[350px]:inline">Edit</span>
                  </Link>
                </Button>
                <Button variant="ghost" onClick={() => remove(v.id)} aria-label="Delete" className="h-7 w-7 sm:h-9 sm:w-9 shrink-0 p-0">
                  <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {!loading && list.length === 0 && (
          <div className="col-span-full rounded-md border border-dashed p-10 text-center text-muted-foreground">
            No videos yet.
          </div>
        )}
      </div>
    </div>
  );
}

// 2. VIDEO FORM COMPONENT
export function VideoForm({ mode }: { mode: "new" | "edit" }) {
  const nav = useNavigate();
  const { id } = useParams();
  
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  const [desc, setDesc] = useState("");
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/categories/all`)
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) setDbCategories(data);
      });

    if (mode === "edit" && id) {
      fetch(`${API_BASE_URL}/api/videos/${id}`)
        .then(res => res.json())
        .then(data => {
          setTitle(data.title);
          setUrl(data.url);
          setCategory(data.category);
          setDesc(data.description || "");
        });
    }
  }, [mode, id]);

  const save = async () => {
    if (!title.trim()) return toast.error("Title is required");
    if (!url.trim()) return toast.error("URL is required");
    setIsSubmitting(true);

    const payload: any = {
        title, url, category, description: desc,
        thumb: url.includes("youtube.com") || url.includes("youtu.be") 
            ? "https://img.youtube.com/vi/" + (url.split("v=")[1]?.substring(0, 11) || url.split("/").pop()?.substring(0, 11)) + "/mqdefault.jpg"
            : `https://picsum.photos/seed/${Date.now()}/400/225`
    };

    if (mode === "edit" && id) payload.id = Number(id);

    try {
      const res = await fetch(`${API_BASE_URL}/api/videos/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast.success(mode === "edit" ? "Video updated" : "Video added");
        nav("/admin/videos");
      } else {
        toast.error("Save nahi ho paya!");
      }
    } catch (err) {
      toast.error("Server connection error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={mode === "new" ? "Add Video" : "Edit Video"}
        actions={<Button asChild variant="outline"><Link to="/admin/videos"><ArrowLeft className="mr-1 h-4 w-4" /> Back</Link></Button>}
      />
      <Card className="max-w-2xl shadow-card">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="space-y-2"><Label>Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="वीडियो शीर्षक" /></div>
          <div className="space-y-2"><Label>YouTube/Video URL</Label><Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." /></div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue placeholder="Category chunein" /></SelectTrigger>
              <SelectContent>
                {dbCategories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Description</Label><Textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="विवरण" /></div>
          <div className="flex gap-2 pt-2">
            <Button className="gradient-primary flex-1 sm:flex-none" disabled={isSubmitting} onClick={save}>{isSubmitting ? "Saving..." : (mode === "new" ? "Save Video" : "Save Changes")}</Button>
            <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => nav("/admin/videos")}>Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 3. VIDEO CATEGORIES COMPONENT
export function VideoCategories() {
  const [cats, setCats] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/categories/all`)
      .then(res => res.json())
      .then(data => { if(Array.isArray(data)) setCats(data); });
  }, []);

  return (
    <div>
      <PageHeader title="Video Categories" actions={<Button asChild variant="outline"><Link to="/admin/videos"><ArrowLeft className="mr-1 h-4 w-4" /> Back</Link></Button>} />
      <Card className="shadow-card"><CardContent className="p-4 sm:p-6">
        <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-4">
                Videos ki categories wahi hain jo main News Articles ki hain. Nayi category jodne ya hatane ke liye mukhya Categories page par jayein.
            </p>
            <Button asChild className="gradient-primary w-full sm:w-auto"><Link to="/admin/categories">Manage Categories</Link></Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-6 border-t pt-6">
          {cats.map(c => (
            <Badge key={c.id} variant="secondary" className="px-3 py-1 text-sm">
              {c.name}
            </Badge>
          ))}
        </div>
      </CardContent></Card>
    </div>
  );
}