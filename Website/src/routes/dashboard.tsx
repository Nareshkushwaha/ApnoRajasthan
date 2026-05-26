import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { getLatest, getTrending } from "@/data/news";
import { ArticleListItem } from "@/components/news-ui";
import { User, Bookmark, History, Settings, LogOut, Bell } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "मेरा डैशबोर्ड — अपनो राजस्थान" },
      { name: "description", content: "सहेजे गए लेख, इतिहास और प्रोफ़ाइल प्रबंधन।" },
    ],
  }),
  component: DashboardPage,
});

const TABS = [
  { id: "saved", label: "सहेजे गए लेख", Icon: Bookmark },
  { id: "history", label: "रीडिंग हिस्ट्री", Icon: History },
  { id: "profile", label: "प्रोफ़ाइल", Icon: User },
  { id: "settings", label: "सेटिंग्स", Icon: Settings },
] as const;

function DashboardPage() {
  const [tab, setTab] = useState<typeof TABS[number]["id"]>("saved");
  const saved = getTrending(5);
  const history = getLatest(7);

  return (
    <div className="bg-surface min-h-[60vh]">
      <div className="bg-ink text-primary-foreground">
        <div className="container mx-auto px-4 py-8 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-2xl font-extrabold">
            अ
          </div>
          <div>
            <div className="text-xs opacity-75">स्वागत है</div>
            <h1 className="text-2xl font-extrabold">अतिथि उपयोगकर्ता</h1>
            <p className="text-sm opacity-80">guest@apnorajasthan.in</p>
          </div>
          <Link to="/" className="ml-auto bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-semibold flex items-center gap-2 hover:opacity-90">
            <LogOut size={14} /> लॉगआउट
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="bg-card border border-border rounded-lg overflow-hidden h-fit">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-right border-b border-border last:border-b-0 transition ${tab === id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              <Icon size={16} />
              <span className="text-sm font-semibold">{label}</span>
            </button>
          ))}
        </aside>

        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { l: "सहेजे लेख", v: saved.length },
              { l: "पढ़े गए", v: history.length },
              { l: "टिप्पणियाँ", v: 12 },
              { l: "फॉलोइंग", v: 6 },
            ].map((s) => (
              <div key={s.l} className="bg-card border border-border rounded-lg p-4 text-center">
                <div className="text-2xl font-extrabold text-primary">{s.v}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>

          {tab === "saved" && (
            <section className="bg-card border border-border rounded-lg">
              <h2 className="px-4 py-3 border-b border-border font-bold flex items-center gap-2"><Bookmark size={16} /> सहेजे गए लेख</h2>
              {saved.map((a) => <ArticleListItem key={a.slug} a={a} />)}
            </section>
          )}

          {tab === "history" && (
            <section className="bg-card border border-border rounded-lg">
              <h2 className="px-4 py-3 border-b border-border font-bold flex items-center gap-2"><History size={16} /> रीडिंग हिस्ट्री</h2>
              {history.map((a) => <ArticleListItem key={a.slug} a={a} />)}
            </section>
          )}

          {tab === "profile" && (
            <section className="bg-card border border-border rounded-lg p-6">
              <h2 className="font-bold mb-4 flex items-center gap-2"><User size={16} /> प्रोफ़ाइल</h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="text-sm">पूरा नाम
                  <input defaultValue="अतिथि उपयोगकर्ता" className="mt-1 w-full px-3 py-2 border border-input rounded bg-background" />
                </label>
                <label className="text-sm">ईमेल
                  <input defaultValue="guest@apnorajasthan.in" className="mt-1 w-full px-3 py-2 border border-input rounded bg-background" />
                </label>
                <label className="text-sm">मोबाइल
                  <input placeholder="+91" className="mt-1 w-full px-3 py-2 border border-input rounded bg-background" />
                </label>
                <label className="text-sm">शहर
                  <input placeholder="जयपुर" className="mt-1 w-full px-3 py-2 border border-input rounded bg-background" />
                </label>
                <label className="text-sm md:col-span-2">परिचय
                  <textarea rows={3} placeholder="अपने बारे में…" className="mt-1 w-full px-3 py-2 border border-input rounded bg-background resize-none" />
                </label>
                <button type="button" className="md:col-span-2 bg-primary text-primary-foreground py-2 rounded font-semibold hover:opacity-90 w-fit px-6">सहेजें</button>
              </form>
            </section>
          )}

          {tab === "settings" && (
            <section className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="font-bold flex items-center gap-2"><Settings size={16} /> सेटिंग्स</h2>
              {[
                { l: "ईमेल अलर्ट", d: "ब्रेकिंग न्यूज़ ईमेल पर पाएँ" },
                { l: "पुश नोटिफ़िकेशन", d: "ब्राउज़र पर तत्काल अलर्ट" },
                { l: "व्हाट्सऐप अपडेट", d: "रोज़ की हेडलाइंस व्हाट्सऐप पर" },
                { l: "डार्क मोड", d: "रात के लिए आरामदायक थीम" },
              ].map((s) => (
                <label key={s.l} className="flex items-center justify-between border-b border-border pb-3">
                  <span>
                    <div className="font-semibold flex items-center gap-2"><Bell size={14} /> {s.l}</div>
                    <div className="text-xs text-muted-foreground">{s.d}</div>
                  </span>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </label>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
