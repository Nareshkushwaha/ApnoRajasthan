import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import {
  type Article,
  CATEGORY_LABELS,
  CATEGORY_PATH,
  getAuthor,
  getTrending,
} from "@/data/news";

export function ArticleCard({ a, size = "md" }: { a: Article; size?: "sm" | "md" | "lg" }) {
  // 👉 MAGIC FIX YAHAN HAI: Fixed height hatakar 'aspect-video' lagaya hai aur hover par zoom effect diya hai
  return (
    <article className="bg-card border border-border rounded-lg overflow-hidden group hover:shadow-md transition-all duration-300">
      <Link to="/article/$slug" params={{ slug: a.slug }} className="block overflow-hidden relative aspect-video bg-muted">
        <img 
          src={a.image} 
          alt={a.title} 
          loading="lazy" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded shadow-sm z-10">
          {CATEGORY_LABELS[a.category as keyof typeof CATEGORY_LABELS] || "न्यूज़"}
        </span>
      </Link>
      <div className={size === "lg" ? "p-5" : "p-4"}>
        <Link to="/article/$slug" params={{ slug: a.slug }}>
          <h3 className={`${size === "lg" ? "text-2xl" : "text-lg"} font-extrabold leading-tight line-clamp-2 group-hover:text-primary transition-colors`}>
            {a.title}
          </h3>
        </Link>
        {size !== "sm" && (
          <p className={`text-muted-foreground mt-2 line-clamp-2 ${size === "lg" ? "text-base" : "text-sm"}`}>
            {a.excerpt}
          </p>
        )}
        <ArticleMeta a={a} />
      </div>
    </article>
  );
}

export function ArticleListItem({ a }: { a: Article }) {
  // 👉 Chhote cards me bhi aspect-video lagaya hai taaki photo ekdum perfect 16:9 ratio me dikhe
  return (
    <article className="flex gap-4 p-3.5 border-b border-border hover:bg-muted/40 transition-colors group">
      <Link to="/article/$slug" params={{ slug: a.slug }} className="shrink-0 w-32 aspect-video overflow-hidden rounded-md bg-muted relative">
        <img 
          src={a.image} 
          alt={a.title} 
          loading="lazy" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
      </Link>
      <div className="flex-1 min-w-0 py-0.5">
        <Link
          to={(CATEGORY_PATH as any)[a.category] || "/"}
          className="text-xs text-primary font-bold uppercase tracking-wide"
        >
          {CATEGORY_LABELS[a.category as keyof typeof CATEGORY_LABELS] || "न्यूज़"}
        </Link>
        <Link to="/article/$slug" params={{ slug: a.slug }}>
          <h4 className="font-semibold text-sm md:text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors mt-1">
            {a.title}
          </h4>
        </Link>
        <ArticleMeta a={a} compact />
      </div>
    </article>
  );
}

export function ArticleMeta({ a, compact }: { a: Article; compact?: boolean }) {
  const author = getAuthor(a.authorSlug);
  const safeDate = a.publishedAt ? new Date(a.publishedAt) : new Date();
  const date = new Intl.DateTimeFormat("hi-IN", { day: "numeric", month: "short" }).format(safeDate);
  
  return (
    <div className={`flex items-center gap-3 text-xs text-muted-foreground ${compact ? "mt-1.5" : "mt-3"}`}>
      {author && (
        <Link to="/author/$slug" params={{ slug: author.slug }} className="hover:text-primary font-medium">
          {author.name}
        </Link>
      )}
      <span className="flex items-center gap-1"><Clock size={12} /> {date}</span>
    </div>
  );
}

export function TrendingSidebar({ title = "ट्रेंडिंग ख़बरें", limit = 6 }: { title?: string; limit?: number }) {
  const list = getTrending(limit);
  return (
    <aside className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
      <div className="bg-ink text-primary-foreground px-4 py-3 font-bold flex items-center gap-2 text-lg">
        <span className="w-2 h-2 bg-primary rounded-full animate-pulse-live" />
        {title}
      </div>
      <ol className="divide-y divide-border">
        {list.map((a, i) => (
          <li key={a.slug} className="p-4 flex gap-4 hover:bg-muted/40 transition-colors">
            <span className="text-2xl font-extrabold text-primary/80 leading-none w-6 shrink-0 mt-0.5">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex-1 min-w-0">
              <Link
                to="/article/$slug"
                params={{ slug: a.slug }}
                className="font-bold text-sm leading-snug line-clamp-2 hover:text-primary transition-colors"
              >
                {a.title}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}

export function AdSlot({ label = "विज्ञापन", height = "h-40" }: { label?: string; height?: string }) {
  return (
    <div className={`${height} border-2 border-dashed border-border rounded-lg flex items-center justify-center text-xs font-medium text-muted-foreground bg-muted/30`}>
      {label}
    </div>
  );
}

export function SectionHeader({ title, to, accent }: { title: string; to?: string; accent?: string }) {
  return (
    <div className="flex items-end justify-between mb-5 border-b-2 border-primary pb-2">
      <h2 className="text-xl md:text-2xl font-extrabold text-ink flex items-center">
        <span className="bg-primary text-primary-foreground px-3 py-1 mr-3 rounded-sm text-sm uppercase tracking-wider">{accent ?? "●"}</span>
        {title}
      </h2>
      {to && (
        <Link to={to} className="text-sm text-primary font-bold hover:underline underline-offset-4">
          सभी देखें →
        </Link>
      )}
    </div>
  );
}

export function PageHero({ kicker, title, subtitle }: { kicker?: string; title: string; subtitle?: string }) {
  return (
    <div className="bg-ink text-primary-foreground relative overflow-hidden">
      {/* Background design element */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="container mx-auto px-4 py-12 relative z-10">
        {kicker && <div className="text-primary font-bold text-sm mb-3 uppercase tracking-widest">{kicker}</div>}
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">{title}</h1>
        {subtitle && <p className="opacity-80 mt-3 text-lg max-w-2xl">{subtitle}</p>}
      </div>
    </div>
  );
}