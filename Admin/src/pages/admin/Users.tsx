import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8085";

// 1. USERS LIST COMPONENT
export function UsersList() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/users/all`)
      .then(res => res.json())
      .then(data => {
        // 👉 YAHAN BHI SMART EXTRACTION LAGAYA HAI
        let usersArray = [];
        if (Array.isArray(data)) {
          usersArray = data;
        } else if (data && Array.isArray(data.content)) {
          usersArray = data.content;
        } else if (data && Array.isArray(data.data)) {
          usersArray = data.data;
        }
        setList(usersArray);
        setLoading(false);
      })
      .catch(err => {
        toast.error("Users load nahi ho paye!");
        setLoading(false);
      });
  }, []);

  const del = async (id: number) => { 
    if(!window.confirm("Kya aap sach me is user ko delete karna chahte hain?")) return;
    try {
      const res = await fetch(`${API_URL}/api/users/delete/${id}`, { method: "DELETE" });
      if(res.ok) {
        setList(list.filter(u => u.id !== id)); 
        toast.success("User removed"); 
      }
    } catch(err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div>
      <PageHeader title="Users" description={loading ? "Loading..." : `${list.length} team members`}
        actions={<Button asChild className="gradient-primary"><Link to="/admin/users/new"><Plus className="mr-1 h-4 w-4" /> Add User</Link></Button>} />
      <Card className="shadow-card"><CardContent className="p-4">
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead className="hidden md:table-cell">Email</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {list.map(u => (
              <TableRow key={u.id}>
                <TableCell><div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">{u.name?.charAt(0).toUpperCase()}</div>{u.name}</div></TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{u.email}</TableCell>
                <TableCell><Badge className={u.role === "Admin" || u.role === "admin" ? "bg-primary text-primary-foreground" : "bg-info text-info-foreground"}>{u.role}</Badge></TableCell>
                <TableCell><Badge variant={u.status === "Active" ? "default" : "secondary"}>{u.status || "Active"}</Badge></TableCell>
                <TableCell className="text-right">
                  <Button asChild size="icon" variant="ghost"><Link to={`/admin/users/${u.id}/edit`}><Pencil className="h-4 w-4" /></Link></Button>
                  <Button size="icon" variant="ghost" onClick={() => del(u.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {!loading && list.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-4">Koi user nahi mila</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}

// 2. USER FORM COMPONENT
export function UserForm({ mode }: { mode: "new" | "edit" }) {
  const { id } = useParams();
  const nav = useNavigate();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Editor");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === "edit" && id) {
      fetch(`${API_URL}/api/users/${id}`)
        .then(res => res.json())
        .then(data => {
          setName(data.name || "");
          setEmail(data.email || "");
          setRole(data.role || "Editor");
          setPassword(data.password || "");
        });
    }
  }, [mode, id]);

  const save = async () => {
    if (!name || !email) return toast.error("Name aur Email zaroori hain");
    if (mode === "new" && !password) return toast.error("Password likhna zaroori hai");
    
    setIsSubmitting(true);
    const payload: any = { name, email, role, password, status: "Active" };
    if (mode === "edit" && id) payload.id = Number(id);

    try {
      const res = await fetch(`${API_URL}/api/users/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast.success(mode === "edit" ? "User updated" : "User saved");
        nav("/admin/users");
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
      <PageHeader title={mode === "new" ? "Add User" : "Edit User"} actions={
        <><Button asChild variant="outline"><Link to="/admin/users"><ArrowLeft className="mr-1 h-4 w-4" /> Back</Link></Button>
        <Button className="gradient-primary" disabled={isSubmitting} onClick={save}>{isSubmitting ? "Saving..." : "Save"}</Button></>
      } />
      <Card className="max-w-2xl shadow-card"><CardContent className="space-y-4 p-6">
        <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
        <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div className="space-y-2">
            <Label>Password {mode === "edit" && "(Leave blank to keep same)"}</Label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={mode === "edit" ? "********" : ""} />
        </div>
        <div className="space-y-2"><Label>Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="Admin">Admin</SelectItem><SelectItem value="Editor">Editor</SelectItem></SelectContent>
          </Select>
        </div>
      </CardContent></Card>
    </div>
  );
}

// 3. PROFILE COMPONENT
export function Profile() {
  const { user, setRole } = useAuth();
  if (!user) return null;
  return (
    <div>
      <PageHeader title="Profile" description="आपकी प्रोफ़ाइल" />
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card"><CardContent className="flex flex-col items-center p-6 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full gradient-primary text-3xl font-bold text-primary-foreground shadow-elegant">{user.name.charAt(0)}</div>
          <h3 className="mt-3 text-lg font-bold">{user.name}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <Badge className="mt-2">{user.role.toUpperCase()}</Badge>
        </CardContent></Card>
        <Card className="shadow-card md:col-span-2"><CardContent className="space-y-4 p-6">
          <div className="space-y-2"><Label>Display Name</Label><Input defaultValue={user.name} /></div>
          <div className="space-y-2"><Label>Email</Label><Input defaultValue={user.email} /></div>
          <div className="space-y-2"><Label>Bio</Label><Input placeholder="कुछ अपने बारे में..." /></div>
          <div className="space-y-2"><Label>Switch Role (demo)</Label>
            <Select value={user.role} onValueChange={(v: any) => { setRole(v); toast.success(`Role: ${v}`); }}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="admin">Admin</SelectItem><SelectItem value="editor">Editor</SelectItem></SelectContent>
            </Select>
          </div>
          <Button className="gradient-primary" onClick={() => toast.success("Profile updated (UI Only)")}>Save Changes</Button>
        </CardContent></Card>
      </div>
    </div>
  );
}