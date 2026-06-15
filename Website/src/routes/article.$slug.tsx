import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CATEGORY_LABELS, CATEGORY_PATH } from "@/data/news";
import { AdSlot } from "@/components/news-ui"; // ArticleCard हटा दिया है क्योंकि अब छोटे बॉक्स बनाए हैं
import { Facebook, Twitter, Linkedin, Link2, Clock, MessageCircle, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { API_BASE_URL } from "@/lib/api";

export const Route = createFileRoute("/article/$slug")({
  loader: async ({ params }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/news/${params.slug}`);
      if (!res.ok) throw notFound();
      const data = await res.json();
      
      const article = {
        slug: data.id.toString(),
        title: data.title,
        excerpt: data.content ? data.content.replace(/<[^>]+>/g, '').substring(0, 150) + "..." : "",
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

  // 👉 BADAAL: पुराने कमेंट्स की लिस्ट हटा दी, अब सिर्फ नाम और कमेंट का फॉर्म रहेगा
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/news/all`)
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
    
    // 👉 BADAAL: अब कमेंट सबमिट होने पर सिर्फ मैसेज आएगा और बॉक्स खाली हो जाएगा।
    setCommentName("");
    setCommentText("");
    toast.success("आपकी टिप्पणी सफलतापूर्वक भेज दी गई है!");
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

            <div className="p-6">
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

            {/* 👉 BADAAL: यहाँ से दूसरों के कमेंट्स दिखना बंद कर दिए हैं */}
            <div className="border-t border-border p-6 bg-background">
              <h3 className="text-2xl font-extrabold mb-6 flex items-center gap-2 text-ink">
                <MessageCircle className="text-primary" size={24} /> 
                अपनी राय दें
              </h3>
              
              <form onSubmit={handleCommentSubmit} className="space-y-4 bg-muted/30 p-5 rounded-lg border border-border">
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
                  placeholder="इस ख़बर पर अपनी टिप्पणी लिखें…" 
                  rows={3} 
                  className="w-full px-4 py-2 border border-input rounded-md bg-background resize-none focus:ring-2 focus:ring-primary outline-none transition-all" 
                />
                <button type="submit" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
                  <Send size={16} /> टिप्पणी सबमिट करें
                </button>
              </form>
            </div>
          </article>

          <aside className="space-y-6">
            <AdSlot height="h-64" />
            <div>
              <h3 className="font-bold text-lg mb-3 border-b-2 border-primary pb-1">संबंधित ख़बरें</h3>
              <div className="space-y-3">
                {/* 👉 BADAAL: बड़े कार्ड हटाकर छोटे और साफ़ कार्ड लगा दिए हैं */}
                {related.length > 0 ? related.map((r) => (
                  <Link key={`rel-${r.slug}`} to="/article/$slug" params={{ slug: r.slug }} className="flex gap-3 items-center group bg-card p-2.5 rounded-md border border-border hover:border-primary/50 transition-colors shadow-sm">
                    <img src={r.image} alt={r.title} className="w-24 h-16 object-cover rounded shrink-0" />
                    <h4 className="text-sm font-bold leading-snug group-hover:text-primary line-clamp-2 text-ink">{r.title}</h4>
                  </Link>
                )) : <p className="text-muted-foreground text-sm">अभी कोई खबर नहीं</p>}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}