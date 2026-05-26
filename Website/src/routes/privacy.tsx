import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/news-ui";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8085";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "गोपनीयता नीति — अपनो राजस्थान" },
      { name: "description", content: "अपनो राजस्थान की गोपनीयता नीति।" },
      { property: "og:title", content: "गोपनीयता नीति — अपनो राजस्थान" },
      { property: "og:description", content: "हम आपकी जानकारी कैसे एकत्र, उपयोग और सुरक्षित रखते हैं।" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  // 👉 Admin panel ka data database se la rahe hain
  useEffect(() => {
    fetch(`${API_URL}/api/pages/current`)
      .then(res => res.json())
      .then(data => {
        if (data && data.privacyContent) setContent(data.privacyContent);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load page content", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-surface">
      <PageHero kicker="नीति" title="गोपनीयता नीति" subtitle="अंतिम अद्यतन: हाल ही में अपडेट किया गया" />
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <article className="bg-card border border-border rounded-lg p-6 md:p-8 shadow-sm">
          {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <div className="whitespace-pre-wrap text-lg leading-relaxed text-foreground/90">
              {/* 👉 Yahan dynamic text dikhega */}
              {content || "अभी कोई जानकारी नहीं डाली गई है। एडमिन पैनल से जानकारी अपडेट करें।"}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}