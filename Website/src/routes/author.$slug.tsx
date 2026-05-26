import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getAuthor, getArticlesByAuthor } from "@/data/news";
import { ArticleListItem, AdSlot } from "@/components/news-ui";
import { Twitter, Mail } from "lucide-react";

export const Route = createFileRoute("/author/$slug")({
  loader: ({ params }) => {
    const author = getAuthor(params.slug);
    if (!author) throw notFound();
    return { author, articles: getArticlesByAuthor(params.slug) };
  },
  head: ({ loaderData }) => {
    const a = loaderData?.author;
    return {
      meta: [
        { title: `${a?.name ?? "लेखक"} — अपनो राजस्थान` },
        { name: "description", content: a?.bio ?? "लेखक प्रोफ़ाइल" },
        { property: "og:title", content: `${a?.name} — अपनो राजस्थान` },
        { property: "og:description", content: a?.bio ?? "" },
        { property: "og:image", content: a?.avatar },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">लेखक नहीं मिले</h1>
      <Link to="/" className="text-primary mt-4 inline-block">होम पर जाएँ</Link>
    </div>
  ),
  component: AuthorPage,
});

function AuthorPage() {
  const { author, articles } = Route.useLoaderData();
  const totalViews = articles.reduce((s, a) => s + a.views, 0);

  return (
    <div className="bg-surface min-h-[60vh]">
      <div className="bg-ink text-primary-foreground">
        <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          <img src={author.avatar} alt={author.name} className="w-32 h-32 rounded-full ring-4 ring-primary" />
          <div className="text-center md:text-right flex-1">
            <div className="text-primary text-sm font-semibold">{author.role}</div>
            <h1 className="text-3xl md:text-4xl font-extrabold mt-1">{author.name}</h1>
            <p className="opacity-90 mt-2 max-w-2xl">{author.bio}</p>
            <div className="flex gap-4 mt-4 justify-center md:justify-start text-sm">
              <span><strong className="text-primary">{articles.length}</strong> लेख</span>
              <span><strong className="text-primary">{totalViews.toLocaleString("hi-IN")}</strong> कुल व्यूज़</span>
              {author.twitter && (
                <a href="#" className="hover:text-primary flex items-center gap-1"><Twitter size={14} /> {author.twitter}</a>
              )}
              <a href="#" className="hover:text-primary flex items-center gap-1"><Mail size={14} /> ईमेल</a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4 border-b-2 border-primary pb-2">{author.name} के लेख</h2>
          <div className="bg-card border border-border rounded-lg">
            {articles.map((a) => <ArticleListItem key={a.slug} a={a} />)}
            {articles.length === 0 && <p className="p-6 text-muted-foreground text-center">अभी कोई लेख नहीं है।</p>}
          </div>
        </div>
        <aside className="space-y-6">
          <AdSlot height="h-64" />
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-bold mb-2">लेखक से जुड़ें</h3>
            <p className="text-sm text-muted-foreground">अपडेट के लिए सोशल मीडिया पर फॉलो करें।</p>
            <div className="flex gap-2 mt-3">
              <a href="#" className="bg-primary text-primary-foreground px-3 py-1.5 rounded text-sm hover:opacity-90">फॉलो</a>
              <Link to="/contact" className="border border-input px-3 py-1.5 rounded text-sm hover:bg-muted">संपर्क</Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
