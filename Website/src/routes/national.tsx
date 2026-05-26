import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/category-page";
import { articles } from "@/data/news";

export const Route = createFileRoute("/national")({
  head: () => ({
    meta: [
      { title: "राष्ट्रीय समाचार — अपनो राजस्थान" },
      { name: "description", content: "भारत भर की ताज़ा हिंदी ख़बरें।" },
      { property: "og:title", content: "राष्ट्रीय — अपनो राजस्थान" },
      { property: "og:description", content: "देश की हर बड़ी ख़बर पर सबसे पहले।" },
      { property: "og:image", content: articles.find(a => a.category === "national")?.image },
    ],
  }),
  component: () => (
    <CategoryPage category="national" layout="grid" kicker="राष्ट्रीय" subtitle="भारत के कोने-कोने से ताज़ा अपडेट।" />
  ),
});
