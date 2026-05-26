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
  const heights = { sm: "h-32", md: "h-48", lg: "h-72" }[size];
  return (
    <article className="bg-card border border-border rounded-lg overflow-hidden card-hover">
      <Link to="/article/$slug" params={{ slug: a.slug }} className="block">
        <div className={`relative ${heights} overflow-hidden bg-muted`}>
          <img src={a.image} alt={a.title} loading="lazy" className="w-full h-full object-cover" />
          <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
            {CATEGORY_LABELS[a.category as keyof typeof CATEGORY_LABELS] || "न्यूज़"}
          </span>
        </div>
      </Link>
      <div className="p-3">
        <Link to="/article/$slug" params={{ slug: a.slug }}>
          <h3 className={`${size === "lg" ? "text-xl" : "text-base"} font-bold leading-snug line-clamp-2 hover:text-primary transition-colors`}>
            {a.title}
          </h3>
        </Link>
        {size !== "sm" && <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{a.excerpt}</p>}
        <ArticleMeta a={a} />
      </div>
    </article>
  );
}

export function ArticleListItem({ a }: { a: Article }) {
  return (
    <article className="flex gap-3 p-3 border-b border-border hover:bg-muted/40 transition-colors">
      <Link to="/article/$slug" params={{ slug: a.slug }} className="shrink-0 w-28 h-20 overflow-hidden rounded bg-muted">
        <img src={a.image} alt={a.title} loading="lazy" className="w-full h-full object-cover" />
      </Link>
      <div className="flex-1 min-w-0">
        <Link
          to={(CATEGORY_PATH as any)[a.category] || "/"}
          className="text-xs text-primary font-semibold uppercase tracking-wide"
        >
          {CATEGORY_LABELS[a.category as keyof typeof CATEGORY_LABELS] || "न्यूज़"}
        </Link>
        <Link to="/article/$slug" params={{ slug: a.slug }}>
          <h4 className="font-semibold text-sm leading-snug line-clamp-2 hover:text-primary transition-colors mt-0.5">
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
  // 👉 DATE CRASH FIX: Agar a.publishedAt valid nahi hai to aaj ki date le lo
  const safeDate = a.publishedAt ? new Date(a.publishedAt) : new Date();
  const date = new Intl.DateTimeFormat("hi-IN", { day: "numeric", month: "short" }).format(safeDate);
  
  return (
    <div className={`flex items-center gap-3 text-xs text-muted-foreground ${compact ? "mt-1" : "mt-2"}`}>
      {author && (
        <Link to="/author/$slug" params={{ slug: author.slug }} className="hover:text-primary">
          {author.name}
        </Link>
      )}
      <span className="flex items-center gap-1"><Clock size={11} /> {date}</span>
      {/* 👉 VIEWS HATA DIYA HAI */}
    </div>
  );
}

export function TrendingSidebar({ title = "ट्रेंडिंग ख़बरें", limit = 6 }: { title?: string; limit?: number }) {
  const list = getTrending(limit);
  return (
    <aside className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="bg-ink text-primary-foreground px-4 py-2 font-bold flex items-center gap-2">
        <span className="w-2 h-2 bg-primary rounded-full animate-pulse-live" />
        {title}
      </div>
      <ol className="divide-y divide-border">
        {list.map((a, i) => (
          <li key={a.slug} className="p-3 flex gap-3 hover:bg-muted/40">
            <span className="text-2xl font-extrabold text-primary leading-none w-6 shrink-0">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex-1 min-w-0">
              <Link
                to="/article/$slug"
                params={{ slug: a.slug }}
                className="font-semibold text-sm leading-snug line-clamp-2 hover:text-primary"
              >
                {a.title}
              </Link>
              {/* 👉 VIEWS HATA DIYA HAI */}
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}

export function AdSlot({ label = "विज्ञापन", height = "h-40" }: { label?: string; height?: string }) {
  return (
    <div className={`${height} border-2 border-dashed border-border rounded-lg flex items-center justify-center text-xs text-muted-foreground bg-muted/30`}>
      {label}
    </div>
  );
}

export function SectionHeader({ title, to, accent }: { title: string; to?: string; accent?: string }) {
  return (
    <div className="flex items-end justify-between mb-4 border-b-2 border-primary pb-2">
      <h2 className="text-xl md:text-2xl font-extrabold text-ink">
        <span className="bg-primary text-primary-foreground px-3 py-1 mr-2">{accent ?? "●"}</span>
        {title}
      </h2>
      {to && (
        <Link to={to} className="text-sm text-primary font-semibold hover:underline">
          सभी देखें →
        </Link>
      )}
    </div>
  );
}

export function PageHero({ kicker, title, subtitle }: { kicker?: string; title: string; subtitle?: string }) {
  return (
    <div className="bg-ink text-primary-foreground">
      <div className="container mx-auto px-4 py-10">
        {kicker && <div className="text-primary font-semibold text-sm mb-2">{kicker}</div>}
        <h1 className="text-3xl md:text-4xl font-extrabold">{title}</h1>
        {subtitle && <p className="opacity-80 mt-2 max-w-2xl">{subtitle}</p>}
      </div>
    </div>
  );
}