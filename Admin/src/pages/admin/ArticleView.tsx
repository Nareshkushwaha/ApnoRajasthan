import { useParams, Link } from "react-router-dom";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Pencil, Eye, Calendar, User } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/api";

export default function ArticleView() {
  const { id } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/public/news/${id}`);
        if (response.ok) {
          const data = await response.json();
          setArticle(data);
        } else {
          toast.error("Backend se data nahi mila!");
        }
      } catch (error) {
        console.error(error);
        toast.error("Server 8085 se connect nahi ho paya.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticleData();
    }
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-lg">Loading real data... ⏳</div>;
  }

  if (!article) {
    return <div className="p-8 text-center text-lg text-red-500">News not found! ❌</div>;
  }

  return (
    <div>
      <PageHeader
        title="View Article"
        actions={
          <>
            <Button asChild variant="outline"><Link to="/admin/articles"><ArrowLeft className="mr-1 h-4 w-4" /> Back</Link></Button>
            <Button asChild className="gradient-primary"><Link to={`/admin/articles/${article.id}/edit`}><Pencil className="mr-1 h-4 w-4" /> Edit</Link></Button>
          </>
        }
      />
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="mb-3 flex gap-2">
            <Badge variant="secondary">{article.category || "Uncategorized"}</Badge>
            <Badge className="bg-success text-success-foreground">
              {article.status || "Published"}
            </Badge>
          </div>
          
          <h1 className="mb-4 text-3xl font-bold leading-tight">{article.title}</h1>
          
          <div className="mb-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><User className="h-4 w-4" />{article.author || "Admin"}</span>
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{article.createdAt ? new Date(article.createdAt).toLocaleDateString() : 'Today'}</span>
            <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{article.views || 0} views</span>
          </div>
          
          {/* 👉 NAYA BADAAL: Ab random waterfall nahi aayega, seedha asli image aayegi */}
          <img 
            src={article.imageUrl ? article.imageUrl : "https://placehold.co/1200x600?text=No+Image+Uploaded"} 
            alt={article.title} 
            className="mb-6 w-full rounded-lg object-cover max-h-[400px] border" 
          />
          
          <div className="prose prose-sm max-w-none space-y-4 text-foreground whitespace-pre-wrap">
            {article.content}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}