import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search as SearchIcon, User, FileText, Video, Image as ImageIcon, MessageSquare } from "lucide-react";

import { API_BASE_URL } from "@/lib/api";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || ""; 
  
  const [results, setResults] = useState<any>({ users: [], articles: [], videos: [], gallery: [], messages: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      setLoading(true);
      fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          setResults(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Search failed", err);
          setLoading(false);
        });
    }
  }, [query]);

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <SearchIcon className="h-6 w-6 text-primary" />
          Search Results for "{query}"
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center p-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid gap-6">
          
          {/* USERS */}
          {results.users && results.users.length > 0 && (
            <Card>
              <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-lg"><User className="h-5 w-5"/> Users</CardTitle></CardHeader>
              <CardContent className="grid gap-2">
                {results.users.map((u: any) => (
                  <Link to={`/admin/users`} key={u.id} className="flex justify-between items-center p-3 border rounded-md bg-muted/10 hover:bg-muted/40 transition-colors cursor-pointer">
                    <div>
                      <p className="font-medium text-primary hover:underline">{u.name}</p>
                      <p className="text-sm text-muted-foreground">{u.email}</p>
                    </div>
                    <Badge variant={u.role?.toLowerCase() === "admin" ? "default" : "secondary"}>{u.role}</Badge>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {/* ARTICLES - Ab /admin/articles (All Articles) par jayega */}
          {results.articles && results.articles.length > 0 && (
            <Card>
              <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-lg"><FileText className="h-5 w-5"/> Articles</CardTitle></CardHeader>
              <CardContent className="grid gap-2">
                {results.articles.map((a: any) => (
                  <Link to={`/admin/articles`} key={a.id} className="flex justify-between items-center p-3 border rounded-md bg-muted/10 hover:bg-muted/40 transition-colors cursor-pointer">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="font-medium text-primary hover:underline truncate">{a.title}</p>
                      <p className="text-sm text-muted-foreground">Category: {a.category} • Author: {a.author}</p>
                    </div>
                    <Badge variant="outline">{a.status || 'Draft'}</Badge>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {/* VIDEOS - Ab /admin/videos (All Videos) par jayega */}
          {results.videos && results.videos.length > 0 && (
            <Card>
              <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-lg"><Video className="h-5 w-5"/> Videos</CardTitle></CardHeader>
              <CardContent className="grid gap-2">
                {results.videos.map((v: any) => (
                  <Link to={`/admin/videos`} key={v.id} className="flex justify-between items-center p-3 border rounded-md bg-muted/10 hover:bg-muted/40 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="h-10 w-16 shrink-0 bg-muted rounded overflow-hidden flex items-center justify-center">
                        {v.thumb ? <img src={v.thumb} className="h-full w-full object-cover" alt="thumb" /> : <Video className="h-5 w-5 text-muted-foreground"/>}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-primary hover:underline truncate">{v.title}</p>
                        <p className="text-sm text-muted-foreground">Category: {v.category}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {/* GALLERY - Ab /admin/gallery (All Gallery) par jayega */}
          {results.gallery && results.gallery.length > 0 && (
            <Card>
              <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-lg"><ImageIcon className="h-5 w-5"/> Gallery Images</CardTitle></CardHeader>
              <CardContent className="grid gap-2">
                {results.gallery.map((g: any) => (
                  <Link to={`/admin/gallery`} key={g.id} className="flex items-center p-3 border rounded-md bg-muted/10 hover:bg-muted/40 transition-colors cursor-pointer">
                    <p className="font-medium text-primary hover:underline">{g.title}</p>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {/* MESSAGES */}
          {results.messages && results.messages.length > 0 && (
            <Card>
              <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-lg"><MessageSquare className="h-5 w-5"/> Messages</CardTitle></CardHeader>
              <CardContent className="grid gap-2">
                {results.messages.map((m: any) => (
                  <Link to={`/admin/messages`} key={m.id} className="flex justify-between items-center p-3 border rounded-md bg-muted/10 hover:bg-muted/40 transition-colors cursor-pointer">
                    <div>
                      <p className="font-medium text-primary hover:underline">{m.subject || m.name}</p>
                      <p className="text-sm text-muted-foreground">{m.email}</p>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {!loading && 
            (!results.users?.length) && 
            (!results.articles?.length) && 
            (!results.videos?.length) && 
            (!results.gallery?.length) && 
            (!results.messages?.length) && (
             <div className="text-center p-10 border border-dashed rounded-lg text-muted-foreground">
                "{query}" से जुड़ा कुछ भी नहीं मिला!
             </div>
          )}
        </div>
      )}
    </div>
  );
}