# Odiseus Client —  Reference Document

## 1. Project Snapshot

| Field             | Value                                                    |
| ----------------- | -------------------------------------------------------- |
| Framework         | Next.js 14 (App Router)                                  |
| Language          | JavaScript only — NO TypeScript                          |
| Styling           | Plain CSS files — NO CSS Modules, NO Tailwind            |
| Fonts             | Loaded via `<link>` in `app/layout.js` — NOT `next/font` |
| State / client JS | Minimal — only in `"use client"` components              |
| Deploy target     | Vercel (auto-detected, NO `vercel.json`)                 |
| Package manager   | npm                                                      |

---

## 2. File Map (every source file)

```
app/
  layout.js                  Root layout — loads fonts, sets <html lang="en">
  home.css                   Home-route styles + :root design tokens for home/services
  page.js                    Route: / (home) — server component
  services/
    page.js                  Route: /services — server component
    services.css             Services-only styles (all classes prefixed svc-)
  talent/
    page.js                  Route: /talent — server component (imports styles/*.css)
    TalentClient.jsx          "use client" — all talent JS + full page JSX
  components/
    SoftwareInfographics.jsx  "use client" — three infographic sections for home page

styles/                      Talent-route CSS only (DO NOT import on other routes)
  hero.css                   Talent global reset, nav, hero, animations
  sections.css               Talent content sections (market, specialisms, roles…)
  footer.css                 Talent footer
  responsive.css             Talent responsive — MUST load last

next.config.mjs              optimizeFonts: false + URL redirects
package.json                 next@14.2.35, react@18, react-dom@18
```

---

## 3. CSS Isolation Strategy — READ FIRST

This is the single most important rule in the codebase.

The home (`/`) and talent (`/talent`) routes share class names with
**different values**. For example, both have `.hero`, `.eyebrow`,
`.site-nav`, `.footer-top`, etc., but the values differ because each
route imports a completely different CSS file:

| Route       | CSS imported                                                                              |
| ----------- | ----------------------------------------------------------------------------------------- |
| `/`         | `app/home.css` only                                                                       |
| `/talent`   | `styles/hero.css` → `styles/sections.css` → `styles/footer.css` → `styles/responsive.css` |
| `/services` | `app/home.css` + `app/services/services.css`                                              |

**Rules that must never be broken:**

1. **Never import `styles/*.css` on any route except `/talent`.**
2. **Never import `app/home.css` on the talent route.**
3. Every new route MUST import `../home.css` (inherits nav + footer + tokens)
   and its own co-located CSS file for page-specific styles.
4. Every class in a new page's CSS must use a unique prefix (e.g., `svc-`
   for services). Do NOT reuse classes like `.hero`, `.eyebrow`, `.cta`
   in a new CSS file because `home.css` is imported on the same page and
   the names would collide.
5. Classes that ARE safe to reuse verbatim (they come from `home.css` and
   are wanted on services/future routes): `.site-nav`, `.nav-logo`,
   `.nav-logo-dot`, `.nav-center`, `.nav-sep`, `.nav-right`, `.nav-cta`,
   `.footer-top`, `.footer-bottom`, `.f-logo`, `.f-tagline`,
   `.f-office-label`, `.f-address`, `.f-col`, `.f-copy`, `.f-socials`,
   `.mono`, `.serif`, `.reveal`.

---

## 4. Design Tokens

### Home / Services route — defined in `app/home.css :root`

```css
--ink: #0a0a0f /* primary text */ --ink-soft: #1a1a22 /* secondary text */
  --paper: #fafaf7 /* page background — NOT pure white */ --paper-warm: #f2efe8
  /* warm background for bands/CTAs */ --rule: #e5e2da
  /* borders and dividers */ --blue: #1a4eff /* electric-blue accent */
  --blue-soft: #e8edff /* blue tint for hover backgrounds */ --muted: #6b6b6b
  /* muted/caption text */ --canada: #dc2626 /* red accent (rarely used) */;
```

### Talent route — defined in `styles/hero.css :root`

```css
--white: #ffffff --off: #f7f7f5 --paper: #f2f1ee
  /* ← DIFFERENT value from home --paper */ --ink: #0a0a0f --ink-2: #1c1c26
  --mid: #6b6b7a --light: #aeaebc --border: #e4e4e8 --border-2: #d0d0d8
  --blue: #1a4eff /* same blue */ --blue-dim: rgba(26, 78, 255, 0.08)
  --blue-mid: rgba(26, 78, 255, 0.15) --green: #00b86b --orange: #ff6b1a
  --nav-h: 82px /* fixed nav height */ --page-x: 64px
  /* horizontal page padding */ --radius: 12px;
```

> Notice `--paper` has different hex values on each route — this is why
> the CSS isolation matters.

---

## 5. Typography System

Fonts are loaded globally in `app/layout.js` via Google Fonts `<link>`.
**Do not re-import fonts in any page or CSS file.**

| Font             | Variable                                 | Use                                        |
| ---------------- | ---------------------------------------- | ------------------------------------------ |
| Instrument Serif | `font-family: "Instrument Serif", serif` | Headings, display text, italic emphasis    |
| Geist            | `font-family: "Geist", sans-serif`       | Body text, UI labels                       |
| Geist Mono       | `font-family: "Geist Mono", monospace`   | Eyebrows, tags, code-style labels, numbers |

**Utility classes (from `home.css`):**

- `.mono` — `Geist Mono, 0.72rem, letter-spacing: 0.08em, uppercase`
- `.serif` — `Instrument Serif, weight 400`

---

## 6. Route Details

### 6.1 `/` — Home (`app/page.js`)

**Type:** Server component  
**CSS:** `app/home.css` only

**Sections in order:**

1. `<nav className="site-nav">` — fixed top nav
2. `<section className="hero">` — two-column grid: text left, SVG map right
3. `<div className="strip">` — scrolling marquee band (dark bg)
4. `<section className="specs">` — four practice area cards in a grid
5. `<section className="network">` — stat counters (count-up via SoftwareInfographics)
6. `<SoftwareInfographics />` — client component (3 infographic sections, see §6.4)
7. `<section className="cta">` — centred CTA
8. `<footer>` — dark footer

**Nav links:** Software (active) | Talent | Services

---

### 6.2 `/talent` — Talent (`app/talent/page.js` + `TalentClient.jsx`)

**Type:** `page.js` is a server component that just renders `<TalentClient />`.  
**CSS:** `styles/hero.css` → `sections.css` → `footer.css` → `responsive.css`  
**JS:** Everything is in `TalentClient.jsx` (`"use client"`)

**Client-side features in TalentClient.jsx:**

- Hero word scramble cycling through: Cloud, Data, AI Agents, AI Assistants, MCP Servers
- Mobile nav open/close (hamburger toggle, Escape key, outside-click close)
- Role filter buttons (All / DevOps / Cloud / AI) — toggles `.is-hidden` on `.role-row`
- Custom cursor (dot + ring) on fine-pointer devices only
- Scroll reveal via IntersectionObserver (adds `.in` class to `.reveal` elements)

**Sections in order:**

1. Custom cursor overlay (`#cDot`, `#cRing`)
2. `<nav className="site-nav">` — fixed nav with hamburger for mobile
3. `<section className="hero">` — full-viewport hero with animated h1 word cycle
4. `<div className="ticker">` — scrolling role ticker
5. `<section className="market">` — market intelligence (3 demand tiers × 3 cards)
6. `<section className="specialisms">` — 3 specialism cards
7. `<section className="roles">` — filterable open roles list
8. `<section className="why">` — why Odiseus
9. `<section className="process">` — 4-step hiring process
10. `<section className="testimonial">` — quote + metrics
11. `<section className="cta-section">` — closing CTA
12. `<footer>` — dark footer

**Nav links:** Software | Talent (active) | Services

---

### 6.3 `/services` — Services (`app/services/page.js`)

**Type:** Server component (no client JS — CSS-only hover)  
**CSS:** `../home.css` + `./services.css`

**Sections in order:**

1. `<nav className="site-nav">` — Software | Talent | Services (active)
2. `<section className="svc-hero">` — label, h1, sub-line
3. `<div className="svc-catalogue">` — 8 `<section className="svc-category">` blocks
4. `<section className="svc-cta">` — "Don't see what you need?" CTA
5. `<footer>` — verbatim from home

**Service data:** Defined as a `CATEGORIES` array at the top of `page.js`.
Each category has `{ num, title, services[] }`. Rendered with `.map()` —
no additional data file.

**CSS prefix:** Every new class uses `svc-`. Classes used:  
`svc-hero`, `svc-hero-label`, `svc-hero-sub`, `svc-catalogue`,
`svc-category`, `svc-cat-header`, `svc-cat-num`, `svc-cat-title`,
`svc-cat-rule`, `svc-grid`, `svc-service`, `svc-cta`, `svc-cta-inner`,
`svc-cta-sub`, `svc-cta-btns`, `svc-btn-primary`, `svc-btn-secondary`

---

### 6.4 `SoftwareInfographics` (`app/components/SoftwareInfographics.jsx`)

**Type:** `"use client"` — imported in `app/page.js` (home route)  
**CSS:** Inherits `app/home.css` (imported by the parent page)

**Three sections it renders:**

| Section            | Class          | Description                                                      |
| ------------------ | -------------- | ---------------------------------------------------------------- |
| Portfolio          | `ig-portfolio` | "From data center to cloud-native" flow diagram                  |
| DevOps Staircase   | `ig-devops`    | Discovery → Transformation → CI → CD → DevSecOps → Ops           |
| Migration Pipeline | `ig-migration` | 3-phase pipeline: Assessment → Readiness & Planning → Migrations |

**Client hooks:**

- `useRevealObserver()` — IntersectionObserver that adds `.in-view` to `[data-reveal]` elements
- `useCountUp()` — animates `.network .stat` numbers when they scroll into view
- `CountUpBridge` component — patches `data-countup` attributes onto server-rendered DOM nodes

**CSS classes used (all ig- prefixed):**  
`ig-portfolio`, `ig-devops`, `ig-migration`, `ig-inner`, `ig-section-head`,
`ig-eyebrow`, `ig-h2`, `ig-sub`, `ig-flow-band`, `ig-flow-node`,
`ig-flow-origin`, `ig-flow-dest`, `ig-flow-label`, `ig-flow-tiles`,
`ig-tile`, `ig-connector`, `ig-connector-svg`, `ig-line-draw`,
`ig-connector-label`, `ig-cap-grid`, `ig-cap-cell`, `ig-pills`, `ig-pill`,
`ig-stair-layout`, `ig-stair-col`, `ig-stair-left`, `ig-stair-right`,
`ig-stair-center`, `ig-col-label`, `ig-col-list`, `ig-col-item`,
`ig-stair-arrow`, `ig-stair-path`, `ig-stairs`, `ig-step`, `ig-step-num`,
`ig-step-title`, `ig-pipeline`, `ig-phase-wrap`, `ig-phase`, `ig-phase-head`,
`ig-phase-num`, `ig-phase-title`, `ig-chips`, `ig-chip`,
`ig-chevron-wrap`, `ig-chevron-svg`, `ig-chevron-path`

> **Note:** These `ig-` classes are styled inline within `home.css` or
> within `app/home.css`. If you add a new section to SoftwareInfographics,
> prefix its classes with `ig-` and add styles to `app/home.css`.

---

## 7. Navigation — How to Update

The nav appears in three files. **Any nav change must be made in all three:**

| File                          | Nav element                                   |
| ----------------------------- | --------------------------------------------- |
| `app/page.js`                 | `<nav className="site-nav">` (lines ~11–40)   |
| `app/services/page.js`        | `<nav className="site-nav">` (same structure) |
| `app/talent/TalentClient.jsx` | `<nav className="site-nav">` (lines ~244–273) |

**Current nav items:**

```jsx
<ul className="nav-center" role="list">
  <li>
    <a href="/">Software</a>
  </li>
  <li className="nav-sep" aria-hidden="true">
    |
  </li>
  <li>
    <a href="/talent">Talent</a>
  </li>
  <li className="nav-sep" aria-hidden="true">
    |
  </li>
  <li>
    <a href="/services">Services</a>
  </li>
</ul>
```

Add `className="active"` to whichever link matches the current route.
The talent nav also has `id="navMenu"` on the `<ul>` for its mobile toggle JS.

---

## 8. Footer — How to Update

The footer appears in three files:

- `app/page.js` (verbatim source of truth)
- `app/services/page.js` (copied verbatim from home)
- `app/talent/TalentClient.jsx` (slightly different — says "Odiseus Talent" in logo and different column content)

The home/services footer structure:

```
<footer>
  <div className="footer-top">   ← 4-column grid
    col 1: logo + tagline + two office addresses
    col 2: PRACTICE AREAS links
    col 3: COMPANY links
    col 4: CONNECT links
  </div>
  <div className="footer-bottom"> ← copyright + socials
  </div>
</footer>
```

All footer styles live in `app/home.css` for home/services, and in
`styles/footer.css` for talent.

---

## 9. Routing & Redirects

Routes are auto-detected by Next.js App Router from the file tree.

**Current routes:**

| URL         | File                   |
| ----------- | ---------------------- |
| `/`         | `app/page.js`          |
| `/talent`   | `app/talent/page.js`   |
| `/services` | `app/services/page.js` |

**Redirects (in `next.config.mjs`):**

```js
{ source: "/index.html",    destination: "/",        permanent: true }
{ source: "/talent.html",   destination: "/talent",  permanent: true }
{ source: "/services.html", destination: "/services", permanent: true }
```

**To add a new route:** Create `app/<name>/page.js`. Add a matching
`{ source: "/<name>.html", ... }` redirect to `next.config.mjs`.
Do NOT create `vercel.json` — Vercel auto-detects Next.js.

---

## 10. Adding a New Page — Checklist

1. Create `app/<name>/page.js` (server component, no `"use client"`
   unless you genuinely need browser APIs)
2. Import `"../home.css"` at the top (inherits nav, footer, tokens)
3. Create `app/<name>/<name>.css` with ALL new classes prefixed `<prefix>-`
4. Import `"./<name>.css"` after home.css
5. Export `metadata` with `title` and `description`
6. Copy the exact `<nav className="site-nav">` block from `app/page.js`
   — mark the new page's link `className="active"`, remove active from others
7. Copy the exact `<footer>` block from `app/page.js` verbatim
8. Add the Services nav link to `app/talent/TalentClient.jsx` if not already present
9. Add a `/<name>.html` redirect to `next.config.mjs`
10. Do NOT import anything from `styles/` — that folder is talent-only

---

## 11. Server vs Client Component Rules

| Situation                            | Pattern                                        |
| ------------------------------------ | ---------------------------------------------- |
| Static content, no browser APIs      | Server component (default) — no `"use client"` |
| IntersectionObserver, scroll, window | `"use client"` component                       |
| Animations that need JS              | `"use client"` component                       |
| CSS-only hover/transition            | Server component — no JS needed                |
| Form handling                        | `"use client"` component                       |

The talent page splits into `page.js` (server, imports CSS) +
`TalentClient.jsx` (client, all JSX + JS). Follow this pattern for any
route that needs heavy client-side JS.

---

## 12. Animations Reference

### Home/Services route (CSS keyframes in `app/home.css`)

| Keyframe    | Class                                 | Effect                              |
| ----------- | ------------------------------------- | ----------------------------------- |
| `reveal`    | `.reveal`, `.reveal-1` to `.reveal-4` | Fade + slide up on load (staggered) |
| `pulse`     | `.eyebrow .dot`                       | Blue dot pulse loop                 |
| `scroll`    | `.strip-inner`                        | Marquee left scroll                 |
| `nodePulse` | `.node-pulse`                         | SVG map node pulse rings            |
| `drawLine`  | `.line-draw`                          | SVG line draw-on animation          |

### Talent route (CSS in `styles/hero.css`)

| Keyframe | Class                                                              | Effect                                            |
| -------- | ------------------------------------------------------------------ | ------------------------------------------------- |
| `rise`   | `.hero-pill`, `.hero-h1`, `.hero-sub`, `.hero-ctas`, `.hero-stats` | Fade + slide up (staggered with animation-delay)  |
| —        | `.reveal` + JS `.in` class                                         | Scroll-triggered fade-in via IntersectionObserver |

### SoftwareInfographics (home route)

Uses `data-reveal` attribute + JS IntersectionObserver → adds `.in-view` class.
Also uses inline `style={{ transitionDelay: ... }}` for staggered children.

---

## 13. JSX Patterns & Conventions

- **No TypeScript** — `.js` and `.jsx` extensions only
- **Ampersands in JSX text:** Use `&amp;` (e.g., `DevOps &amp; Platform`)
- **Apostrophes in JSX text:** Use `&apos;` or `{" "}` spacing
- **Lists from data arrays:** Define data as a `const` array at the top of
  the file, render with `.map()` — no separate data files
- **SVG icons:** Inline SVG directly in JSX, no icon library
- **Images:** No `<Image />` from next/image — plain `<img>` or inline SVG
- **Links:** Plain `<a href="">` — no `<Link>` from next/link (project
  was converted from a static site and keeps plain anchor tags)
- **No `.module.css`** — all CSS is global, isolation is by import scope

---

## 14. Key Class Name Collisions to Watch

These class names exist in BOTH `app/home.css` AND `styles/*.css` with
different values. Never mix them across routes:

| Class           | In home.css                  | In styles/hero.css or sections.css    |
| --------------- | ---------------------------- | ------------------------------------- |
| `.hero`         | 2-col grid, paper bg         | Full-viewport, white bg, grid pattern |
| `.eyebrow`      | inline-flex, blue dot + text | mono font, blue, margin-bottom 16px   |
| `.site-nav`     | height 72px, paper bg        | height var(--nav-h)=82px, white bg    |
| `.nav-center a` | padding 0 14px               | padding 0 16px                        |
| `.reveal`       | CSS animation (forwards)     | CSS transition + JS `.in` class       |
| `.spec-grid`    | 4-col home service grid      | 3-col talent specialism grid          |
| `footer`        | home footer styles           | talent footer styles (footer.css)     |
| `--paper`       | `#fafaf7`                    | `#f2f1ee`                             |

---

## 15. Business Context

|               |                                                                       |
| ------------- | --------------------------------------------------------------------- |
| Company       | Odiseus Software Inc.                                                 |
| HQ            | 3392 Wonderland Rd S, London, ON N6L 1A8, Canada                      |
| Offshore      | 3rd Floor, Alcazar Mall, Jubilee Hills, Hyderabad, Telangana 500033   |
| General email | info@odiseussoftware.com                                              |
| Hiring email  | hr@odiseussoftware.com                                                |
| LinkedIn      | linkedin.com/company/odiseussoftware                                  |
| Brand voice   | Boutique, senior, specialist. No fluff. Copy is terse and precise.    |
| Accent colour | Electric blue #1a4eff — used for all interactive + highlight elements |
| Background    | Warm off-white #fafaf7 (home/services) — never pure white             |

**Three business lines:**

1. **Odiseus Software** (`/`) — consulting practice: DevOps, Cloud, AI, Business Analysis
2. **Odiseus Talent** (`/talent`) — specialist tech recruitment
3. **Services catalogue** (`/services`) — 8 specialisms, 80+ individual services

---

## 16. Prompt Templates for Common Tasks

### Add a new section to the home page

> "Add a `<section>` to `app/page.js` after the [X] section. It should
> use only classes already defined in `app/home.css` OR new classes
> prefixed with `ig-` added to `app/home.css`. The section is a server
> component — no `"use client"`. Follow the existing pattern of
> `max-width: 1400px; margin: 0 auto; padding: Xrem 2.5rem`."

### Add a new page

> "Create `app/<name>/page.js` as a server component. Import
> `'../home.css'` then `'./<name>.css'`. Copy the nav from `app/page.js`
> (mark `<name>` link active, others not). Copy the footer from
> `app/page.js` verbatim. Create `app/<name>/<name>.css` for
> page-specific styles with every class prefixed `<pfx>-`. Also add
> `{ source: '/<name>.html', destination: '/<name>', permanent: true }`
> to `next.config.mjs` and add the `<name>` nav item (no active) to
> `app/talent/TalentClient.jsx`."

### Modify the services catalogue

> "The service data lives in the `CATEGORIES` array at the top of
> `app/services/page.js`. Each entry is `{ num, title, services[] }`.
> Modify that array — the JSX renders it automatically via `.map()`."

### Add a client-side interaction to an existing page

> "Create a new `"use client"` component in `app/components/`. Import it
> inside the relevant server-component page. The CSS it needs must already
> be imported by the parent page — do not import CSS inside the client
> component."

### Style a new element on the services page

> "Add the new class to `app/services/services.css`. Prefix it `svc-`.
> Use `var(--blue)`, `var(--ink)`, `var(--muted)`, `var(--paper)`,
> `var(--rule)` from the `:root` tokens in `app/home.css` — they are
> available because the services page imports home.css."

---

## 17. What It Must Never Do in This Repo

- ❌ Add TypeScript (`.ts`, `.tsx` files)
- ❌ Install any CSS framework (Tailwind, styled-components, etc.)
- ❌ Import `styles/*.css` from any route except `/talent`
- ❌ Import `app/home.css` from the talent route or its components
- ❌ Import fonts — they're already global via layout.js
- ❌ Use `next/image` — the project uses plain `<img>` and inline SVG
- ❌ Use `next/link` — the project uses plain `<a href="">`
- ❌ Create `vercel.json`
- ❌ Add `.module.css` files — isolation is by import scope, not modules
- ❌ Reuse `.hero`, `.eyebrow`, `.cta`, `.spec-grid` or other shared names
  in new page CSS files (home.css is imported too — they will collide)
- ❌ Add `"use client"` to a page that only needs CSS hover effects
