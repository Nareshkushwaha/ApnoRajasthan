import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { articles } from "@/data/news";
import { ArticleCard, ArticleListItem, AdSlot, PageHero } from "@/components/news-ui";
import { Loader2, FileText } from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8085";

export const Route = createFileRoute("/technology")({
  head: () => ({
    meta: [
      { title: "टेक्नोलॉजी समाचार — अपनो राजस्थान" },
      { name: "description", content: "गैजेट्स, AI, स्टार्टअप और डिजिटल दुनिया की ताज़ा ख़बरें।" },
      { property: "og:title", content: "टेक्नोलॉजी — अपनो राजस्थान" },
      { property: "og:description", content: "टेक की दुनिया का सबसे ताज़ा अपडेट।" },
      { property: "og:image", content: articles.find(a => a.category === "technology")?.image },
    ],
  }),
  component: TechnologyPage,
});

function TechnologyPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/news/all`)
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          setList([]);
          return;
        }

        const formattedNews = data.map((n: any) => ({
          slug: n.id.toString(),
          title: n.title,
          // HTML Tags साफ़ कर दिए
          excerpt: n.content ? n.content.replace(/<[^>]+>/g, '').substring(0, 120) + "..." : "",
          image: n.imageUrl || "https://picsum.photos/800/400",
          category: n.category ? n.category.trim().toLowerCase() : '',
          authorSlug: n.author || "admin",
          publishedAt: n.createdAt || new Date().toISOString(),
          tags: [n.category || "News"],
        }));

        // 👉 FILTER: सिर्फ टेक्नोलॉजी की न्यूज़
        const filteredList = formattedNews.filter((n: any) => 
          n.category === "technology" || n.category === "टेक्नोलॉजी" || n.category === "tech"
        );
        setList(filteredList.reverse());
      })
      .catch(err => {
        console.error("Fetch fail:", err);
        setList([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center bg-surface"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
  }

  if (list.length === 0) {
    return (
      <div className="bg-surface min-h-[60vh]">
        <PageHero kicker="टेक्नोलॉजी" title="टेक्नोलॉजी" subtitle="नई टेक, नए आइडिया, नई दुनिया।" />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-xl text-muted-foreground font-semibold">इस केटेगरी में अभी कोई खबर नहीं है।</p>
        </div>
      </div>
    );
  }

  // न्यूज़ को लेआउट के हिसाब से बाँटना
  const lead = list[0]; // सबसे बड़ी खबर
  const restLeft = list.slice(1, 7); // बड़ी खबर के नीचे के छोटे बॉक्स
  const relatedSidebar = list.slice(0, 5); // साइडबार में "संबंधित ख़बरें"
  const bottomGridNews = list.slice(7); // विज्ञापन के बाद और नीचे का 3-कॉलम ग्रिड

  return (
    <div className="bg-surface pb-12">
      <PageHero kicker="टेक्नोलॉजी" title="टेक्नोलॉजी" subtitle="नई टेक, नए आइडिया, नई दुनिया।" />
      
      <div className="container mx-auto px-4 py-8">
        
        {/* UPPER SECTION: Main Content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* LEFT COLUMN: Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* बड़ी खबर (Lead) - फिक्स साइज़ इमेज के साथ */}
            <ArticleCard a={lead} size="lg" />
            
            {/* छोटी खबरें - फिक्स बॉक्सेस में (ArticleListItem) */}
            {restLeft.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-3 flex flex-col gap-3 shadow-sm">
                {restLeft.map((a) => <ArticleListItem key={a.slug} a={a} />)}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Sidebar */}
          <aside className="space-y-6">
            
            {/* 1. "संबंधित ख़बरें" (Trending की जगह) */}
            <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <h3 className="font-bold text-lg">संबंधित ख़बरें</h3>
              </div>
              <ul className="divide-y divide-border">
                {relatedSidebar.map((a, i) => (
                  <li key={`rel-${a.slug}`} className="p-4 hover:bg-muted/40 flex gap-4 items-start transition-colors">
                    <span className="text-2xl font-bold text-primary/80 leading-none">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <Link to="/article/$slug" params={{ slug: a.slug }} className="text-sm font-semibold line-clamp-2 hover:text-primary">
                        {a.title}
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Ad Slot (विज्ञापन) */}
            <AdSlot height="h-64" />
          </aside>
        </div>

        {/* BOTTOM SECTION: विज्ञापन के बाद की न्यूज़ (3-Column Grid Boxes) */}
        {bottomGridNews.length > 0 && (
          <section className="pt-6 border-t-2 border-border mt-4">
            <div className="flex items-center gap-2 mb-6 border-b-2 border-primary pb-2">
               <FileText size={22} className="text-primary" />
               <h2 className="text-2xl font-extrabold">और भी ख़बरें</h2>
            </div>
            
            {/* 3-कॉलम वाला ग्रिड जैसे आपको इमेज में चाहिए था */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-card border border-border p-5 rounded-lg shadow-sm">
              {bottomGridNews.map((a) => (
                <ArticleListItem key={`more-${a.slug}`} a={a} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}