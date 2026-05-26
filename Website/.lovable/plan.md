# APNO RAJASTHAN — Hindi News Website

A complete, production-ready Hindi news portal with all 23 pages built out, working navigation, dummy articles, and a modern Indian-news-channel look (red / white / black).

## Brand & Design System

- **Name:** APNO RAJASTHAN (अपनो राजस्थान)
- **Theme:** Red primary (#D90429), white background, black text, with a dark "LIVE" accent
- **Typography:** Devanagari-friendly font (Noto Sans Devanagari) for Hindi, Inter for English/numbers
- **Layout language:** Card grids, list+image rows, sidebar layouts, hero sliders — each page uses a *different* composition so it doesn't feel templated
- **UI niceties:** Hover lift on cards, scrolling breaking-news ticker, sticky header, mobile hamburger menu, lightbox for gallery, mock video player UI

## Site Structure (23 routes — all real pages, no dead links)

```text
/                       Home
/politics               Politics
/rajasthan              Rajasthan News
/national               National News
/international          International News
/sports                 Sports
/entertainment          Entertainment
/technology             Technology
/jobs                   Jobs
/videos                 Videos (grid)
/gallery                Photo Gallery (lightbox)
/live-tv                Live TV (player UI)
/article/$slug          Article Detail
/author/$slug           Author Profile
/search                 Search Results (?q=...)
/login                  Login
/signup                 Signup
/dashboard              User Dashboard (saved articles)
/contact                Contact Us
/about                  About Us
/privacy                Privacy Policy
/terms                  Terms & Conditions
*                       404 page (root notFoundComponent)
```

## Shared Layout

- **Top bar:** date, weather chip, social icons, Login / Signup links
- **Header:** APNO RAJASTHAN logo (red), search box, LIVE TV button
- **Main nav:** होम · राजनीति · राजस्थान · राष्ट्रीय · विदेश · खेल · मनोरंजन · टेक्नोलॉजी · नौकरी · वीडियो · फोटो · लाइव टीवी
- **Breaking-news ticker:** red strip with marquee of latest headlines (clickable → article)
- **Footer:** quick links, categories, About / Contact / Privacy / Terms, social, copyright
- All header/footer/ticker links route to real pages.

## Page-by-Page Content

### Home
Hero slider (3 top stories) · category strip · two-column section (latest news list + trending sidebar) · Rajasthan highlights grid · Sports + Entertainment dual block · Most-Read sidebar widget · Latest Videos row · Photo gallery teaser · ad placeholders (labelled "विज्ञापन"). 15+ articles surfaced.

### Category pages (Politics, Rajasthan, National, International, Sports, Entertainment, Technology, Jobs)
Each gets a distinct layout variation:
- **Politics:** big lead story + 2-up secondary + list
- **Rajasthan:** district chips filter + magazine-style grid
- **National:** classic 3-column card grid
- **International:** world-map header + region tabs + list
- **Sports:** scoreboard strip + cards
- **Entertainment:** poster-style tall cards
- **Technology:** review-card layout with "नया गैजेट" badges
- **Jobs:** table-style listing (post, dept, last date, apply link → article detail)

Each category renders 12–15 dummy articles and a sidebar (trending in category + ad).

### Videos
Responsive video grid with thumbnail, duration badge, title, views; clicking opens a modal player (mock).

### Gallery
Masonry image grid with lightbox (click → fullscreen with prev/next).

### Live TV
Large 16:9 mock player (poster + play overlay), "LIVE" pulsing badge, current-show info, schedule list, related clips below.

### Article Detail (`/article/$slug`)
Breadcrumb · category badge · headline · author chip (links to `/author/$slug`) · publish date · hero image · share row (FB / X / WhatsApp / copy-link — UI only) · article body (multi-paragraph Hindi lorem) · tags · related news (3 cards) · comment section UI (list of mock comments + comment form).

### Author Profile
Avatar, bio, stats (articles / views), list of articles by author, social links.

### Search Results (`/search?q=...`)
Reads `q` from search params, filters the dummy article dataset by title/category/tag, shows result count and result list with category filter chips.

### Login / Signup
Centered card forms, email/password (+ name on signup), "remember me", social buttons (UI only), links between the two pages. Submitting routes to `/dashboard` (no real auth — front-end only as requested).

### Dashboard
Sidebar (Profile, Saved Articles, Reading History, Settings, Logout) + main panel showing saved-articles grid, reading history list, and profile form.

### Contact Us
Contact form (name, email, subject, message), office address card, phone/email, embedded map placeholder.

### About Us
Mission section, history timeline, team grid, newsroom stats.

### Privacy Policy & Terms
Long-form legal text in Hindi with section headings and table of contents anchors.

### 404
Friendly Hindi message + "होम पर जाएँ" button (set as root `notFoundComponent`).

## Data

A single `src/data/news.ts` module exports:
- `articles[]` — 60+ dummy articles spread across all categories, each with `slug`, `title`, `excerpt`, `body`, `image`, `category`, `authorSlug`, `publishedAt`, `tags`, `views`
- `authors[]` — 6 authors with bio + avatar
- `videos[]`, `galleryImages[]`, `liveSchedule[]`, `breakingTicker[]`
- Helper selectors: `getByCategory`, `getBySlug`, `getRelated`, `searchArticles`

All page lists, sidebars, related-news, and search read from this module so links resolve to real article pages.

## Technical Notes

- **Stack:** TanStack Start (existing), React 19, Tailwind v4, shadcn/ui components already in repo
- **Routing:** flat file routes under `src/routes/` using TanStack file conventions; dynamic routes `article.$slug.tsx` and `author.$slug.tsx`
- **Search:** uses `validateSearch` with zod adapter on `/search` for `?q=`
- **Header/Footer:** rendered in `__root.tsx` (excluded on `/login`, `/signup`, `/404` via simple path check) so every page shares them
- **Each route file** sets its own `head()` with unique title + description + og tags
- **Images:** royalty-free Unsplash URLs (news, sports, tech, Rajasthan landmarks, etc.)
- **No backend:** auth/comments/forms are UI-only as specified. (Easy to wire to Lovable Cloud later if you want real login/saved articles — say the word and I'll add it.)
- **Accessibility:** semantic landmarks, alt text, focus rings preserved from shadcn

## Acceptance Checklist (verified before finishing)

- [ ] All 23 routes exist and render unique, fully populated pages
- [ ] Every header, footer, sidebar, card, and ticker link navigates to a real page
- [ ] Every article card → working `/article/$slug` page
- [ ] Every author chip → working `/author/$slug` page
- [ ] Search bar submits to `/search?q=...` and shows filtered results
- [ ] 404 shown for unknown URLs with link back home
- [ ] No placeholder text, no Lovable blank-page placeholder remains
