import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArticleCard, AdSlot, PageHero } from "@/components/news-ui";
import { Loader2 } from "lucide-react";

import { API_BASE_URL } from "@/lib/api";

export const Route = createFileRoute("/rajasthan")({
  loader: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/news/all`);
      if (!res.ok) return { firstImage: null };
      const data = await res.json();
      const rajasthanNews = data.find((n: any) => n.category && n.category.trim().toLowerCase() === "rajasthan");
      return { firstImage: rajasthanNews?.imageUrl || null };
    } catch (e) {
      return { firstImage: null };
    }
  },
  head: ({ loaderData }) => {
    const ogImage = loaderData?.firstImage || "https://picsum.photos/800/400";
    return {
      meta: [
        { title: "राजस्थान समाचार — अपनो राजस्थान" },
        { name: "description", content: "जयपुर, जोधपुर, उदयपुर, बीकानेर सहित पूरे राजस्थान की ताज़ा ख़बरें।" },
        { property: "og:title", content: "राजस्थान — अपनो राजस्थान" },
        { property: "og:description", content: "राजस्थान के हर ज़िले की ताज़ा हिंदी ख़बरें।" },
        { property: "og:image", content: ogImage },
      ],
    };
  },
  component: RajasthanPage,
});

function RajasthanPage() {
  const [allNews, setAllNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 👉 यह State तय करेगा कि कौनसे संभाग की न्यूज़ दिखानी है
  const [activeTab, setActiveTab] = useState("All");

  // 👉 आपके 7 संभाग
  const divisions = [
    { id: "All", label: "सभी ख़बरें" },
    { id: "Jaipur", label: "जयपुर" },
    { id: "Jodhpur", label: "जोधपुर" },
    { id: "Kota", label: "कोटा" },
    { id: "Udaipur", label: "उदयपुर" },
    { id: "Bikaner", label: "बीकानेर" },
    { id: "Ajmer", label: "अजमेर" },
    { id: "Bharatpur", label: "भरतपुर" },
  ];

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/news/all`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const formatted = data.map((n: any) => ({
            slug: n.id.toString(),
            title: n.title,
            excerpt: n.content ? n.content.replace(/<[^>]+>/g, '').substring(0, 120) + "..." : "",
            image: n.imageUrl || "https://picsum.photos/800/400",
            category: n.category ? n.category.trim().toLowerCase() : '',
            subCategory: n.subCategory || "", // 👉 यहाँ से संभाग (subCategory) मिल रहा है
            publishedAt: n.createdAt || new Date().toISOString()
          }));
          
          // सिर्फ राजस्थान की न्यूज़ अलग कर ली
          const rajNews = formatted.filter(n => n.category === "rajasthan" || n.category === "राजस्थान").reverse();
          setAllNews(rajNews);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center bg-surface"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  // 👉 ASLI MAGIC: जो टैब सेलेक्ट होगा, सिर्फ उसी की न्यूज़ दिखेगी
  const displayNews = activeTab === "All" 
    ? allNews 
    : allNews.filter(n => n.subCategory === activeTab);

  return (
    <div className="bg-surface pb-12">
      <PageHero kicker="राजस्थान" title="राजस्थान" subtitle="रेगिस्तान से अरावली तक — पधारो म्हारे देस की हर ख़बर।" />
      
      <div className="container mx-auto px-4 py-8">
        
        {/* 👉 7 संभाग वाले असली काम करने वाले बटन (TABS) */}
        <div className="flex gap-3 overflow-x-auto border-b border-border mb-8 pb-3 scrollbar-hide">
          {divisions.map(d => (
            <button 
              key={d.id}
              onClick={() => setActiveTab(d.id)}
              className={`px-5 py-2 whitespace-nowrap text-sm font-bold rounded-full transition-all duration-200 border ${
                activeTab === d.id 
                  ? "bg-primary text-primary-foreground border-primary shadow-md scale-105" 
                  : "bg-card text-foreground border-border hover:bg-muted"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: News Grid */}
          <div className="lg:col-span-2">
            {displayNews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {displayNews.map(a => <ArticleCard key={a.slug} a={a} />)}
              </div>
            ) : (
              <div className="bg-card border border-border p-12 text-center rounded-lg shadow-sm">
                <p className="text-xl text-muted-foreground font-semibold">इस संभाग में अभी कोई खबर नहीं है।</p>
                <p className="text-sm mt-2 text-muted-foreground">कृपया दूसरी श्रेणी चुनें।</p>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <aside className="space-y-6">
            <AdSlot height="h-64" />
            
            {allNews.length > 0 && (
              <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-primary text-primary-foreground px-4 py-3 font-bold text-lg">
                  राजस्थान की ताज़ा ख़बरें
                </div>
                <ul className="divide-y divide-border">
                  {allNews.slice(0, 8).map((a) => (
                    <li key={`side-${a.slug}`} className="p-3.5 hover:bg-muted/40 transition-colors">
                      <Link to="/article/$slug" params={{ slug: a.slug }} className="text-sm font-semibold line-clamp-2 hover:text-primary leading-snug">
                        {a.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}