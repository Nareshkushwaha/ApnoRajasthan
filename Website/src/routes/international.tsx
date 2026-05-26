import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/category-page";
import { articles } from "@/data/news";

export const Route = createFileRoute("/international")({
  head: () => ({
    meta: [
      { title: "विदेश समाचार — अपनो राजस्थान" },
      { name: "description", content: "दुनिया भर की ताज़ा अंतरराष्ट्रीय हिंदी ख़बरें।" },
      { property: "og:title", content: "विदेश — अपनो राजस्थान" },
      { property: "og:description", content: "दुनिया की हर बड़ी ख़बर हिंदी में।" },
      { property: "og:image", content: articles.find(a => a.category === "international")?.image },
    ],
  }),
  // 👉 बदलाव: layout="regions" को हटाकर "grid" कर दिया है
  // अब यह अपने आप छोटे बॉक्सेस का ग्रिड बना देगा और Ad के नीचे की जगह भी भर देगा
  component: () => (
    <CategoryPage 
      category="international" 
      layout="grid" 
      kicker="विदेश" 
      subtitle="ग्लोब के हर कोने से ताज़ा रिपोर्ट।" 
    />
  ),
});