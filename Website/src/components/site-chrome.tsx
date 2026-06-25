import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { 
  Search, Menu, X, Tv, Facebook, Twitter, Youtube, Instagram, User, 
  Home, Landmark, MapPin, Flag, Globe, Trophy, Film, Cpu, Briefcase, Video 
} from "lucide-react";
import { CATEGORY_LABELS, CATEGORY_PATH } from "@/data/news";

import { API_BASE_URL } from "@/lib/api";

const NAV: { label: string; to: string; icon: any }[] = [
  { label: "होम", to: "/", icon: Home },
  { label: CATEGORY_LABELS.politics, to: CATEGORY_PATH.politics, icon: Landmark },
  { label: CATEGORY_LABELS.rajasthan, to: CATEGORY_PATH.rajasthan, icon: MapPin },
  { label: CATEGORY_LABELS.national, to: CATEGORY_PATH.national, icon: Flag },
  { label: CATEGORY_LABELS.international, to: CATEGORY_PATH.international, icon: Globe },
  { label: CATEGORY_LABELS.sports, to: CATEGORY_PATH.sports, icon: Trophy },
  { label: CATEGORY_LABELS.entertainment, to: CATEGORY_PATH.entertainment, icon: Film },
  { label: CATEGORY_LABELS.technology, to: CATEGORY_PATH.technology, icon: Cpu },
  { label: CATEGORY_LABELS.jobs, to: CATEGORY_PATH.jobs, icon: Briefcase },
  { label: "वीडियो", to: "/videos", icon: Video },
  { label: "लाइव टीवी", to: "/live-tv", icon: Tv },
];

export function SiteHeader() {
  const [mobile, setMobile] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const today = new Intl.DateTimeFormat("hi-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      navigate({ to: "/search", search: { q: q.trim() } });
      setMobile(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border shadow-sm">
      <div className="bg-ink text-primary-foreground text-xs">
        <div className="container mx-auto flex items-center justify-between px-4 py-1.5">
          <span className="hidden sm:inline opacity-80">{today}</span>
          <div className="flex items-center gap-3">
            <Link to="/about" className="hover:text-primary transition-colors">हमारे बारे में</Link>
            <span className="opacity-30">|</span>
            <Link to="/contact" className="hover:text-primary transition-colors">संपर्क</Link>
            
            <div className="hidden md:flex items-center gap-2.5 ml-2 pl-3 border-l border-white/20">
              <a href="https://www.facebook.com/Apnorajasthan01/?rdid=QjEEc3IwYdwkXZSm" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-primary transition-colors"><Facebook size={14} /></a>
              <a href="https://x.com/AapnoRajasthaan" target="_blank" rel="noreferrer" aria-label="Twitter" className="hover:text-primary transition-colors"><Twitter size={14} /></a>
              <a href="https://www.youtube.com/channel/UCBp889JG9RoSxfbiM5a8GoA" target="_blank" rel="noreferrer" aria-label="YouTube" className="hover:text-primary transition-colors"><Youtube size={14} /></a>
              <a href="https://www.instagram.com/aapno.rajasthan12/" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-primary transition-colors"><Instagram size={14} /></a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="bg-primary text-primary-foreground font-extrabold text-2xl px-3 py-1.5 rounded-md tracking-tight">
            आपणो
          </div>
          <div className="font-extrabold text-2xl text-ink leading-none">
            राजस्थान
            <div className="text-[10px] font-normal text-muted-foreground tracking-widest mt-0.5">AAPNO RAJASTHAN</div>
          </div>
        </Link>

        <form onSubmit={submit} className="flex-1 max-w-xl mx-auto hidden md:flex">
          <div className="flex w-full items-stretch border border-input rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-ring">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ख़बरें, विषय, खोजें…"
              className="flex-1 px-3 py-2 bg-background outline-none text-sm"
            />
            <button type="submit" className="bg-primary text-primary-foreground px-4 flex items-center hover:opacity-90 transition-opacity" aria-label="खोजें">
              <Search size={18} />
            </button>
          </div>
        </form>

        <Link
          to="/live-tv"
          className="hidden sm:inline-flex items-center gap-2 bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse-live" />
          <Tv size={16} /> लाइव टीवी
        </Link>

        <div className="flex items-center gap-4 ml-auto md:hidden text-ink">
          <button onClick={() => setMobile(true)} aria-label="खोजें" className="hover:text-primary transition-colors">
            <Search size={22} />
          </button>
          <button
            className="p-1 rounded-md hover:bg-muted transition-colors"
            onClick={() => setMobile((v) => !v)}
            aria-label="मेन्यू"
          >
            {mobile ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      <nav className="hidden md:block bg-ink text-primary-foreground">
        <div className="container mx-auto px-4 flex items-center gap-1 overflow-x-auto">
          {NAV.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`px-3 py-2.5 text-sm whitespace-nowrap transition-colors border-b-2 ${
                  active
                    ? "border-primary text-primary-foreground bg-white/5"
                    : "border-transparent hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {mobile && (
        <div className="md:hidden border-t border-border bg-background shadow-lg absolute w-full z-50">
          <form onSubmit={submit} className="p-3 border-b border-border flex gap-2">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="खोजें…"
              className="flex-1 px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button type="submit" className="bg-primary text-primary-foreground px-3 rounded-md">
              <Search size={18} />
            </button>
          </form>
          
          <div className="flex flex-col max-h-[60vh] overflow-y-auto">
            {NAV.map((item) => {
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobile(false)}
                  className="px-4 py-3 border-b border-border text-sm hover:bg-muted flex items-center gap-3 font-medium transition-colors"
                >
                  <item.icon size={16} className="opacity-70" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <BreakingTicker />
    </header>
  );
}

function BreakingTicker() {
  const [items, setItems] = useState<{ title: string, slug: string }[]>([{ title: "ताज़ा ख़बरें लोड हो रही हैं...", slug: "" }]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/news/all`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const now = new Date(); 
          
          const validBreakingNews = data.filter((n: any) => {
            if (n.status !== "Published") return false;
            
            if (n.publishType === "schedule" && n.scheduleTime) {
              const scheduledDate = new Date(n.scheduleTime);
              if (scheduledDate > now) {
                return false; 
              }
            }
            
            return n.isBreaking === true || n.isBreaking === "true" || n.isBreaking === 1;
          });
          
          if (validBreakingNews.length > 0) {
            const latestItems = validBreakingNews.slice(0, 5).map((n: any) => ({
              title: n.title,
              // 👉 YAHAN WAPAS SLUG SET KIYA HAI (Agar slug khali ho, tabhi ID jayegi)
              slug: n.urlSlug && n.urlSlug.trim() !== "" ? n.urlSlug : n.id.toString() 
            }));
            setItems(latestItems);
          } else {
            setItems([{ title: "आज की कोई ब्रेकिंग न्यूज़ नहीं है", slug: "" }]);
          }
        }
      })
      .catch(err => console.error("Breaking news fetch error:", err));
  }, []);

  const displayItems = items.length > 1 ? [...items, ...items, ...items] : items;

  return (
    <div className="bg-primary text-primary-foreground flex items-stretch overflow-hidden border-b border-primary/20">
      <div className="bg-ink px-4 py-2 text-xs font-bold flex items-center gap-2 shrink-0 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.5)] tracking-wide">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse-live" />
        ब्रेकिंग
      </div>
      <div className="overflow-hidden flex-1 relative py-2">
        <div className={`flex gap-10 whitespace-nowrap text-sm font-medium ${items.length > 1 ? 'animate-ticker' : 'px-4'}`}>
          {displayItems.map((item, i) => (
            <span key={i} className="flex items-center gap-3">
              {items.length > 1 && <span className="opacity-50 text-[10px]">●</span>}
              {item.slug ? (
                <Link to="/article/$slug" params={{ slug: item.slug }} className="hover:underline transition-all underline-offset-4">
                  {item.title}
                </Link>
              ) : (
                <span>{item.title}</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-ink text-primary-foreground mt-12 border-t-4 border-primary">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-primary px-2.5 py-1 rounded font-extrabold tracking-tight">अपनो</div>
            <div className="font-extrabold text-xl tracking-wide">राजस्थान</div>
          </div>
          <p className="text-sm opacity-75 leading-relaxed pr-4">
            राजस्थान, देश और दुनिया की हर बड़ी ख़बर — सबसे पहले, सबसे सटीक। अपनो राजस्थान के साथ जुड़े रहिए।
          </p>
          <div className="flex gap-4 mt-6">
            <a href="https://www.facebook.com/Apnorajasthan01/?rdid=QjEEc3IwYdwkXZSm" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-primary transition-colors hover:-translate-y-1 transform duration-200"><Facebook size={20} /></a>
            <a href="https://x.com/AapnoRajasthaan" target="_blank" rel="noreferrer" aria-label="Twitter" className="hover:text-primary transition-colors hover:-translate-y-1 transform duration-200"><Twitter size={20} /></a>
            <a href="https://www.youtube.com/channel/UCBp889JG9RoSxfbiM5a8GoA" target="_blank" rel="noreferrer" aria-label="YouTube" className="hover:text-primary transition-colors hover:-translate-y-1 transform duration-200"><Youtube size={20} /></a>
            <a href="https://www.instagram.com/aapno.rajasthan12/" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-primary transition-colors hover:-translate-y-1 transform duration-200"><Instagram size={20} /></a>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-primary tracking-wide">श्रेणियाँ</h4>
          <ul className="space-y-2.5 text-sm opacity-90">
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
              <li key={k}>
                <Link to={(CATEGORY_PATH as any)[k]} className="hover:text-primary hover:pl-1 transition-all duration-200 inline-block">
                  {v}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-primary tracking-wide">क्विक लिंक</h4>
          <ul className="space-y-2.5 text-sm opacity-90">
            <li><Link to="/videos" className="hover:text-primary hover:pl-1 transition-all duration-200 inline-block">वीडियो</Link></li>
            <li><Link to="/live-tv" className="hover:text-primary hover:pl-1 transition-all duration-200 inline-block">लाइव टीवी</Link></li>
            <li><Link to="/about" className="hover:text-primary hover:pl-1 transition-all duration-200 inline-block">हमारे बारे में</Link></li>
            <li><Link to="/contact" className="hover:text-primary hover:pl-1 transition-all duration-200 inline-block">संपर्क</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-primary tracking-wide">क़ानूनी</h4>
          <ul className="space-y-2.5 text-sm opacity-90">
            <li><Link to="/privacy" className="hover:text-primary hover:pl-1 transition-all duration-200 inline-block">गोपनीयता नीति</Link></li>
            <li><Link to="/terms" className="hover:text-primary hover:pl-1 transition-all duration-200 inline-block">नियम व शर्तें</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 text-center text-xs py-5 opacity-60 bg-black/20">
        © {new Date().getFullYear()} अपनो राजस्थान. सर्वाधिकार सुरक्षित।
      </div>
    </footer>
  );
}