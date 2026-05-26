import { createFileRoute, Link } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useState, useEffect } from "react";
// 👉 NAYA BADAAL: searchArticles ko hata diya kyunki ab data Database se aayega
import { CATEGORY_LABELS, type Category } from "@/data/news";
import { ArticleListItem, PageHero } from "@/components/news-ui";
import { Search, Loader2, SearchX } from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8085";

const schema = z.object({
  q: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(schema),
  head: () => ({
    meta: [
      { title: "खोज परिणाम — अपनो राजस्थान" },
      { name: "description", content: "अपनो राजस्थान पर ख़बरें खोजें।" },
      { property: "og:title", content: "खोज — अपनो राजस्थान" },
      { property: "og:description", content: "लेख, टैग और श्रेणियाँ खोजें।" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [input, setInput] = useState(q);
  const [filter, setFilter] = useState<Category | "all">("all");
  
  // 👉 Backend se data store karne ke liye states
  const [allArticles, setAllArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/news/all`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Backend data ko frontend ke format me badlo
          const formatted = data.map((n: any) => ({
            slug: n.id.toString(),
            title: n.title,
            excerpt: n.content ? n.content.substring(0, 150) + "..." : "",
            image: n.imageUrl || "https://picsum.photos/800/400",
            category: n.category ? n.category.trim().toLowerCase() : "rajasthan",
            publishedAt: n.createdAt || new Date().toISOString(),
            authorSlug: n.author || "admin",
            tags: [n.category || "News"],
            views: Math.floor(Math.random() * 1000) // Dummy views if needed
          }));
          setAllArticles(formatted.reverse());
        }
      })
      .catch((err) => console.error("Search fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  // 👉 Search logic: Keyword ke hisaab se filter karo
  const keyword = q.toLowerCase().trim();
  const searchedAll = keyword 
    ? allArticles.filter((a) => 
        (a.title && a.title.toLowerCase().includes(keyword)) || 
        (a.excerpt && a.excerpt.toLowerCase().includes(keyword))
      )
    : []; // Agar search box khali hai, toh empty list dikhao

  // 👉 Category ke hisaab se filter karo
  const results = filter === "all" ? searchedAll : searchedAll.filter((a) => a.category === filter);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ search: { q: input.trim() } });
    setFilter("all"); // Search karte waqt filter reset kar do
  };

  return (
    <div className="bg-surface min-h-[60vh]">
      <PageHero 
        kicker="खोज" 
        title={q ? `"${q}" के परिणाम` : "ख़बरें खोजें"} 
        subtitle={loading ? "खोज रहे हैं..." : (q ? `${searchedAll.length} परिणाम मिले` : "कोई भी विषय खोजें")} 
      />
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={submit} className="flex mb-4 border border-input rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-ring bg-background shadow-sm">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="कोई भी विषय खोजें…"
              className="flex-1 px-4 py-3 bg-transparent outline-none"
            />
            <button type="submit" className="bg-primary text-primary-foreground px-6 flex items-center gap-2 font-semibold hover:opacity-90 transition-opacity">
              <Search size={18} /> खोजें
            </button>
          </form>

          {q && searchedAll.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <button onClick={() => setFilter("all")} className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${filter === "all" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary bg-background"}`}>
                सभी ({searchedAll.length})
              </button>
              {(Object.keys(CATEGORY_LABELS) as Category[]).map((c) => {
                const count = searchedAll.filter((a) => a.category === c).length;
                if (!count) return null;
                return (
                  <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${filter === c ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary bg-background"}`}>
                    {(CATEGORY_LABELS as any)[c]} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-20 bg-card border border-border rounded-lg">
              <Loader2 className="animate-spin text-primary w-10 h-10" />
            </div>
          ) : results.length > 0 ? (
            <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
              {results.map((a) => <ArticleListItem key={a.slug} a={a} />)}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg p-10 text-center shadow-sm flex flex-col items-center">
              <SearchX className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
              <p className="text-lg font-semibold">{q ? "कोई परिणाम नहीं मिला" : "खोज शुरू करने के लिए ऊपर लिखें"}</p>
              <p className="text-sm text-muted-foreground mt-2">कुछ अलग कीवर्ड आज़माएँ या <Link to="/" className="text-primary hover:underline">होम</Link> पर जाएँ।</p>
            </div>
          )}
        </div>

        <aside className="bg-card border border-border rounded-lg p-5 h-fit shadow-sm">
          <h3 className="font-bold text-lg mb-4 border-b border-border pb-2">लोकप्रिय विषय</h3>
          <div className="flex flex-wrap gap-2">
            {["राजस्थान", "क्रिकेट", "बॉलीवुड", "ISRO", "जयपुर", "नौकरी", "बजट", "मोदी", "विराट"].map((t) => (
              <Link 
                key={t} 
                to="/search" 
                search={{ q: t }} 
                onClick={() => setInput(t)}
                className="text-xs bg-muted px-3 py-1.5 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors font-medium border border-transparent hover:border-primary/50"
              >
                #{t}
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}