import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/news-ui";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

import { API_BASE_URL } from "@/lib/api";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "हमारे बारे में — अपनो राजस्थान" },
      { name: "description", content: "अपनो राजस्थान — हिंदी पत्रकारिता का भरोसेमंद नाम।" },
      { property: "og:title", content: "हमारे बारे में — अपनो राजस्थान" },
      { property: "og:description", content: "हमारी कहानी, मिशन और टीम।" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const [content, setContent] = useState("");
  const [team, setTeam] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAboutData() {
      setLoading(true);

      // 1. Pehle Page Content fetch karenge
      try {
        const pageRes = await fetch(`${API_BASE_URL}/api/pages/current`);
        if (pageRes.ok) {
          const pageData = await pageRes.json();
          if (pageData && pageData.aboutContent) {
            setContent(pageData.aboutContent);
          }
        }
      } catch (err) {
        console.error("Page content load hone me error:", err);
      }

      // 2. Phir Users data fetch karenge
      try {
        const userRes = await fetch(`${API_BASE_URL}/api/users/all`);
        if (userRes.ok) {
          const usersData = await userRes.json();
          
          let usersArray = [];
          if (Array.isArray(usersData)) {
            usersArray = usersData;
          } else if (usersData && Array.isArray(usersData.content)) {
            usersArray = usersData.content;
          } else if (usersData && Array.isArray(usersData.data)) {
            usersArray = usersData.data;
          }

          // 👉 Sirf Admin aur Editor ko filter kar rahe hain
          const onlyTeamMembers = usersArray.filter((user: any) => {           
              if (!user || !user.role) return false;
            const role = user.role.toLowerCase().trim();
            return role === "admin" || role === "editor";
          });
          
          setTeam(onlyTeamMembers);
        }
      } catch (err) {
        console.error("Users load hone me error:", err);
      } finally {
        setLoading(false); 
      }
    }

    fetchAboutData();
  }, []);

  return (
    <div className="bg-surface">
      <PageHero kicker="परिचय" title="हमारे बारे में" subtitle="राजस्थान की धड़कन, हिंदी पत्रकारिता का भरोसेमंद नाम।" />
      <div className="container mx-auto px-4 py-10 space-y-10 max-w-5xl">
        
        {/* MISSION SECTION */}
        <section className="bg-card border border-border rounded-lg p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl font-extrabold border-r-4 border-primary pr-3">हमारा मिशन</h2>
          
          {loading ? (
             <div className="flex justify-center p-6"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <div className="mt-4 text-base leading-relaxed whitespace-pre-wrap text-foreground/90">
              {content || "अपनो राजस्थान का उद्देश्य है — आम जन तक सटीक, निष्पक्ष और समय पर ख़बरें पहुँचाना। एडमिन पैनल से जानकारी अपडेट करें।"}
            </div>
          )}
        </section>

        {/* TEAM SECTION */}
        <section>
          <h2 className="text-2xl font-extrabold border-r-4 border-primary pr-3 mb-6">हमारी टीम</h2>
          
          {loading ? (
            <div className="flex justify-center p-6"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : team.length === 0 ? (
            <div className="text-center p-6 text-muted-foreground border rounded-lg bg-card">
              अभी टीम में कोई सदस्य नहीं है।
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {team.map((user) => {
                // 👉 MAGIC FIX YAHAN HAI: Ab backend se chahe profilePic aaye ya image, ye pakad lega!
                const userImage = user.profilePic || user.image || user.imageUrl || `https://ui-avatars.com/api/?name=${user.name}&background=random&color=fff`;

                return (
                  <div key={user.id} className="bg-card border border-border rounded-lg p-5 text-center shadow-sm hover:shadow-md transition-shadow">
                    <img 
                      src={userImage} 
                      alt={user.name} 
                      className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-primary/20" 
                    />
                    <div className="font-bold mt-4 text-lg capitalize">{user.name}</div>
                    <div className="text-xs text-primary uppercase font-bold tracking-wider mt-1">
                      {user.role}
                    </div>
                    {user.email && <p className="text-xs text-muted-foreground mt-2 truncate">{user.email}</p>}
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}