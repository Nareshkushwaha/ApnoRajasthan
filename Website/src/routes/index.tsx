import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { CATEGORY_LABELS, CATEGORY_PATH } from "@/data/news";
import { ArticleCard, ArticleListItem, SectionHeader } from "@/components/news-ui";
import { ChevronLeft, ChevronRight, Play, Loader2, FileText } from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8085";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "अपनो राजस्थान — हिंदी न्यूज़, राजस्थान की हर ख़बर" },
      { name: "description", content: "राजस्थान, राष्ट्रीय और अंतरराष्ट्रीय ताज़ा हिंदी ख़बरें, खेल, मनोरंजन, टेक्नोलॉजी और नौकरी की जानकारी।" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [news, setNews] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/news/all`)
      .then(res => res.json())
      .then(data => {
        const formattedNews = data.map((n: any) => ({
          ...n,
          slug: String(n.id), 
          image: n.imageUrl || "https://picsum.photos/800/400",
          excerpt: n.content ? n.content.replace(/<[^>]+>/g, '').substring(0, 120) + "..." : "", 
          category: n.category ? n.category.trim().toLowerCase() : 'rajasthan',
          publishedAt: n.createdAt || new Date().toISOString(), 
          tags: [n.category || "News"]
        }));
        setNews(formattedNews.reverse());
      })
      .catch(err => console.error("News load fail:", err));

    fetch(`${API_URL}/api/videos/all`)
      .then(res => res.json())
      .then(data => {
        const formattedVideos = data.map((v: any) => ({
          ...v,
          thumbnail: v.thumb || "https://picsum.photos/400/225",
          duration: "New"
        }));
        setVideos(formattedVideos.reverse());
      })
      .catch(err => console.error("Video load fail:", err))
      .finally(() => setLoading(false));

  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-surface"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  const top = news.slice(0, 3);
  const latest = news.slice(3, 11);
  const rajasthan = news.filter(n => n.category === "rajasthan").slice(0, 4);
  const sports = news.filter(n => n.category === "sports").slice(0, 4);
  const entertainment = news.filter(n => n.category === "entertainment").slice(0, 4);
  const tech = news.filter(n => n.category === "technology").slice(0, 3);
  const jobs = news.filter(n => n.category === "jobs").slice(0, 3);

  // Anya Khabar (Jo main categories me nahi hain)
  const mainCategories = ["rajasthan", "sports", "entertainment", "technology", "jobs"];
  const anyaNews = news.filter(n => !mainCategories.includes(n.category)).slice(0, 12); // Isko 12 kar diya taaki 3-column me set ho jaye

  return (
    <div className="bg-surface">
      {top.length > 0 && <Hero items={top} />}

      <div className="container mx-auto px-4 py-8">
        
        {/* UPPER SECTION: 2/3 Content + 1/3 Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-10">
            
            <section>
              <SectionHeader title="ताज़ा ख़बरें" to="/national" accent="ताज़ा" />
              <div className="bg-card border border-border rounded-lg min-h-[100px] p-2">
                {latest.length > 0 ? latest.map((a) => <ArticleListItem key={`latest-${a.slug}`} a={a} />) : <p className="text-muted-foreground text-center p-4">अभी कोई खबर नहीं है।</p>}
              </div>
            </section>

            <section>
              <SectionHeader title={(CATEGORY_LABELS as any).rajasthan || "राजस्थान"} to={(CATEGORY_PATH as any).rajasthan || "/rajasthan"} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {rajasthan.length > 0 ? rajasthan.map((a) => <ArticleCard key={`raj-${a.slug}`} a={a} />) : <p className="text-muted-foreground">कोई खबर नहीं।</p>}
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section>
                <SectionHeader title={(CATEGORY_LABELS as any).sports || "खेल"} to={(CATEGORY_PATH as any).sports || "/sports"} />
                <div className="space-y-3">
                  {sports.length > 0 ? sports.slice(0, 3).map((a) => <ArticleListItem key={`sport-${a.slug}`} a={a} />) : <p className="text-muted-foreground">कोई खबर नहीं।</p>}
                </div>
              </section>
              <section>
                <SectionHeader title={(CATEGORY_LABELS as any).entertainment || "मनोरंजन"} to={(CATEGORY_PATH as any).entertainment || "/entertainment"} />
                <div className="space-y-3">
                  {entertainment.length > 0 ? entertainment.slice(0, 3).map((a) => <ArticleListItem key={`ent-${a.slug}`} a={a} />) : <p className="text-muted-foreground">कोई खबर नहीं।</p>}
                </div>
              </section>
            </div>

            <section>
              <SectionHeader title="ताज़ा वीडियो" to="/videos" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {videos.length > 0 ? videos.slice(0, 4).map((v) => (
                  <Link key={v.id} to="/videos" className="group block">
                    <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                      <img src={v.thumbnail} alt={v.title} loading="lazy" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <Play className="text-white" size={32} />
                      </div>
                      <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">{v.duration}</span>
                    </div>
                    <h4 className="text-sm font-semibold mt-2 line-clamp-2">{v.title}</h4>
                  </Link>
                )) : <p className="text-muted-foreground col-span-full">कोई वीडियो नहीं।</p>}
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section>
                <SectionHeader title={(CATEGORY_LABELS as any).technology || "टेक्नोलॉजी"} to={(CATEGORY_PATH as any).technology || "/technology"} />
                <div className="space-y-3">
                  {tech.length > 0 ? tech.map((a) => <ArticleListItem key={`tech-${a.slug}`} a={a} />) : <p className="text-muted-foreground">कोई खबर नहीं।</p>}
                </div>
              </section>
              <section>
                <SectionHeader title={(CATEGORY_LABELS as any).jobs || "नौकरी"} to={(CATEGORY_PATH as any).jobs || "/jobs"} />
                <div className="space-y-3">
                  {jobs.length > 0 ? jobs.map((a) => <ArticleListItem key={`job-${a.slug}`} a={a} />) : <p className="text-muted-foreground">कोई खबर नहीं।</p>}
                </div>
              </section>
            </div>

          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <TrendingWidget items={news.slice(0, 8)} />
            <MostReadWidget items={news.slice(8, 16)} />
          </aside>
        </div>

        {/* 👉 FULL WIDTH SECTION (100%): Anya Khabar */}
        {anyaNews.length > 0 && (
          <section className="pt-6 border-t-2 border-border">
            <div className="flex items-center gap-2 mb-6 border-b-2 border-primary pb-2">
               <FileText size={22} className="text-primary" />
               <h2 className="text-2xl font-extrabold">अन्य ख़बरें</h2>
            </div>
            
            {/* Yahan grid-cols-3 kar diya hai taaki full width me 3 line me news aaye */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-card border border-border p-5 rounded-lg shadow-sm">
              {anyaNews.map((a) => (
                <ArticleListItem key={`anya-${a.slug}`} a={a} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

function Hero({ items }: { items: any[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (items.length === 0) return;
    const t = setInterval(() => setI((p) => (p + 1) % items.length), 5500);
    return () => clearInterval(t);
  }, [items.length]);

  if (items.length === 0) return null;

  const a = items[i];
  return (
    <div className="relative bg-ink">
      <div className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative h-[280px] md:h-[460px] rounded-lg overflow-hidden">
          <img src={a.image} alt={a.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 md:p-8 text-white">
            <Link to={(CATEGORY_PATH as any)[a.category] || "/"} className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
              {(CATEGORY_LABELS as any)[a.category] || a.category?.toUpperCase() || "न्यूज़"}
            </Link>
            <Link to="/article/$slug" params={{ slug: a.slug }}>
              <h1 className="text-2xl md:text-4xl font-extrabold mt-3 leading-tight hover:text-primary transition-colors line-clamp-3">
                {a.title}
              </h1>
            </Link>
            <p className="text-sm md:text-base opacity-90 mt-2 line-clamp-2 max-w-2xl">{a.excerpt}</p>
          </div>
          <div className="absolute top-3 right-3 flex gap-1">
            <button onClick={() => setI((p) => (p - 1 + items.length) % items.length)} className="bg-black/60 text-white p-1.5 rounded hover:bg-primary" aria-label="पिछला">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setI((p) => (p + 1) % items.length)} className="bg-black/60 text-white p-1.5 rounded hover:bg-primary" aria-label="अगला">
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="absolute bottom-3 right-3 flex gap-1.5">
            {items.map((_, k) => (
              <button key={k} onClick={() => setI(k)} className={`w-2 h-2 rounded-full ${k === i ? "bg-primary" : "bg-white/50"}`} aria-label={`स्लाइड ${k + 1}`} />
            ))}
          </div>
        </div>

        <div className="grid grid-rows-2 gap-4">
          {items.slice(0, 2).map((it) => (
            <Link key={`hero-side-${it.slug}`} to="/article/$slug" params={{ slug: it.slug }} className="relative h-[140px] md:h-[222px] rounded-lg overflow-hidden group">
              <img src={it.image} alt={it.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                <span className="bg-primary text-xs px-2 py-0.5 rounded">{(CATEGORY_LABELS as any)[it.category] || it.category?.toUpperCase() || "न्यूज़"}</span>
                <h3 className="font-bold text-sm md:text-base mt-1.5 line-clamp-2">{it.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function TrendingWidget({ items }: { items: any[] }) {
  if (!items || items.length === 0) return null;
  return (
    <aside className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
        <h3 className="font-bold text-lg">ट्रेंडिंग ख़बरें</h3>
      </div>
      <ul className="divide-y divide-border">
        {items.map((a, i) => (
          <li key={`trend-${a.slug}`} className="p-4 hover:bg-muted/40 flex gap-4 items-start">
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
    </aside>
  );
}

function MostReadWidget({ items }: { items: any[] }) {
  if (!items || items.length === 0) return null;
  return (
    <aside className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="bg-primary text-primary-foreground px-4 py-3 font-bold text-lg">सबसे ज़्यादा पढ़ी गईं</div>
      <ul className="divide-y divide-border">
        {items.map((a) => (
          <li key={`most-${a.slug}`} className="p-3.5 hover:bg-muted/40">
            <Link to="/article/$slug" params={{ slug: a.slug }} className="text-sm font-semibold line-clamp-2 hover:text-primary">
              {a.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}