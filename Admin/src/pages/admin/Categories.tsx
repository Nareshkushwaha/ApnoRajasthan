import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

// 👉 NAYA BADAAL: Base URL ko .env se utha rahe hain. Agar .env na mile toh localhost uthayega
import { API_BASE_URL } from "@/lib/api";

export function CategoriesList() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 👉 1. Backend se saari categories fetch karna
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/categories/all`)
      .then(res => res.json())
      .then(data => {
        // Yahan check kar rahe hain ki data sacchi mein ek Array (List) hai ya nahi
        if (Array.isArray(data)) {
            setList(data);
        } else {
            console.log("Backend ne array nahi bheja:", data);
            setList([]); // Agar error aayi toh crash se bachane ke liye khali list
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error("Categories load nahi ho payin. Server check karo!");
        setList([]); // Error aane par bhi crash hone se bachao
        setLoading(false);
      });
  }, []);

  // 👉 2. Category ko database se delete karna
  const del = async (id: number) => { 
    if(!window.confirm("Kya aap sach me is category ko delete karna chahte hain?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/categories/delete/${id}`, { method: "DELETE" });
      if(res.ok) {
        setList(list.filter(c => c.id !== id)); 
        toast.success("Category deleted"); 
      }
    } catch(err) {
      toast.error("Delete karne me error aayi");
    }
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        description={loading ? "Loading..." : `${list.length} categories`}
        actions={<Button asChild className="gradient-primary"><Link to="/admin/categories/new"><Plus className="mr-1 h-4 w-4" /> Add Category</Link></Button>}
      />
      <Card className="shadow-card"><CardContent className="p-4">
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {list.map(c => (
              <TableRow key={c.id}>
                <TableCell><div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-primary" />{c.name}</div></TableCell>
                <TableCell className="text-muted-foreground">{c.description || "N/A"}</TableCell>
                <TableCell className="text-right">
                  <Button asChild size="icon" variant="ghost"><Link to={`/admin/categories/${c.id}/edit`}><Pencil className="h-4 w-4" /></Link></Button>
                  <Button size="icon" variant="ghost" onClick={() => del(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {!loading && list.length === 0 && <TableRow><TableCell colSpan={3} className="text-center py-4">Koi category nahi mili</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}

export function CategoryForm({ mode }: { mode: "new" | "edit" }) {
  const { id } = useParams();
  const nav = useNavigate();
  
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 👉 3. Edit mode me purani category ka data laana
  useEffect(() => {
    if(mode === "edit" && id) {
      fetch(`${API_BASE_URL}/api/categories/all`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const ex = data.find((c: any) => c.id === Number(id));
            if(ex) {
              setName(ex.name);
              setDesc(ex.description || "");
            }
          }
        })
        .catch(err => console.error("Error fetching category details", err));
    }
  }, [mode, id]);

  // 👉 4. Category ko Database me Save/Update karna
  const save = async () => { 
    if (!name) return toast.error("Name is required"); 
    setIsSubmitting(true);
    
    const payload: any = { name: name, description: desc };
    if(mode === "edit" && id) payload.id = Number(id); // Edit ke time ID bhej rahe hain

    try {
      const res = await fetch(`${API_BASE_URL}/api/categories/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if(res.ok) {
        toast.success(mode === "edit" ? "Category Updated" : "Category Saved"); 
        nav("/admin/categories"); 
      } else {
        // Yahan exact error dikhayega agar backend ne save karne se mana kiya
        const errorText = await res.text();
        console.error("Backend Error:", errorText);
        toast.error(`Save nahi ho paya! (Status: ${res.status})`);
      }
    } catch(err) {
      toast.error("Server se connect nahi ho paya.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title={mode === "new" ? "Add Category" : "Edit Category"} actions={
        <><Button asChild variant="outline"><Link to="/admin/categories"><ArrowLeft className="mr-1 h-4 w-4" /> Back</Link></Button>
        <Button className="gradient-primary" disabled={isSubmitting} onClick={save}>{isSubmitting ? "Saving..." : "Save"}</Button></>
      } />
      <Card className="max-w-2xl shadow-card"><CardContent className="space-y-4 p-6">
        <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="Jaise: खेल, व्यापार" /></div>
        <div className="space-y-2"><Label>Description</Label><Textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Category ke baare me thoda likhein..." /></div>
      </CardContent></Card>
    </div>
  );
}