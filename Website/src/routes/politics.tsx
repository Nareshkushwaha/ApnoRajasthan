import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { articles } from "@/data/news"; 
import { ArticleCard, ArticleListItem, AdSlot, PageHero } from "@/components/news-ui";
import { Loader2 } from "lucide-react";

import { API_BASE_URL } from "@/lib/api";

export const Route = createFileRoute("/politics")({
  head: () => ({
    meta: [
      { title: "राजनीति समाचार — अपनो राजस्थान" },
      { name: "description", content: "देश और राज्य की राजनीति की हर ताज़ा हिंदी ख़बर।" },
      { property: "og:title", content: "राजनीति — अपनो राजस्थान" },
      { property: "og:description", content: "देश और राज्य की राजनीति की हर ताज़ा हिंदी ख़बर।" },
      { property: "og:image", content: articles.find(a => a.category === "politics")?.image },
    ],
  }),
  component: PoliticsPage,
});

function PoliticsPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // 👉 DYNAMIC: Backend से न्यूज़ ला रहे हैं
    fetch(`${API_BASE_URL}/api/news/all`)
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          setList([]);
          return;
        }

        const formattedNews = data.map((n: any) => ({
          // 👉 MAGIC FIX YAHAN HAI: Ab ye ID ki jagah English naam (Slug) bhejega
          slug: n.urlSlug && n.urlSlug.trim() !== "" ? n.urlSlug : n.id.toString(),
          title: n.title,
          // HTML Tags साफ़ कर दिए
          excerpt: n.content ? n.content.replace(/<[^>]+>/g, '').substring(0, 120) + "..." : "",
          image: n.imageUrl || "https://picsum.photos/800/400",
          category: n.category ? n.category.trim().toLowerCase() : '',
          authorSlug: n.author || "admin",
          publishedAt: n.createdAt || new Date().toISOString(),
          tags: [n.category || "News"],
        }));

        // 👉 FILTER: सिर्फ राजनीति की न्यूज़
        const filteredList = formattedNews.filter((n: any) => 
          n.category === "politics" || n.category === "rajniti" || n.category === "राजनीति"
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
        <PageHero kicker="राजनीति" title="राजनीति" subtitle="संसद से सड़क तक — हर सियासी हलचल पर पैनी नज़र।" />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-xl text-muted-foreground font-semibold">इस केटेगरी में अभी कोई खबर नहीं है।</p>
        </div>
      </div>
    );
  }

  // न्यूज़ को अलग-अलग हिस्सों में बांटना
  const lead = list[0]; // सबसे बड़ी खबर (Left side)
  const restLeft = list.slice(1, 6); // बड़ी खबर के नीचे छोटे बॉक्स (Left side)
  const relatedTop = list.slice(0, 5); // साइडबार में ऊपर की 5 खबरें (Right side)
  const belowAd = list.slice(6, 12); // साइडबार में Ad के नीचे वाले बॉक्स (Right side)

  return (
    <div className="bg-surface pb-12">
      <PageHero kicker="राजनीति" title="राजनीति" subtitle="संसद से सड़क तक — हर सियासी हलचल पर पैनी नज़र।" />
      
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* बड़ी खबर */}
          <ArticleCard a={lead} size="lg" />
          
          {/* बड़ी खबर के नीचे छोटे बॉक्स */}
          {restLeft.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-2 flex flex-col gap-2 mt-4 shadow-sm">
              {restLeft.map((a) => <ArticleListItem key={a.slug} a={a} />)}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Sidebar */}
        <aside className="space-y-6">
          
          {/* 1. "संबंधित ख़बरें" (Trending की जगह) */}
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              <h3 className="font-bold text-lg">संबंधित ख़बरें</h3>
            </div>
            <ul className="divide-y divide-border">
              {relatedTop.map((a, i) => (
                <li key={`rel-${a.slug}`} className="p-4 hover:bg-muted/40 flex gap-4 items-start transition-colors">
                  <span className="text-2xl font-bold text-destructive/80 leading-none">
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
          
          {/* 3. Ad के नीचे न्यूज़ - छोटे बॉक्सेस में */}
          {belowAd.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-3 flex flex-col gap-3 shadow-sm">
              <div className="bg-primary text-primary-foreground px-3 py-2 font-bold text-md rounded">और ख़बरें</div>
              {belowAd.map((a) => (
                <ArticleListItem key={`sidebox-${a.slug}`} a={a} />
              ))}
            </div>
          )}

        </aside>
      </div>
    </div>
  );
}