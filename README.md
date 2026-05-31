# Odiseus Talent — Next.js

This is the Odiseus website converted from a static HTML/CSS/JS site into a
production-ready **Next.js 14 (App Router)** application. The UI, copy, fonts,
animations, and behaviour are identical to the original static build.

## Pages / routes

| Route     | Source page   | Description                        |
| --------- | ------------- | ---------------------------------- |
| `/`       | `index.html`  | Odiseus Software (consulting) home |
| `/talent` | `talent.html` | Odiseus Talent (recruitment) page  |

Old URLs still work: `/index.html` redirects to `/` and `/talent.html`
redirects to `/talent`.

## Getting started

Requires **Node.js 18.17+** (Node 20 LTS recommended).

```bash
# 1. install dependencies
npm install

# 2. run the dev server
npm run dev
# open http://localhost:3000

# 3. production build + run
npm run build
npm start
```

## Project structure

```
odiseus/
├── app/
│   ├── layout.js            # root layout + Google Fonts (Instrument Serif, Geist, Geist Mono)
│   ├── page.js              # "/"  home page (from index.html)
│   ├── home.css             # home page styles (extracted from index.html <style>)
│   └── talent/
│       ├── page.js          # "/talent" route — metadata + CSS imports (server component)
│       └── TalentClient.jsx # talent markup + interactivity (ported from main.js)
├── styles/
│   ├── hero.css             # talent: global + nav + hero
│   ├── sections.css         # talent: content sections
│   ├── footer.css           # talent: footer
│   └── responsive.css       # talent: responsive (loaded last)
├── next.config.mjs
└── package.json
```

### How the styling stays isolated

The original site had two visually different page designs that share class
names (`.site-nav`, `.footer-top`, `.reveal`, etc.). Each page's CSS is
imported only inside its own route segment, so Next.js code-splits the CSS per
route — the home styles never load on `/talent` and vice-versa. Nothing
conflicting is imported in the shared root layout.

### Interactivity (talent page)

All the original `main.js` behaviour runs inside a single `useEffect` in
`TalentClient.jsx`, with proper cleanup on unmount:

- Hero word scramble (`Cloud → Data → AI Agents → AI Assistants → MCP Servers`)
- Role filter buttons (All / DevOps / Cloud / AI)
- Custom cursor (fine-pointer devices only, respects reduced-motion)
- Scroll-reveal via `IntersectionObserver`

The home page uses pure CSS entrance animations, so it stays a server component.

## Deploying to Vercel

No `vercel.json` is needed — Vercel auto-detects Next.js. Just push the repo
and import it, or run `vercel`. (The old static `vercel.json` was intentionally
removed because it would force the static builder and break the Next.js build.)
