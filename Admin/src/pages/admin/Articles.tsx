import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // 👉 Dropdown ke liye import add kiya
import { Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { toast } from "sonner";

import { API_BASE_URL } from "@/lib/api";

export default function Articles({ draftsOnly = false }: { draftsOnly?: boolean }) {
  const [list, setList] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  // 👉 NAYE FILTERS STATES
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState(draftsOnly ? "Draft" : "all");

  // PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10; 

  const fetchNews = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/news/all/paged?page=${page}&size=${pageSize}`);
      if (response.ok) {
        const rawData = await response.json();
        
        let newsArray = [];
        if (rawData && rawData.content) {
          newsArray = rawData.content;
          setTotalPages(rawData.totalPages);
          setTotalItems(rawData.totalElements);
        } else if (Array.isArray(rawData)) {
          newsArray = rawData;
        }

        const formattedData = newsArray.map((item: any) => ({
          ...item,
          status: item.status || "Draft", 
          date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Today"
        }));
        
        setList(formattedData);
      } else {
        toast.error("Backend se data laane me error aayi!");
      }
    } catch (error) {
      toast.error("Server se connect nahi ho paya!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(currentPage);
  }, [currentPage]);

  // 👉 ASLI MAGIC FILTER LOGIC: Title + Category + Published/Draft Status sab ek sath filter hoga
  const filtered = list.filter((a) => {
    const matchesSearch = (a.title || "").toLowerCase().includes(q.toLowerCase());
    
    // Category match karne ka logic
    const matchesCategory = selectedCategory === "all" || 
      (a.category || "").toLowerCase() === selectedCategory.toLowerCase();
    
    // Status match karne ka logic (All, Published, Draft)
    const matchesStatus = selectedStatus === "all" || 
      (a.status || "").toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const del = async (id: number) => { 
    if(!window.confirm("Kya aap sach me is news ko delete karna chahte hain?")) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/news/delete/${id}`, { 
        method: "DELETE" 
      });
      
      if (response.ok) {
        toast.success("News database se delete ho gayi!"); 
        fetchNews(currentPage);
      } else { 
        toast.error("Delete karne me error aayi."); 
      }
    } catch(error) { 
      toast.error("Server connection error."); 
    }
  };

  // Unique categories nikalna dropdown me dikhane ke liye
  const categoriesList = ["Politics", "Rajasthan", "National", "International", "Sports", "Entertainment", "Technology", "Jobs"];

  return (
    <div>
      <PageHeader 
        title="Articles Management" 
        description={loading ? "Loading articles..." : `Showing ${filtered.length} of ${totalItems} articles`} 
        actions={<Button asChild className="gradient-primary"><Link to="/admin/articles/new"><Plus className="mr-1 h-4 w-4" /> New Article</Link></Button>} 
      />
      
      <Card className="shadow-card">
        <CardContent className="p-3 sm:p-4">
          
          {/* 👉 FILTERS BAR SECTION */}
          <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
            
            {/* 1. Search Box */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search by headline..." value={q} onChange={(e) => setQ(e.target.value)} />
            </div>

            {/* 2. Category Dropdown Menu */}
            <div className="w-full lg:w-48">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-background text-foreground border-border">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-card text-foreground border-border">
                  <SelectItem value="all" className="focus:bg-muted focus:text-foreground cursor-pointer">📁 All Categories</SelectItem>
                  {categoriesList.map(cat => (
                    <SelectItem key={cat} value={cat} className="focus:bg-muted focus:text-foreground cursor-pointer">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 3. Status Dropdown Menu (Published / Draft) */}
            <div className="w-full lg:w-44">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="bg-background text-foreground border-border">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="bg-card text-foreground border-border">
                  <SelectItem value="all" className="focus:bg-muted focus:text-foreground cursor-pointer">🌐 All Status</SelectItem>
                  <SelectItem value="Published" className="focus:bg-muted focus:text-foreground cursor-pointer text-success">🟢 Published</SelectItem>
                  <SelectItem value="Draft" className="focus:bg-muted focus:text-foreground cursor-pointer text-warning">🟡 Drafts Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>

          <div className="w-full overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px] sm:min-w-[200px] px-2 sm:px-4">Title</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden lg:table-cell">Author</TableHead>
                  <TableHead className="hidden md:table-cell whitespace-nowrap">Date</TableHead>
                  <TableHead className="px-2 sm:px-4">Status</TableHead>
                  <TableHead className="text-right px-2 sm:px-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="max-w-[120px] sm:max-w-[280px] truncate font-medium px-2 sm:px-4" title={a.title}>
                      {a.title}
                    </TableCell>
                    <TableCell className="hidden md:table-cell"><Badge variant="secondary">{a.category}</Badge></TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">{a.author}</TableCell>
                    <TableCell className="hidden md:table-cell whitespace-nowrap text-muted-foreground">{a.date}</TableCell>
                    <TableCell className="px-2 sm:px-4">
                      <Badge className={a.status === "Published" ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"}>
                        {a.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-2 sm:px-4">
                      <div className="flex justify-end gap-1">
                        <Button asChild size="icon" variant="ghost" className="h-8 w-8"><Link to={`/admin/articles/${a.id}/edit`}><Pencil className="h-4 w-4" /></Link></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => del(a.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && filtered.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No matching articles found in current filter.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* PAGINATION CONTROLS */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing Page {currentPage + 1} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage === totalPages - 1}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}