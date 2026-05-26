import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Newspaper, FolderTree, Users, FileEdit, CheckCircle2, Plus, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8085";

export default function Dashboard() {
  const [news, setNews] = useState<any[]>([]);
  const [catCount, setCatCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [newsRes, catRes, userRes] = await Promise.all([
          // 👉 NAYA BADAAL: Yahan se '/public' hata diya hai. Ab yeh bilkul sahi API par jayega!
          fetch(`${API_URL}/api/news/all`),
          fetch(`${API_URL}/api/categories/all`),
          fetch(`${API_URL}/api/users/all`)
        ]);

        if (newsRes.ok) {
          const newsData = await newsRes.json();
          const formattedNews = Array.isArray(newsData) ? newsData.map(item => ({
            ...item,
            status: item.status || "Draft" 
          })) : [];
          setNews(formattedNews.reverse()); 
        }
        
        if (catRes.ok) {
          const catData = await catRes.json();
          setCatCount(Array.isArray(catData) ? catData.length : 0);
        }

        if (userRes.ok) {
          const userData = await userRes.json();
          setUserCount(Array.isArray(userData) ? userData.length : 0);
        }
      } catch (error) {
        toast.error("Dashboard data load nahi ho paya.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const publishedCount = news.filter(a => a.status === "Published").length;
  const draftCount = news.filter(a => a.status === "Draft").length;

  const stats = [
    { label: "Total Articles", value: loading ? "..." : news.length.toLocaleString(), icon: Newspaper, change: "Live", color: "from-primary to-primary-glow" },
    { label: "Total Categories", value: loading ? "..." : catCount.toString(), icon: FolderTree, change: "Active", color: "from-secondary to-accent" },
    { label: "Total Users", value: loading ? "..." : userCount.toString(), icon: Users, change: "Team", color: "from-info to-primary" },
    { label: "Draft Articles", value: loading ? "..." : draftCount.toString(), icon: FileEdit, change: "Pending", color: "from-warning to-secondary" },
    { label: "Published Articles", value: loading ? "..." : publishedCount.toString(), icon: CheckCircle2, change: "Live", color: "from-success to-info" },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" description="Welcome back · आज का अवलोकन" actions={<><Button asChild variant="outline"><Link to="/admin/articles/new"><Plus className="mr-1 h-4 w-4" /> Add Post</Link></Button><Button asChild className="gradient-primary"><Link to="/admin/categories/new"><Plus className="mr-1 h-4 w-4" /> Add Category</Link></Button></>} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((s) => (
          <Card key={s.label} className="overflow-hidden shadow-card transition-shadow hover:shadow-elegant">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="mt-1 text-3xl font-bold">{s.value}</p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-success"><ArrowUpRight className="h-3 w-3" /> {s.change}</div>
                </div>
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white shadow-elegant`}><s.icon className="h-5 w-5" /></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-1">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Posts</CardTitle>
            <Button asChild variant="ghost" size="sm"><Link to="/admin/articles">View all</Link></Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead><TableHead className="hidden md:table-cell">Category</TableHead><TableHead className="hidden md:table-cell">Author</TableHead><TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? ( <TableRow><TableCell colSpan={4} className="text-center py-4">Loading...</TableCell></TableRow>
                ) : news.length === 0 ? ( <TableRow><TableCell colSpan={4} className="text-center py-4">No recent posts</TableCell></TableRow>
                ) : (
                  news.slice(0, 5).map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="max-w-xs truncate font-medium">{a.title}</TableCell>
                      <TableCell className="hidden md:table-cell"><Badge variant="secondary">{a.category}</Badge></TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{a.author || "Admin"}</TableCell>
                      <TableCell>
                        <Badge className={a.status === "Published" ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"}>{a.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}