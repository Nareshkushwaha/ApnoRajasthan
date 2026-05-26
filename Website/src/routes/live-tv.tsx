import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/news-ui";
import { Play, Tv, Loader2, Radio } from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8085";

export const Route = createFileRoute("/live-tv")({
  head: () => ({
    meta: [
      { title: "लाइव टीवी — अपनो राजस्थान" },
    ],
  }),
  component: LiveTvPage,
});

// 🚀 ULTIMATE YOUTUBE ID EXTRACTOR (Live, Shorts, Watch sabke liye)
function getYouTubeId(url: string) {
  if (!url) return null;
  try {
    if (url.includes('youtube.com/watch')) {
      return new URL(url).searchParams.get('v');
    }
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|live\/|shorts\/))([\w-]{11})/);
    if (match && match[1]) return match[1];

    const backupMatch = url.match(/(?:v=|v\/|vi=|vi\/|youtu\.be\/|embed\/|shorts\/|live\/)([\w-]{11})/);
    return backupMatch ? backupMatch[1] : null;
  } catch (e) {
    return null;
  }
}

function LiveTvPage() {
  const [liveData, setLiveData] = useState<any>(null);
  const [headlines, setHeadlines] = useState<any[]>([]);
  const [sideVideos, setSideVideos] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const settingsRes = await fetch(`${API_URL}/api/livetv/current`);
        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          setLiveData(settings);
        }

        const newsRes = await fetch(`${API_URL}/api/news/all`);
        if (newsRes.ok) {
          const news = await newsRes.json();
          setHeadlines(Array.isArray(news) ? news.slice(0, 5) : []);
        }

        const videoRes = await fetch(`${API_URL}/api/videos/all`);
        if (videoRes.ok) {
          const videos = await videoRes.json();
          if (Array.isArray(videos)) {
            const formattedVideos = videos.slice(0, 4).map((v: any) => {
              const rawUrl = v.thumb || v.thumbnail || v.imageUrl;
              const imgSrc = rawUrl 
                ? (rawUrl.startsWith('http') ? rawUrl : `${API_URL}/uploads/${rawUrl}`) 
                : "https://picsum.photos/400/225"; 
              return { ...v, thumbnail: imgSrc };
            });
            setSideVideos(formattedVideos);
          }
        }

        const scheduleRes = await fetch(`${API_URL}/api/livetv/schedule/all`);
        if (scheduleRes.ok) {
          const sched = await scheduleRes.json();
          setSchedule(Array.isArray(sched) ? sched : []);
        }
      } catch (error) {
        console.error("Error fetching live data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-ink">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  const youtubeId = getYouTubeId(liveData?.streamUrl);

  return (
    <div className="bg-ink text-primary-foreground min-h-[60vh]">
      <PageHero 
        kicker={
          <div className="flex items-center gap-2 text-primary font-bold">
            <Radio size={16} className="animate-pulse" /> ऑन एयर
          </div> as any
        } 
        title={liveData?.channelName || "अपनो राजस्थान लाइव"} 
      />

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: Live Stream Player */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl">
            {youtubeId ? (
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&rel=0`}
                title="Live Stream"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-white/5">
                <Tv size={64} className="mb-4 opacity-20" />
                <p className="text-red-500 font-bold text-lg mb-2">वीडियो लोड नहीं हो पाया!</p>
                <p className="text-xs">आपने जो लिंक डाला है: <span className="text-yellow-500">{liveData?.streamUrl || "कोई लिंक नहीं"}</span></p>
              </div>
            )}
          </div>

          {/* Dynamic Headlines */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-primary text-sm font-bold uppercase tracking-wider">अभी की हेडलाइंस</h3>
               <div className="h-px flex-1 bg-white/10 ml-4"></div>
            </div>
            <ul className="space-y-3">
              {headlines.length > 0 ? headlines.map((a) => (
                <li key={a.id} className="group">
                  <Link to="/article/$slug" params={{ slug: a.id.toString() }} className="flex items-center gap-3 group-hover:text-primary transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span className="text-sm md:text-base line-clamp-1">{a.title}</span>
                  </Link>
                </li>
              )) : (
                <li className="text-sm text-muted-foreground">कोई ताज़ा खबर नहीं है</li>
              )}
            </ul>
          </div>
        </div>

        {/* RIGHT: Schedule & Videos */}
        <aside className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <div className="bg-primary text-primary-foreground px-4 py-3 font-bold flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> 
              आज का शेड्यूल
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {schedule.length > 0 ? schedule.map((s: any, i: number) => (
                <div key={i} className="px-4 py-3 border-t border-white/5 flex items-center gap-4 hover:bg-white/5 transition-colors">
                  <span className="font-mono text-primary font-bold text-sm w-16">{s.time}</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{s.showName}</div>
                    <div className="text-[10px] opacity-50 uppercase line-clamp-1">{s.description || "न्यूज़ शो"}</div>
                  </div>
                </div>
              )) : (
                <p className="p-4 text-xs text-muted-foreground text-center">शेड्यूल उपलब्ध नहीं है</p>
              )}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10 font-bold flex items-center gap-2">
              <Play size={16} className="text-primary" /> और वीडियो
            </div>
            <div className="divide-y divide-white/5">
              {sideVideos.length > 0 ? sideVideos.map((v) => (
                <Link key={v.id} to="/videos" className="flex gap-3 p-3 hover:bg-white/10 transition-colors group">
                  <div className="relative shrink-0">
                    <img 
                      src={v.thumbnail} 
                      alt={v.title} 
                      className="w-24 h-16 object-cover rounded shadow-md"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://picsum.photos/400/225" }} 
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <Play size={16} className="text-white fill-white" />
                    </div>
                  </div>
                  <div className="text-xs font-medium line-clamp-2 leading-snug">{v.title}</div>
                </Link>
              )) : (
                <p className="p-4 text-xs text-muted-foreground text-center">कोई वीडियो नहीं मिला</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}