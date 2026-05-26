import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/category-page";
import { articles } from "@/data/news";

export const Route = createFileRoute("/jobs")({
  head: () => ({
    meta: [
      { title: "सरकारी नौकरी — अपनो राजस्थान" },
      { name: "description", content: "SSC, रेलवे, बैंक, RPSC, UPSC और राजस्थान की ताज़ा सरकारी भर्तियाँ।" },
      { property: "og:title", content: "नौकरी — अपनो राजस्थान" },
      { property: "og:description", content: "हर नई भर्ती की ताज़ा ख़बरें।" },
      { property: "og:image", content: articles.find(a => a.category === "jobs")?.image },
    ],
  }),
  component: () => (
    // 👉 YAHAN BADLAV KIYA HAI: layout="table" hata kar layout="grid" kar diya
    <CategoryPage 
      category="jobs" 
      layout="grid" 
      kicker="नौकरी" 
      subtitle="सरकारी और प्राइवेट भर्तियों की ताज़ा ख़बरें।" 
    />
  ),
});