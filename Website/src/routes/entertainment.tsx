import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/category-page";
import { articles } from "@/data/news";

export const Route = createFileRoute("/entertainment")({
  head: () => ({
    meta: [
      { title: "मनोरंजन समाचार — अपनो राजस्थान" },
      { name: "description", content: "बॉलीवुड, OTT, टीवी और साउथ सिनेमा की ताज़ा ख़बरें।" },
      { property: "og:title", content: "मनोरंजन — अपनो राजस्थान" },
      { property: "og:description", content: "स्टार्स, फ़िल्में, गॉसिप और रिव्यू।" },
      { property: "og:image", content: articles.find(a => a.category === "entertainment")?.image },
    ],
  }),
  component: () => (
    <CategoryPage category="entertainment" layout="posters" kicker="मनोरंजन" subtitle="सिनेमा से सेलिब्रिटी तक — सब कुछ यहाँ।" />
  ),
});
