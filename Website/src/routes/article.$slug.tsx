import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CATEGORY_LABELS, CATEGORY_PATH } from "@/data/news";
import { ArticleCard, AdSlot } from "@/components/news-ui";
import { Facebook, Twitter, Linkedin, Link2, Clock, MessageCircle, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8085";

export const Route = createFileRoute("/article/$slug")({
  loader: async ({ params }) => {
    try {
      const res = await fetch(`${API_URL}/api/news/${params.slug}`);
      if (!res.ok) throw notFound();
      const data = await res.json();
      
      const article = {
        slug: data.id.toString(),
        title: data.title,
        excerpt: data.content ? data.content.replace(/<[^>]+>/g, '').substring(0, 150) + "..." : "",
        // 👉 YAHAN FIX KIYA HAI: 'body' ko array banane ki jagah raw HTML string rakha hai
        contentHtml: data.content || "", 
        image: data.imageUrl || "https://picsum.photos/800/400",
        category: data.category ? data.category.trim().toLowerCase() : 'rajasthan',
        authorName: data.author || "Admin",
        publishedAt: data.createdAt || new Date().toISOString(),
        tags: [data.category || "News"]
      };
      return { article };
    } catch (e) {
      throw notFound();
    }
  },
  head: ({ loaderData }) => {
    const a = loaderData?.article;
    if (!a) return { meta: [{ title: "लेख नहीं मिला" }] };
    return {
      meta: [
        { title: `${a.title} — अपनो राजस्थान` },
        { name: "description", content: a.excerpt },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:image", content: a.image },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: a.image },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">लेख नहीं मिला</h1>
      <Link to="/" className="text-primary mt-4 inline-block">होम पर जाएँ</Link>
    </div>
  ),
  component: ArticlePage,
});

function ArticlePage() {
  const { article: a } = Route.useLoaderData();
  const [related, setRelated] = useState<any[]>([]);

  const [comments, setComments] = useState([
    { name: "अपनो राजस्थान", time: "Admin", text: "इस ख़बर पर अपनी राय ज़रूर दें!" }
  ]);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/news/all`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((n: any) => ({
          slug: n.id.toString(),
          title: n.title,
          excerpt: n.content ? n.content.replace(/<[^>]+>/g, '').substring(0, 120) + "..." : "",
          image: n.imageUrl || "https://picsum.photos/800/400",
          category: n.category ? n.category.trim().toLowerCase() : 'rajasthan',
          publishedAt: n.createdAt || new Date().toISOString(), 
          authorSlug: n.author || "admin"
        })).filter((n: any) => n.category === a.category && n.slug !== a.slug).slice(0, 3);
        setRelated(formatted);
      })
      .catch(e => console.error(e));
  }, [a.category, a.slug]);

  const author = {
    name: a.authorName,
    role: "संपादक",
    avatar: `https://ui-avatars.com/api/?name=${a.authorName}&background=random`,
    bio: "अपनो राजस्थान के अनुभवी पत्रकार।"
  };

  const safeDate = a.publishedAt ? new Date(a.publishedAt) : new Date();
  const date = new Intl.DateTimeFormat("hi-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  }).format(safeDate);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const encodedTitle = encodeURIComponent(a.title);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    toast.success("लिंक कॉपी हो गया!");
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) {
      toast.error("कृपया नाम और टिप्पणी दोनों लिखें!");
      return;
    }
    const newComment = {
      name: commentName,
      time: "अभी-अभी",
      text: commentText
    };
    setComments([newComment, ...comments]); 
    setCommentName("");
    setCommentText("");
    toast.success("आपकी टिप्पणी पोस्ट हो गई!");
  };

  return (
    <div className="bg-surface">
      <div className="container mx-auto px-4 py-6">
        <nav className="text-sm text-muted-foreground mb-4 flex gap-2">
          <Link to="/" className="hover:text-primary">होम</Link>
          <span>/</span>
          <Link to={(CATEGORY_PATH as any)[a.category] || "/"} className="hover:text-primary">{(CATEGORY_LABELS as any)[a.category] || a.category}</Link>
          <span>/</span>
          <span className="line-clamp-1">{a.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <article className="lg:col-span-2 bg-card border border-border rounded-lg overflow-hidden shadow-sm">
            <Link to={(CATEGORY_PATH as any)[a.category] || "/"} className="inline-block bg-primary text-primary-foreground text-xs font-bold px-3 py-1 m-4 rounded">
              {(CATEGORY_LABELS as any)[a.category] || a.category}
            </Link>
            <h1 className="px-6 text-3xl md:text-4xl font-extrabold leading-tight">{a.title}</h1>
            <p className="px-6 mt-3 text-muted-foreground text-lg">{a.excerpt}</p>

            <div className="px-6 mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-b border-border pb-4">
              <div className="flex items-center gap-2 hover:text-primary">
                <img src={author.avatar} alt={author.name} className="w-8 h-8 rounded-full" />
                <span className="font-semibold">{author.name}</span>
              </div>
              <span className="flex items-center gap-1"><Clock size={14} /> {date}</span>
            </div>

            <img src={a.image} alt={a.title} className="w-full h-auto mt-4 object-cover" />

            <div className="px-6 py-4 border-b border-border flex items-center gap-3 bg-muted/10">
              <span className="text-sm font-semibold text-muted-foreground mr-1">शेयर करें:</span>
              
              <a href={`https://api.whatsapp.com/send?text=${encodedTitle} - ${currentUrl}`} target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-[#25D366] text-white hover:opacity-80 transition-opacity shadow-sm" title="WhatsApp">
                <span className="font-bold text-sm">W</span>
              </a>

              <a href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`} target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1877F2] text-white hover:opacity-80 transition-opacity shadow-sm" title="Facebook">
                <Facebook size={15} />
              </a>
              
              <a href={`https://twitter.com/intent/tweet?url=${currentUrl}&text=${encodedTitle}`} target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white hover:opacity-80 transition-opacity shadow-sm" title="X (Twitter)">
                <Twitter size={14} />
              </a>
              
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`} target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0A66C2] text-white hover:opacity-80 transition-opacity shadow-sm" title="LinkedIn">
                <Linkedin size={14} />
              </a>
              
              <button onClick={copyToClipboard} className="w-8 h-8 flex items-center justify-center rounded-full bg-muted border border-border text-foreground hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm ml-auto" title="लिंक कॉपी">
                <Link2 size={15} />
              </button>
            </div>

            {/* 🔥 YAHAN HAI ASALI CKEDITOR HTML RENDERER 🔥 */}
            <div className="p-6">
              {/* Ye styles lagaye hain taaki CKEditor ki multiple images bahar na nikle aur links blue dikhein */}
              <style>{`
                .ck-content-area img { max-width: 100%; height: auto; border-radius: 8px; margin: 15px auto; }
                .ck-content-area a { color: #0ea5e9; text-decoration: underline; font-weight: 500; }
                .ck-content-area p { margin-bottom: 1rem; font-size: 1.1rem; line-height: 1.7; }
                .ck-content-area h2, .ck-content-area h3 { margin-top: 1.5rem; margin-bottom: 1rem; font-weight: bold; }
              `}</style>
              
              <div 
                className="ck-content-area text-foreground"
                dangerouslySetInnerHTML={{ __html: a.contentHtml }} 
              />
            </div>

            <div className="px-6 pb-6 mt-4">
              <div className="flex flex-wrap gap-2">
                {a.tags.map((t: string) => (
                  <span key={t} className="text-xs bg-muted px-3 py-1 rounded-full">#{t}</span>
                ))}
              </div>
            </div>

            <div className="border-t border-border bg-muted/20 p-6 flex gap-4 items-start">
              <img src={author.avatar} alt={author.name} className="w-16 h-16 rounded-full" />
              <div>
                <div className="text-xs text-muted-foreground">लेखक के बारे में</div>
                <div className="font-bold text-lg hover:text-primary">{author.name}</div>
                <div className="text-sm text-muted-foreground">{author.role}</div>
                <p className="text-sm mt-2">{author.bio}</p>
              </div>
            </div>

            <div className="border-t border-border p-6 bg-background">
              <h3 className="text-2xl font-extrabold mb-6 flex items-center gap-2 text-ink">
                <MessageCircle className="text-primary" size={24} /> 
                टिप्पणियाँ ({comments.length})
              </h3>
              
              <form onSubmit={handleCommentSubmit} className="space-y-4 mb-8 bg-muted/30 p-5 rounded-lg border border-border">
                <h4 className="font-bold mb-2">अपनी राय दें:</h4>
                <input 
                  type="text" 
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  placeholder="आपका नाम" 
                  className="w-full px-4 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary outline-none transition-all" 
                />
                <textarea 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="अपनी टिप्पणी लिखें…" 
                  rows={3} 
                  className="w-full px-4 py-2 border border-input rounded-md bg-background resize-none focus:ring-2 focus:ring-primary outline-none transition-all" 
                />
                <button type="submit" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
                  <Send size={16} /> टिप्पणी पोस्ट करें
                </button>
              </form>

              <ul className="space-y-6">
                {comments.map((c, i) => (
                  <li key={i} className="border-b border-border pb-6 last:border-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shrink-0">
                        {c.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between">
                          <div className="font-bold text-base">{c.name}</div>
                          <div className="text-[11px] text-muted-foreground font-semibold bg-muted px-2 py-0.5 rounded-md">{c.time}</div>
                        </div>
                        <p className="text-sm mt-2 text-foreground/90 leading-relaxed">{c.text}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <aside className="space-y-6">
            <AdSlot height="h-64" />
            <div>
              <h3 className="font-bold text-lg mb-3 border-b-2 border-primary pb-1">संबंधित ख़बरें</h3>
              <div className="space-y-3">
                {related.length > 0 ? related.map((r) => <ArticleCard key={`rel-${r.slug}`} a={r} />) : <p className="text-muted-foreground text-sm">अभी कोई खबर नहीं</p>}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}