// Generic category page renderer used by multiple routes
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  type Category,
  type Article,
  CATEGORY_LABELS,
} from "@/data/news";
import { ArticleCard, ArticleListItem, AdSlot, PageHero, SectionHeader } from "@/components/news-ui";
import { Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8085";

type Layout = "lead" | "magazine" | "grid" | "regions" | "scoreboard" | "posters" | "reviews" | "table";

interface Props {
  category: Category;
  layout: Layout;
  kicker?: string;
  subtitle?: string;
  extras?: React.ReactNode;
}

export function CategoryPage({ category, layout, kicker, subtitle, extras }: Props) {
  const [list, setList] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/news/all`)
      .then(res => {
        if (!res.ok) throw new Error("Backend ne data nahi diya!");
        return res.json();
      })
      .then(data => {
        if (!Array.isArray(data)) {
          console.error("Error: Backend se array nahi aaya", data);
          setList([]);
          return;
        }

        const formattedNews = data.map((n: any) => ({
          slug: n.id.toString(),
          title: n.title,
          excerpt: n.content ? n.content.substring(0, 120) + "..." : "",
          body: [n.content || ""],
          image: n.imageUrl || "https://picsum.photos/800/400",
          category: n.category ? n.category.trim().toLowerCase() : 'rajasthan',
          authorSlug: n.author || "admin",
          publishedAt: n.createdAt || new Date().toISOString(),
          tags: [n.category || "News"],
        }));

        const filteredList = formattedNews.filter((n: any) => n.category === String(category).toLowerCase());
        setList(filteredList.reverse() as any);
      })
      .catch(err => {
        console.error("Category fetch fail:", err);
        setList([]); 
      })
      .finally(() => setLoading(false));
  }, [category]);

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center bg-surface"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
  }

  if (list.length === 0) {
    return (
      <div className="bg-surface min-h-[60vh]">
        <PageHero kicker={kicker ?? "श्रेणी"} title={CATEGORY_LABELS[category]} subtitle={subtitle} />
        {extras}
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-xl text-muted-foreground font-semibold">इस केटेगरी में अभी कोई खबर नहीं है।</p>
          <p className="text-sm text-muted-foreground mt-2">एडमिन पैनल से इस केटेगरी में नई खबरे डालें।</p>
        </div>
      </div>
    );
  }

  const [lead, ...rest] = list;

  return (
    <div className="bg-surface">
      <PageHero kicker={kicker ?? "श्रेणी"} title={CATEGORY_LABELS[category]} subtitle={subtitle} />
      {extras}
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {layout === "lead" && <LeadLayout lead={lead} rest={rest} />}
          {layout === "magazine" && <MagazineLayout list={list} />}
          {layout === "grid" && <GridLayout list={list} />}
          {layout === "regions" && <RegionsLayout list={list} />}
          {layout === "scoreboard" && <ScoreboardLayout list={list} />}
          {layout === "posters" && <PostersLayout list={list} />}
          {layout === "reviews" && <ReviewsLayout list={list} />}
          {layout === "table" && <TableLayout list={list} />}
        </div>
        <aside className="space-y-6">
          <DynamicTrending items={list.slice(0, 6)} title={`ट्रेंडिंग — ${CATEGORY_LABELS[category]}`} />
          <AdSlot height="h-64" />
        </aside>
      </div>
    </div>
  );
}

function DynamicTrending({ items, title }: { items: Article[], title: string }) {
  if (!items || items.length === 0) return null;
  return (
    <aside className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
        <h3 className="font-bold text-lg">{title}</h3>
      </div>
      <ul className="divide-y divide-border">
        {items.map((a, i) => (
          <li key={a.slug} className="p-4 hover:bg-muted/40 flex gap-4 items-start">
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

// ---------------------------------------------------------
// NICHE KE LAYOUTS MEIN KOI CHHED CHHAD NAHI KI GAYI HAI
// ---------------------------------------------------------

function LeadLayout({ lead, rest }: { lead: Article; rest: Article[] }) {
  return (
    <>
      <ArticleCard a={lead} size="lg" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rest.slice(0, 2).map((a) => <ArticleCard key={a.slug} a={a} />)}
      </div>
      <div className="bg-card border border-border rounded-lg">
        {rest.slice(2).map((a) => <ArticleListItem key={a.slug} a={a} />)}
      </div>
    </>
  );
}

function MagazineLayout({ list }: { list: Article[] }) {
  const districts = ["जयपुर", "उदयपुर", "जोधपुर", "बीकानेर", "जैसलमेर", "अजमेर", "कोटा", "अलवर"];
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {districts.map((d) => (
          <span key={d} className="px-3 py-1 bg-card border border-border rounded-full text-sm hover:bg-primary hover:text-primary-foreground cursor-pointer transition">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {list.map((a, i) => (
          <div key={a.slug} className={i === 0 ? "col-span-2 md:col-span-3" : ""}>
            <ArticleCard a={a} size={i === 0 ? "lg" : "md"} />
          </div>
        ))}
      </div>
    </>
  );
}

function GridLayout({ list }: { list: Article[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {list.map((a) => <ArticleCard key={a.slug} a={a} />)}
    </div>
  );
}

function RegionsLayout({ list }: { list: Article[] }) {
  const regions = ["सभी", "एशिया", "यूरोप", "अमेरिका", "मध्य पूर्व"];
  return (
    <>
      <div className="flex gap-2 border-b border-border overflow-x-auto">
        {regions.map((r, i) => (
          <button key={r} className={`px-4 py-2 whitespace-nowrap text-sm font-semibold border-b-2 ${i === 0 ? "border-primary text-primary" : "border-transparent hover:text-primary"}`}>
            {r}
          </button>
        ))}
      </div>
      <div className="bg-card border border-border rounded-lg">
        {list.map((a) => <ArticleListItem key={a.slug} a={a} />)}
      </div>
    </>
  );
}

function ScoreboardLayout({ list }: { list: Article[] }) {
  return (
    <>
      <div className="bg-ink text-primary-foreground rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { t: "IND vs AUS", s: "346/4 (78.2)", st: "लाइव" },
          { t: "RR vs CSK", s: "स्थगित", st: "बारिश" },
          { t: "MUM vs DEL", s: "कल 7:30 PM", st: "अगला" },
        ].map((m) => (
          <div key={m.t} className="bg-white/5 p-3 rounded">
            <div className="text-xs text-primary font-bold">{m.st}</div>
            <div className="font-bold text-lg mt-1">{m.t}</div>
            <div className="opacity-90">{m.s}</div>
          </div>
        ))}
      </div>
      <SectionHeader title="ताज़ा खेल समाचार" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {list.map((a) => <ArticleCard key={a.slug} a={a} />)}
      </div>
    </>
  );
}

function PostersLayout({ list }: { list: Article[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {list.map((a) => (
        <Link key={a.slug} to="/article/$slug" params={{ slug: a.slug }} className="group block card-hover">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
            <img src={a.image} alt={a.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3 text-white">
              <span className="text-xs bg-primary px-2 py-0.5 rounded">{CATEGORY_LABELS[a.category as Category]}</span>
              <h3 className="font-bold text-sm mt-1.5 line-clamp-3">{a.title}</h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function ReviewsLayout({ list }: { list: Article[] }) {
  return (
    <div className="space-y-4">
      {list.map((a, i) => (
        <article key={a.slug} className="bg-card border border-border rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-3 card-hover">
          <Link to="/article/$slug" params={{ slug: a.slug }} className="md:col-span-1 h-48 md:h-full bg-muted overflow-hidden block">
            <img src={a.image} alt={a.title} loading="lazy" className="w-full h-full object-cover" />
          </Link>
          <div className="md:col-span-2 p-5">
            <span className="inline-block bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded">
              {i % 3 === 0 ? "नया गैजेट" : i % 3 === 1 ? "रिव्यू" : "ट्रेंडिंग"}
            </span>
            <Link to="/article/$slug" params={{ slug: a.slug }}>
              <h3 className="text-xl font-bold mt-2 hover:text-primary line-clamp-2">{a.title}</h3>
            </Link>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{a.excerpt}</p>
            <Link to="/article/$slug" params={{ slug: a.slug }} className="inline-block mt-3 text-primary font-semibold text-sm hover:underline">
              पूरा पढ़ें →
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

function TableLayout({ list }: { list: Article[] }) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-ink text-primary-foreground">
          <tr>
            <th className="text-right p-3">पद / भर्ती</th>
            <th className="text-right p-3 hidden md:table-cell">विभाग</th>
            <th className="text-right p-3 hidden sm:table-cell">अंतिम तिथि</th>
            <th className="text-right p-3">कार्रवाई</th>
          </tr>
        </thead>
        <tbody>
          {list.map((a, i) => (
            <tr key={a.slug} className="border-t border-border hover:bg-muted/40">
              <td className="p-3 font-semibold max-w-xs">
                <Link to="/article/$slug" params={{ slug: a.slug }} className="hover:text-primary line-clamp-2">
                  {a.title}
                </Link>
              </td>
              <td className="p-3 hidden md:table-cell">{a.tags[0] ?? "—"}</td>
              <td className="p-3 hidden sm:table-cell">
                {new Intl.DateTimeFormat("hi-IN", { day: "numeric", month: "short" }).format(
                  new Date(Date.now() + (15 + i * 3) * 86400000)
                )}
              </td>
              <td className="p-3">
                <Link to="/article/$slug" params={{ slug: a.slug }} className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded hover:opacity-90">
                  आवेदन करें
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}