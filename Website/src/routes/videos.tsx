import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { CATEGORY_LABELS, CATEGORY_PATH } from "@/data/news";
import { PageHero } from "@/components/news-ui";
import { Play, X, Loader2, Facebook, Twitter, Linkedin, Link2 } from "lucide-react";
import { toast } from "sonner"; // Notification ke liye

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8085";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: "वीडियो — अपनो राजस्थान" },
      { name: "description", content: "ताज़ा हिंदी न्यूज़ वीडियो, हाइलाइट्स और विशेष रिपोर्ट।" },
      { property: "og:title", content: "वीडियो — अपनो राजस्थान" },
      { property: "og:description", content: "देखिए हर बड़ी ख़बर वीडियो में।" },
    ],
  }),
  component: VideosPage,
});

// YouTube URL se Video ID nikalne ka function (taki iframe theek se chale)
function getYouTubeId(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function VideosPage() {
  const [active, setActive] = useState<string | null>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/videos/all`)
      .then((res) => {
        if (!res.ok) throw new Error("Video data fetch fail");
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          setVideos([]);
          return;
        }

        const formattedVideos = data.map((v: any) => ({
          id: v.id.toString(),
          title: v.title,
          // Agar admin ne videoUrl daala hai, toh wahi use hoga, warna dummy
          videoUrl: v.videoUrl || "https://www.youtube.com/watch?v=dQw4w9WgXcQ", 
          thumbnail: v.thumb || `https://img.youtube.com/vi/${getYouTubeId(v.videoUrl) || 'dQw4w9WgXcQ'}/maxresdefault.jpg`,
          category: v.category ? v.category.trim().toLowerCase() : "rajasthan",
          duration: v.duration || "New",
        }));
        
        setVideos(formattedVideos.reverse());
      })
      .catch((err) => {
        console.error("Video load error:", err);
        setVideos([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const cur = videos.find((v) => v.id === active);
  
  // Related Videos (Jo video chal raha hai usko chhod kar)
  const relatedVideos = videos.filter((v) => v.id !== active).slice(0, 4);

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("लिंक कॉपी हो गया!");
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-surface">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-[60vh]">
      <PageHero kicker="वीडियो" title="ताज़ा वीडियो" subtitle="हर बड़ी ख़बर — वीडियो में।" />
      <div className="container mx-auto px-4 py-8">
        {videos.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <h2 className="text-2xl font-bold mb-2">कोई वीडियो नहीं मिला</h2>
            <p>अभी तक कोई वीडियो अपलोड नहीं किया गया है।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {videos.map((v) => (
              <button key={v.id} onClick={() => setActive(v.id)} className="text-left group block w-full">
                <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                  <img src={v.thumbnail} alt={v.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition flex items-center justify-center">
                    <div className="bg-primary/90 rounded-full p-4 group-hover:scale-110 transition-transform shadow-lg">
                      <Play className="text-white fill-white" size={24} />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded font-medium">{v.duration}</span>
                </div>
                <div className="mt-3">
                  <span className="text-xs text-primary font-bold uppercase tracking-wider">
                    {(CATEGORY_LABELS as any)[v.category] || "वीडियो"}
                  </span>
                  <h3 className="font-bold mt-1 text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">{v.title}</h3>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 🔥 NAYA BADAAL: ASALI YOUTUBE PLAYER, SHARE BUTTONS AUR RELATED VIDEOS 🔥 */}
      {cur && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setActive(null)}>
          <div className="relative w-full max-w-5xl bg-ink rounded-xl overflow-hidden shadow-2xl my-auto" onClick={(e) => e.stopPropagation()}>
            
            <button onClick={() => setActive(null)} className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full text-white hover:bg-primary transition-colors" aria-label="बंद करें">
              <X size={24} />
            </button>
            
            {/* 1. YouTube Video Player */}
            <div className="aspect-video bg-black relative">
              <iframe 
                src={`https://www.youtube.com/embed/${getYouTubeId(cur.videoUrl)}?autoplay=1&rel=0`} 
                title={cur.title}
                className="w-full h-full absolute inset-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="p-6 bg-card text-foreground">
              <h2 className="text-2xl font-bold leading-snug">{cur.title}</h2>
              
              {/* 2. Share Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-b border-border py-4">
                <span className="text-sm font-semibold text-muted-foreground mr-1">शेयर करें:</span>
                
                <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(cur.title)} - ${cur.videoUrl}`} target="_blank" rel="noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#25D366] text-white hover:opacity-80 transition-opacity shadow-sm" title="WhatsApp">
                  <span className="font-bold text-sm">W</span>
                </a>

                <a href={`https://www.facebook.com/sharer/sharer.php?u=${cur.videoUrl}`} target="_blank" rel="noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1877F2] text-white hover:opacity-80 transition-opacity shadow-sm" title="Facebook">
                  <Facebook size={16} />
                </a>
                
                <a href={`https://twitter.com/intent/tweet?url=${cur.videoUrl}&text=${encodeURIComponent(cur.title)}`} target="_blank" rel="noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-black text-white hover:opacity-80 transition-opacity shadow-sm" title="X (Twitter)">
                  <Twitter size={14} />
                </a>
                
                <button onClick={() => copyToClipboard(cur.videoUrl)} className="w-9 h-9 flex items-center justify-center rounded-full bg-muted text-foreground hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm ml-auto" title="लिंक कॉपी">
                  <Link2 size={16} />
                </button>
              </div>

              {/* 3. Related Videos */}
              {relatedVideos.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Play className="text-primary fill-primary" size={16} />
                    मिलते-जुलते वीडियो
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {relatedVideos.map((rv) => (
                      <button key={rv.id} onClick={() => setActive(rv.id)} className="text-left group">
                        <div className="relative aspect-video rounded-md overflow-hidden bg-muted">
                          <img src={rv.thumbnail} alt={rv.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition"></div>
                          <Play className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-80 group-hover:scale-125 transition-transform" size={24} />
                        </div>
                        <h4 className="font-semibold text-sm mt-2 line-clamp-2 group-hover:text-primary transition-colors">{rv.title}</h4>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}