import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-8xl font-extrabold text-primary">404</h1>
        <h2 className="mt-4 text-2xl font-bold text-foreground">पेज नहीं मिला</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          आप जिस पेज की तलाश कर रहे हैं वह मौजूद नहीं है या हटा दिया गया है।
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
          >
            होम पर जाएँ
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-md border border-input px-4 py-2 text-sm font-semibold hover:bg-muted"
          >
            संपर्क करें
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "अपनो राजस्थान — हिंदी न्यूज़ | राजस्थान, देश, दुनिया" },
      { name: "description", content: "अपनो राजस्थान — राजस्थान, राष्ट्रीय, अंतरराष्ट्रीय, खेल, मनोरंजन, टेक्नोलॉजी और नौकरी की ताज़ा हिंदी ख़बरें।" },
      { name: "author", content: "Apno Rajasthan" },
      { property: "og:title", content: "अपनो राजस्थान — हिंदी न्यूज़" },
      { property: "og:description", content: "राजस्थान, देश और दुनिया की ताज़ा हिंदी ख़बरें।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Login/signup get a minimal chrome experience
  const minimal = pathname === "/login" || pathname === "/signup";

  if (minimal) {
    return (
      <div className="min-h-screen bg-surface">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
