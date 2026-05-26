import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/category-page";
import { articles } from "@/data/news";

export const Route = createFileRoute("/sports")({
  head: () => ({
    meta: [
      { title: "खेल समाचार — अपनो राजस्थान" },
      { name: "description", content: "क्रिकेट, फुटबॉल, हॉकी सहित हर खेल की ताज़ा हिंदी ख़बरें।" },
      { property: "og:title", content: "खेल — अपनो राजस्थान" },
      { property: "og:description", content: "स्कोर, हाइलाइट्स और विश्लेषण।" },
      { property: "og:image", content: articles.find(a => a.category === "sports")?.image },
    ],
  }),
  component: () => (
    <CategoryPage category="sports" layout="scoreboard" kicker="खेल" subtitle="मैदान की हर हलचल हिंदी में।" />
  ),
});