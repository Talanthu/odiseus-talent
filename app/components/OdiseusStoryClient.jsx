"use client";

import { useEffect, Fragment } from "react";

/* ─── ADAPTIVE NAV (dark ↔ light glass based on scroll position) ─── */
function useAdaptiveNav() {
  useEffect(() => {
    const nav = document.getElementById("mainNav");
    if (!nav) return;

    /* Selectors for sections that have a dark background on the cloud page.
       Order matches the page layout:
       hero → ecosystem → journey → ai → cta-final → footer             */
    const DARK =
      ".os-hero, .os-ecosystem, .os-svc-dark, .os-journey, .os-ai, .os-cta-final, footer";

    const update = () => {
      const navH = nav.offsetHeight || 82;
      let isDark = false;
      document.querySelectorAll(DARK).forEach((section) => {
        const r = section.getBoundingClientRect();
        /* The nav spans from y=0 to y=navH.
           A section is "under the nav" when its top < navH AND its bottom > 0. */
        if (r.top < navH && r.bottom > 0) isDark = true;
      });
      nav.classList.toggle("os-nav-dark", isDark);
    };

    update(); // run immediately so initial state is correct
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
}

/* ─── CLOUD CURSOR ─── */
function useCloudCursor() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const supportsFine = window.matchMedia("(pointer: fine)").matches;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const ring = document.getElementById("osCRing");
    const cloud = document.getElementById("osCCloud");
    if (!supportsFine || prefersReduced || !ring || !cloud) return;

    document.body.classList.add("os-cursor-on");

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let rafId = null;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cloud.style.left = `${mouseX}px`;
      cloud.style.top = `${mouseY}px`;
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      rafId = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMouseMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
      document.body.classList.remove("os-cursor-on");
    };
  }, []);
}

/* ─── REVEAL OBSERVER ─── */
function useRevealObserver() {
  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      document.querySelectorAll("[data-os-reveal]").forEach((el) => {
        el.classList.add("os-in");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("os-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    document
      .querySelectorAll("[data-os-reveal]")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

/* ─── HERO SCROLLYTELLING (Apple-style pinned warp + word reveal) ─── */
function useHeroScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const wrap = document.querySelector(".os-hero-scroll");
    const hero = document.querySelector(".os-hero");
    if (!wrap || !hero) return;

    const words = Array.from(hero.querySelectorAll(".os-hero-word"));
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    /* Paragraph reveal occupies the middle of the scroll track so the hero
       has a moment to settle on entry and to release on exit. */
    const WORD_START = 0.18;
    const WORD_END = 0.82;

    let raf = null;
    let lastP = -1;
    let active = false;

    const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

    const resetWords = () => {
      words.forEach((w) => {
        w.style.opacity = "";
        w.style.transform = "";
        w.style.filter = "";
      });
    };

    const apply = (p) => {
      hero.style.setProperty("--p", p.toFixed(4));
      const reveal =
        ((p - WORD_START) / (WORD_END - WORD_START)) * words.length;
      for (let i = 0; i < words.length; i++) {
        const o = clamp01(reveal - i);
        const w = words[i];
        w.style.opacity = (0.08 + o * 0.92).toFixed(3);
        w.style.transform = `translateY(${((1 - o) * 0.5).toFixed(3)}em)`;
        w.style.filter = o < 1 ? `blur(${((1 - o) * 6).toFixed(2)}px)` : "none";
      }
    };

    const measure = () => {
      raf = null;
      const rect = wrap.getBoundingClientRect();
      /* Measure against the PINNED element's own height (not window.innerHeight)
         so the progress math stays stable on iOS/Android as the URL bar grows
         and shrinks — this is what prevents the scrub from jumping. */
      const total = rect.height - hero.offsetHeight;
      const p = clamp01(total > 0 ? -rect.top / total : 0);
      if (Math.abs(p - lastP) < 0.0008) return;
      lastP = p;
      apply(p);
    };

    const onScroll = () => {
      if (raf == null) raf = requestAnimationFrame(measure);
    };

    const stop = () => {
      if (!active) return;
      active = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.visualViewport?.removeEventListener("resize", onScroll);
      if (raf) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    };

    const sync = () => {
      /* Reduced motion is the only static fallback — the scrollytelling runs
         on every viewport size (mobile, tablet, desktop). */
      if (mqReduce.matches) {
        stop();
        hero.style.setProperty("--p", "0");
        resetWords();
        return;
      }
      if (active) return;
      active = true;
      lastP = -1;
      /* Dim every word until the scroll reveal lights it up. */
      words.forEach((w) => (w.style.opacity = "0.08"));
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      /* visualViewport fires on iOS URL-bar show/hide without a window resize. */
      window.visualViewport?.addEventListener("resize", onScroll, {
        passive: true,
      });
      measure();
    };

    sync();
    const onChange = () => sync();
    mqReduce.addEventListener?.("change", onChange);

    return () => {
      stop();
      window.visualViewport?.removeEventListener("resize", onScroll);
      mqReduce.removeEventListener?.("change", onChange);
    };
  }, []);
}

/* ─── ECOSYSTEM SCROLLYTELLING (pinned core zoom → sequential node reveal) ─── */
function useEcosystemScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const track = document.querySelector(".os-eco-track");
    const section = document.querySelector(".os-ecosystem");
    if (!track || !section) return;

    const center = section.querySelector(".os-eco-center");
    const ring = section.querySelector(".os-eco-ring");
    const nodes = Array.from(section.querySelectorAll(".os-eco-node"));
    const spokes = Array.from(section.querySelectorAll(".os-eco-line"));
    if (!nodes.length) return;

    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

    /* Reveal choreography (fractions of scroll progress):
       core zoom → ring → eight nodes spread across the middle of the track. */
    const CORE_AT = 0.05;
    const RING_AT = 0.16;
    const NODES_START = 0.22;
    const NODES_END = 0.9;
    const step = (NODES_END - NODES_START) / nodes.length;

    let raf = null;
    let lastP = -1;
    let active = false;

    const apply = (p) => {
      /* Shared progress for the cohesive text-out / infographic-in motion. */
      section.style.setProperty("--ep", p.toFixed(4));
      if (center) center.classList.toggle("os-lit", p >= CORE_AT);
      if (ring) ring.classList.toggle("os-lit", p >= RING_AT);

      let activeIdx = -1;
      for (let i = 0; i < nodes.length; i++) {
        const start = NODES_START + i * step;
        const lit = p >= start;
        nodes[i].classList.toggle("os-lit", lit);
        if (lit) activeIdx = i;

        const spoke = spokes[i];
        if (spoke) {
          const drawn = p >= start + step * 0.35;
          spoke.classList.toggle("os-drawn", drawn);
          /* Inline dash offset (transition handles the draw) — beats the
             marching-dash fallback only while we're live. */
          spoke.style.strokeDashoffset = drawn ? "0" : spoke.dataset.osLen;
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].classList.toggle("os-eco-active", i === activeIdx);
      }
    };

    const measure = () => {
      raf = null;
      const rect = track.getBoundingClientRect();
      const total = rect.height - section.offsetHeight;
      const p = clamp01(total > 0 ? -rect.top / total : 0);
      if (Math.abs(p - lastP) < 0.0008) return;
      lastP = p;
      apply(p);
    };

    const onScroll = () => {
      if (raf == null) raf = requestAnimationFrame(measure);
    };

    const stop = () => {
      if (!active) return;
      active = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.visualViewport?.removeEventListener("resize", onScroll);
      if (raf) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    };

    const sync = () => {
      if (mqReduce.matches) {
        /* Static fallback: unpin (CSS), everything visible, no live gating. */
        stop();
        section.classList.remove("os-eco-live");
        section.style.removeProperty("--ep");
        return;
      }
      if (active) return;
      active = true;
      lastP = -1;
      /* Prime each spoke's dash so it can draw on cue. */
      spokes.forEach((line) => {
        const len =
          typeof line.getTotalLength === "function" ? line.getTotalLength() : 0;
        line.dataset.osLen = String(len);
        line.style.strokeDasharray = String(len);
        line.style.strokeDashoffset = String(len);
      });
      section.classList.add("os-eco-live");
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      window.visualViewport?.addEventListener("resize", onScroll, {
        passive: true,
      });
      measure();
    };

    sync();
    const onChange = () => sync();
    mqReduce.addEventListener?.("change", onChange);

    return () => {
      stop();
      mqReduce.removeEventListener?.("change", onChange);
    };
  }, []);
}

/* ─── VISION PILLS HORIZONTAL SCROLLYTELLING (pinned, scrubbed carousel) ─── */
function useVisionScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const track = document.querySelector(".os-vision-track");
    const section = document.querySelector(".os-vision");
    const viewport = section?.querySelector(".os-kw-viewport");
    const row = section?.querySelector(".os-kw-row");
    if (!track || !section || !viewport || !row) return;

    const pills = Array.from(row.querySelectorAll(".os-kw"));
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

    let raf = null;
    let active = false;
    let curX = 0; // smoothed (lerped) translate
    let targetX = 0; // scroll-derived target translate
    let maxX = 0; // distance from first-pill-centred to last-pill-centred
    let firstC = 0; // first pill centre offset within the row (px)

    /* Reach the final (last-pill-centred) frame by 90% of the track, then
       hold it there for the last 10% before the pin releases — so the last
       pill visibly settles in the centre before the next section takes over. */
    const HOLD = 0.9;

    /* Measure the row so the FIRST pill is centred at translateX = -firstC and
       the LAST pill is centred at the end. Padding = half the viewport minus
       half the end pill, so the strip is never clipped on either edge. */
    const relayout = () => {
      const vpW = viewport.clientWidth;
      const first = pills[0];
      const last = pills[pills.length - 1];
      const padL = Math.max(16, vpW / 2 - first.offsetWidth / 2);
      const padR = Math.max(16, vpW / 2 - last.offsetWidth / 2);
      row.style.paddingLeft = `${padL}px`;
      row.style.paddingRight = `${padR}px`;
      firstC = first.offsetLeft + first.offsetWidth / 2;
      const lastC = last.offsetLeft + last.offsetWidth / 2;
      maxX = Math.max(0, lastC - firstC);
    };

    /* Center-focus: scale + brighten pills by distance from the viewport
       centre, and flag the centre-most pill as active. */
    const paint = () => {
      /* Padding already centres the first pill at curX = 0; the row then
         scrubs left to -maxX, centring the last pill at the end. */
      row.style.transform = `translate3d(${curX.toFixed(2)}px,0,0)`;
      const vpRect = viewport.getBoundingClientRect();
      const center = vpRect.left + vpRect.width / 2;
      const reach = vpRect.width * 0.42 || 1;
      let bestI = -1;
      let bestDist = Infinity;
      for (let i = 0; i < pills.length; i++) {
        const r = pills[i].getBoundingClientRect();
        const dist = Math.abs(r.left + r.width / 2 - center);
        const norm = clamp01(dist / reach);
        pills[i].style.setProperty("--os-foc", (1 - norm).toFixed(3));
        if (dist < bestDist) {
          bestDist = dist;
          bestI = i;
        }
      }
      for (let i = 0; i < pills.length; i++) {
        pills[i].classList.toggle("os-kw-active", i === bestI);
      }
    };

    const computeTarget = () => {
      const rect = track.getBoundingClientRect();
      const total = rect.height - section.offsetHeight;
      const p = clamp01(total > 0 ? -rect.top / total : 0);
      const pp = clamp01(p / HOLD); // centre the last pill by 90%, then hold
      targetX = -pp * maxX;
      /* Expose progress so the heading + pills can share one premium
         zoom-out / fade-out exit (CSS reads --vp). */
      section.style.setProperty("--vp", p.toFixed(4));
    };

    const loop = () => {
      /* Ease toward target — the lag gives the premium Apple-style glide. */
      curX += (targetX - curX) * 0.1;
      if (Math.abs(targetX - curX) < 0.25) curX = targetX;
      paint();
      if (curX !== targetX) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    };

    const kick = () => {
      computeTarget();
      if (raf == null) raf = requestAnimationFrame(loop);
    };

    const onResize = () => {
      relayout();
      kick();
    };

    const stop = () => {
      if (!active) return;
      active = false;
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
      if (raf) {
        cancelAnimationFrame(raf);
        raf = null;
      }
      row.style.transform = "";
      row.style.paddingLeft = "";
      row.style.paddingRight = "";
      section.style.removeProperty("--vp");
      pills.forEach((p) => {
        p.style.removeProperty("--os-foc");
        p.classList.remove("os-kw-active");
      });
    };

    const sync = () => {
      if (mqReduce.matches) {
        stop();
        section.classList.remove("os-vision-live");
        return;
      }
      if (active) return;
      active = true;
      section.classList.add("os-vision-live");
      relayout();
      computeTarget();
      curX = targetX; // snap on first paint — no entry jump
      paint();
      window.addEventListener("scroll", kick, { passive: true });
      window.addEventListener("resize", onResize, { passive: true });
      window.visualViewport?.addEventListener("resize", onResize, {
        passive: true,
      });
    };

    sync();
    const onChange = () => sync();
    mqReduce.addEventListener?.("change", onChange);

    return () => {
      stop();
      mqReduce.removeEventListener?.("change", onChange);
    };
  }, []);
}

/* ─── SERVICE CHAPTERS (active focus + infographic assemble-in) ─── */
function useServiceStory() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    /* Focus the chapter whose figure sits in the centre band of the viewport. */
    const sections = Array.from(document.querySelectorAll(".os-svc-section"));
    const activeObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) =>
          e.target.classList.toggle("os-svc-on", e.isIntersecting),
        );
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 },
    );
    sections.forEach((s) => activeObs.observe(s));

    /* Infographics assemble themselves piece-by-piece as they enter — the
       diagram "builds" rather than just fading in. Skipped for reduced motion
       and gated behind a class so SSR / no-JS always show the full figure. */
    let buildObs = null;
    if (!prefersReduced) {
      const svgs = Array.from(document.querySelectorAll(".os-svc-svg"));
      svgs.forEach((svg) => {
        Array.from(svg.children).forEach((child, i) => {
          child.style.transitionDelay = `${Math.min(i, 14) * 55}ms`;
        });
        svg.classList.add("os-svc-build");
      });
      buildObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("os-svc-built");
              buildObs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.25 },
      );
      svgs.forEach((svg) => buildObs.observe(svg));
    }

    return () => {
      activeObs.disconnect();
      buildObs?.disconnect();
    };
  }, []);
}

/* ─── COUNT-UP ─── */
function useCountUp() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const end = parseInt(el.dataset.osCount, 10);
          const duration = 1400;
          const t0 = performance.now();

          const tick = (now) => {
            const p = Math.min((now - t0) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(eased * end);
            if (p < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
          observer.unobserve(el);
        });
      },
      { threshold: 0.5 },
    );

    document
      .querySelectorAll("[data-os-count]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ─── SERVICE DATA ─── */
const CATEGORIES = [
  {
    num: "01 / 08",
    title: "Cloud Migration & Strategy",
    desc: "We guide organisations from on-premises infrastructure to cloud-native architectures — handling every phase from initial assessment through full migration and ongoing optimisation.",
    services: [
      "AWS Migration",
      "Azure Migration",
      "Digital Transformation Advisory",
      "Well-Architected Framework",
      "Application Assessment",
      "Migration Readiness Assessment",
      "Landing Zone Design",
      "Wave Planning",
      "TCO Analysis",
      "Data Center Migration",
      "On-Prem to Cloud",
      "Disaster Recovery",
      "Business Continuity Planning",
      "Cloud Readiness Assessment",
    ],
  },
  {
    num: "02 / 08",
    title: "DevOps & Platform Engineering",
    desc: "We build the pipelines, platforms, and practices that let engineering teams ship faster, safer, and more often — from CI/CD automation to full platform engineering.",
    services: [
      "DevOps Consulting",
      "CI/CD Pipelines",
      "Infrastructure as Code",
      "Configuration Management",
      "Build Automation",
      "Release Automation",
      "Continuous Integration",
      "Continuous Deployment",
      "DevSecOps",
      "Platform Engineering",
      "GitOps",
      "Site Reliability Engineering",
      "Version Control Strategy",
      "Artifact Management",
    ],
  },
  {
    num: "03 / 08",
    title: "Cloud Infrastructure",
    desc: "We architect and operate the cloud-native infrastructure layer — Kubernetes, containers, serverless, and databases — that your applications depend on at scale.",
    services: [
      "AWS Infrastructure",
      "Azure Infrastructure",
      "Kubernetes Orchestration",
      "Container Platforms",
      "Serverless Architecture",
      "Microservices Architecture",
      "Virtual Desktop Infrastructure",
      "Windows Workloads",
      "Linux Workloads",
      "SQL Server Migration",
      "Open-Source Database Migration",
      "Web Application Modernization",
      "API Gateway Architecture",
      "Edge Deployments",
    ],
  },
  {
    num: "04 / 08",
    title: "AI & Machine Learning",
    desc: "We design and build AI systems that work in production — from strategy and proof-of-concept through to full GenAI deployment, AI agent development, and ongoing operations.",
    services: [
      "Generative AI Strategy",
      "GenAI Proof of Concept",
      "GenAI MVP Development",
      "Full GenAI Implementation",
      "LLM Integration",
      "RAG Systems",
      "AI Agents",
      "MCP Servers",
      "AI Assistants",
      "Conversational AI",
      "Multilingual Voice AI",
      "Intelligent Document Analysis",
      "Predictive Analytics",
      "Machine Learning Models",
      "AI-Powered Analytics",
      "Healthcare AI Solutions",
      "FinTech AI Solutions",
    ],
  },
  {
    num: "05 / 08",
    title: "Data & Analytics",
    desc: "We engineer the data layer — ingestion, transformation, warehousing, and visualisation — that turns raw data into business intelligence and competitive insight.",
    services: [
      "Data Warehousing",
      "Data Lake Architecture",
      "Data Engineering",
      "Real-Time Analytics",
      "Business Intelligence",
      "Metadata Management",
      "Data Lineage",
      "Data Ingestion Pipelines",
      "ETL/ELT Pipelines",
      "Data Governance",
      "Snowflake Implementation",
      "Data Backup & Recovery",
    ],
  },
  {
    num: "06 / 08",
    title: "Security",
    desc: "We secure cloud, application, and infrastructure layers end-to-end — from identity and access management to compliance, threat detection, and incident response.",
    services: [
      "Cloud Security Posture Management",
      "Cloud Workload Protection",
      "Identity & Access Management",
      "Endpoint Security",
      "Web Application Firewall",
      "DDoS Protection",
      "API Security",
      "Bot Mitigation",
      "Threat Detection",
      "SIEM & SOAR",
      "Encryption",
      "Firewall Management",
      "Anti-Virus & Anti-Malware",
      "Data Privacy",
      "Central Logging",
      "Secrets Management",
      "VAPT & Remediation",
      "Compliance Management",
      "Security Audits",
      "Email Security",
    ],
  },
  {
    num: "07 / 08",
    title: "Managed Services & Observability",
    desc: "We provide continuous operations — 24×7 monitoring, incident management, FinOps, and platform reliability — so your engineering teams can focus on building products.",
    services: [
      "24×7 Infrastructure Monitoring",
      "Application Performance Monitoring",
      "Database Monitoring",
      "URL Monitoring",
      "Service & Process Monitoring",
      "Log Management",
      "Distributed Tracing",
      "Incident Management",
      "Problem Management",
      "Change Management",
      "Patch Management",
      "Capacity Management",
      "Performance Management",
      "Backup Management",
      "FinOps & Cost Optimization",
      "Right-Sizing",
      "Cost Intelligence Dashboards",
      "Platform Consolidation",
      "Auto-Healing Systems",
      "WAF Dashboards",
    ],
  },
  {
    num: "08 / 08",
    title: "Application Modernization",
    desc: "We re-architect legacy systems into cloud-native, container-ready applications — migrating monoliths to microservices and modernising the full software stack.",
    services: [
      "Legacy Code Re-Architecting",
      "Monolith to Microservices",
      "Containerization",
      "API Modernization",
      "Cloud-Native Refactoring",
      "Database Modernization",
      "Rehost & Replatform",
      "Container Storage Integration",
      "Container Network Integration",
      "Spot Instance Optimization",
    ],
  },
];

/* Hardcoded to avoid hydration mismatch */
const HERO_NODES = [
  { left: "8%", top: "18%", delay: "0s", size: 6 },
  { left: "22%", top: "63%", delay: "1.6s", size: 4 },
  { left: "48%", top: "28%", delay: "0.9s", size: 8 },
  { left: "63%", top: "72%", delay: "2.3s", size: 5 },
  { left: "78%", top: "14%", delay: "1.2s", size: 7 },
  { left: "87%", top: "54%", delay: "0.4s", size: 5 },
  { left: "34%", top: "82%", delay: "1.9s", size: 6 },
  { left: "91%", top: "32%", delay: "2.9s", size: 4 },
  { left: "16%", top: "44%", delay: "0.7s", size: 8 },
  { left: "57%", top: "58%", delay: "3.2s", size: 5 },
  { left: "71%", top: "38%", delay: "1.5s", size: 6 },
  { left: "4%", top: "73%", delay: "2.6s", size: 4 },
];

/* Orbit radius 240 around center (490, 300).
   Positions: top → top-right → right → bottom-right →
              bottom → bottom-left → left → top-left  */
const ECOSYSTEM_NODES = [
  { cx: 490, cy: 60, label: "CLOUD ENG", sub: "Migration & Strategy" },
  { cx: 660, cy: 130, label: "DEVOPS", sub: "Platform & CI/CD" },
  { cx: 730, cy: 300, label: "AI", sub: "ML & GenAI" },
  { cx: 660, cy: 470, label: "DATA", sub: "Analytics & Lakes" },
  { cx: 490, cy: 540, label: "SECURITY", sub: "CSPM & Compliance" },
  { cx: 320, cy: 470, label: "MANAGED OPS", sub: "24×7 Observability" },
  { cx: 250, cy: 300, label: "APP MOD", sub: "Modernization" },
  { cx: 320, cy: 130, label: "BIZ ANALYSIS", sub: "Strategy & Process" },
];

const JOURNEY_STEPS = [
  { idx: "01", label: "Assess" },
  { idx: "02", label: "Architect" },
  { idx: "03", label: "Build" },
  { idx: "04", label: "Automate" },
  { idx: "05", label: "Secure" },
  { idx: "06", label: "Operate" },
  { idx: "07", label: "Optimise" },
];

const AI_FEATURES = [
  {
    title: "AI Assistants & Agents",
    desc: "Conversational AI and autonomous agents that integrate with your systems, workflows, and data.",
  },
  {
    title: "MCP Servers",
    desc: "Model Context Protocol servers that give AI models structured access to your internal tools and APIs.",
  },
  {
    title: "RAG Systems",
    desc: "Retrieval-augmented generation that grounds LLM responses in your proprietary knowledge base.",
  },
  {
    title: "Workflow Automation",
    desc: "AI-driven automation that removes manual steps from operations, approvals, and document processing.",
  },
  {
    title: "Data Intelligence",
    desc: "Predictive models and ML pipelines that surface patterns and drive data-led decisions.",
  },
  {
    title: "Internal Tooling",
    desc: "Custom AI-powered internal products — search, summarisation, classification, and code generation.",
  },
];

/* ═══════════════════════════════════
   SVG ILLUSTRATIONS — one per service
═══════════════════════════════════ */

function CloudMigrationSVG() {
  return (
    <svg
      className="os-svc-svg"
      viewBox="0 0 420 230"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Left: Physical DC */}
      <rect
        x="12"
        y="55"
        width="88"
        height="100"
        rx="6"
        fill="none"
        stroke="#e5e2da"
        strokeWidth="1.5"
      />
      <rect
        x="22"
        y="69"
        width="68"
        height="9"
        rx="2"
        fill="#e5e2da"
        opacity="0.7"
      />
      <rect
        x="22"
        y="83"
        width="68"
        height="9"
        rx="2"
        fill="#e5e2da"
        opacity="0.7"
      />
      <rect
        x="22"
        y="97"
        width="68"
        height="9"
        rx="2"
        fill="#e5e2da"
        opacity="0.7"
      />
      <rect
        x="22"
        y="111"
        width="68"
        height="9"
        rx="2"
        fill="#e5e2da"
        opacity="0.4"
      />
      <rect
        x="22"
        y="125"
        width="68"
        height="9"
        rx="2"
        fill="#e5e2da"
        opacity="0.25"
      />
      <text
        x="56"
        y="178"
        textAnchor="middle"
        fontSize="8"
        fontFamily="Geist Mono, monospace"
        fill="#6b6b6b"
        letterSpacing="0.06em"
      >
        ON-PREMISES
      </text>

      {/* Arrow 1 */}
      <line
        x1="104"
        y1="105"
        x2="150"
        y2="105"
        stroke="#1a4eff"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="-14"
          dur="1.1s"
          repeatCount="indefinite"
        />
      </line>
      <polygon points="150,101 160,105 150,109" fill="#1a4eff" opacity="0.9" />

      {/* Middle: Hybrid */}
      <rect
        x="166"
        y="68"
        width="82"
        height="74"
        rx="6"
        fill="none"
        stroke="rgba(26,78,255,0.32)"
        strokeWidth="1.5"
      />
      <rect
        x="176"
        y="80"
        width="62"
        height="8"
        rx="2"
        fill="rgba(26,78,255,0.14)"
      />
      <rect
        x="176"
        y="93"
        width="62"
        height="8"
        rx="2"
        fill="rgba(26,78,255,0.14)"
      />
      <rect
        x="176"
        y="106"
        width="62"
        height="8"
        rx="2"
        fill="rgba(26,78,255,0.08)"
      />
      <text
        x="207"
        y="163"
        textAnchor="middle"
        fontSize="8"
        fontFamily="Geist Mono, monospace"
        fill="#6b6b6b"
        letterSpacing="0.06em"
      >
        HYBRID
      </text>

      {/* Arrow 2 */}
      <line
        x1="252"
        y1="105"
        x2="298"
        y2="105"
        stroke="#1a4eff"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="-14"
          dur="1.1s"
          begin="0.35s"
          repeatCount="indefinite"
        />
      </line>
      <polygon points="298,101 308,105 298,109" fill="#1a4eff" opacity="0.9" />

      {/* Right: Cloud shape */}
      <ellipse
        cx="362"
        cy="90"
        rx="38"
        ry="25"
        fill="rgba(26,78,255,0.07)"
        stroke="#1a4eff"
        strokeWidth="1.5"
      />
      <ellipse
        cx="340"
        cy="103"
        rx="22"
        ry="15"
        fill="rgba(26,78,255,0.07)"
        stroke="#1a4eff"
        strokeWidth="1.5"
      />
      <ellipse
        cx="381"
        cy="102"
        rx="18"
        ry="13"
        fill="rgba(26,78,255,0.07)"
        stroke="#1a4eff"
        strokeWidth="1.5"
      />
      <text
        x="362"
        y="138"
        textAnchor="middle"
        fontSize="8"
        fontFamily="Geist Mono, monospace"
        fill="#1a4eff"
        letterSpacing="0.06em"
      >
        CLOUD NATIVE
      </text>
      <text
        x="362"
        y="178"
        textAnchor="middle"
        fontSize="7"
        fontFamily="Geist Mono, monospace"
        fill="#6b6b6b"
        letterSpacing="0.04em"
      >
        AWS · AZURE · GCP
      </text>

      {/* Status dots */}
      <circle cx="56" cy="205" r="4" fill="#e5e2da" />
      <text
        x="66"
        y="208"
        fontSize="8"
        fontFamily="Geist, sans-serif"
        fill="#6b6b6b"
        dominantBaseline="middle"
      >
        Legacy
      </text>
      <circle cx="150" cy="205" r="4" fill="rgba(26,78,255,0.5)" />
      <text
        x="160"
        y="208"
        fontSize="8"
        fontFamily="Geist, sans-serif"
        fill="#6b6b6b"
        dominantBaseline="middle"
      >
        In-flight
      </text>
      <circle cx="255" cy="205" r="4" fill="#1a4eff" />
      <text
        x="265"
        y="208"
        fontSize="8"
        fontFamily="Geist, sans-serif"
        fill="#6b6b6b"
        dominantBaseline="middle"
      >
        Modern
      </text>
    </svg>
  );
}

const DEVOPS_STAGES = ["CODE", "BUILD", "TEST", "DEPLOY", "MONITOR"];
function DevOpsSVG() {
  return (
    <svg
      className="os-svc-svg"
      viewBox="0 0 420 185"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="420" height="185" fill="#0a0a0f" rx="14" />
      <line
        x1="52"
        y1="78"
        x2="368"
        y2="78"
        stroke="rgba(26,78,255,0.18)"
        strokeWidth="1"
      />
      <line
        x1="52"
        y1="78"
        x2="368"
        y2="78"
        stroke="#1a4eff"
        strokeWidth="1.5"
        strokeDasharray="7 5"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="-48"
          dur="2.2s"
          repeatCount="indefinite"
        />
      </line>
      {DEVOPS_STAGES.map((stage, i) => {
        const cx = 52 + i * 79;
        return (
          <g key={stage}>
            <circle
              cx={cx}
              cy={78}
              r={21}
              fill="rgba(26,78,255,0.1)"
              stroke="rgba(26,78,255,0.45)"
              strokeWidth="1.5"
            />
            <circle
              cx={cx}
              cy={78}
              r={13}
              fill="rgba(26,78,255,0.18)"
              stroke="#1a4eff"
              strokeWidth={1}
            >
              <animate
                attributeName="r"
                values="13;15;13"
                dur={`${2.2 + i * 0.28}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="1;0.6;1"
                dur={`${2.2 + i * 0.28}s`}
                repeatCount="indefinite"
              />
            </circle>
            <text
              x={cx}
              y={82}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="6.5"
              fontFamily="Geist Mono, monospace"
              fill="rgba(255,255,255,0.85)"
              letterSpacing="0.05em"
            >{`0${i + 1}`}</text>
            <text
              x={cx}
              y={112}
              textAnchor="middle"
              fontSize="8"
              fontFamily="Geist Mono, monospace"
              fill="rgba(255,255,255,0.6)"
              letterSpacing="0.05em"
            >
              {stage}
            </text>
          </g>
        );
      })}
      <text
        x="210"
        y="154"
        textAnchor="middle"
        fontSize="7.5"
        fontFamily="Geist Mono, monospace"
        fill="rgba(26,78,255,0.7)"
        letterSpacing="0.13em"
      >
        DEVSECOPS · PLATFORM ENGINEERING · SRE
      </text>
    </svg>
  );
}

const INFRA_NODES = [
  { cx: 210, cy: 42, label: "Kubernetes" },
  { cx: 75, cy: 145, label: "Containers" },
  { cx: 140, cy: 162, label: "Serverless" },
  { cx: 210, cy: 178, label: "Databases" },
  { cx: 280, cy: 162, label: "Networking" },
  { cx: 345, cy: 145, label: "Edge" },
];
function CloudInfraSVG() {
  return (
    <svg
      className="os-svc-svg"
      viewBox="0 0 420 220"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {INFRA_NODES.slice(1).map((node, i) => (
        <line
          key={i}
          x1="210"
          y1="42"
          x2={node.cx}
          y2={node.cy}
          stroke="rgba(26,78,255,0.25)"
          strokeWidth="1"
          strokeDasharray="4 5"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-27"
            dur={`${1.6 + i * 0.22}s`}
            repeatCount="indefinite"
          />
        </line>
      ))}
      {INFRA_NODES.slice(1).map((node, i) => (
        <g key={`n${i}`}>
          <circle
            cx={node.cx}
            cy={node.cy}
            r={28}
            fill="var(--blue-soft, #e8edff)"
            stroke="rgba(26,78,255,0.4)"
            strokeWidth="1"
            opacity="0.9"
          />
          <text
            x={node.cx}
            y={node.cy + 3}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="7.5"
            fontFamily="Geist Mono, monospace"
            fill="#1a4eff"
            letterSpacing="0.04em"
          >
            {node.label}
          </text>
        </g>
      ))}
      <circle
        cx="210"
        cy="42"
        r="36"
        fill="rgba(26,78,255,0.1)"
        stroke="var(--blue,#1a4eff)"
        strokeWidth="2"
      />
      <circle
        cx="210"
        cy="42"
        r="24"
        fill="rgba(26,78,255,0.18)"
        stroke="var(--blue,#1a4eff)"
        strokeWidth="1"
      >
        <animate
          attributeName="r"
          values="24;27;24"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>
      <text
        x="210"
        y="38"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="8.5"
        fontFamily="Geist Mono, monospace"
        fill="#1a4eff"
        letterSpacing="0.06em"
      >
        K8s
      </text>
      <text
        x="210"
        y="50"
        textAnchor="middle"
        fontSize="7"
        fontFamily="Geist Mono, monospace"
        fill="rgba(26,78,255,0.7)"
        letterSpacing="0.04em"
      >
        ORCHESTRATION
      </text>
    </svg>
  );
}

const NN_LAYERS = [
  [85, 115, 145, 175],
  [55, 90, 125, 160, 195],
  [100, 155],
];
function AISVG() {
  const lx = [75, 195, 315];
  return (
    <svg
      className="os-svc-svg"
      viewBox="0 0 420 240"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="420" height="240" fill="#0a0a0f" rx="14" />
      {NN_LAYERS[0].map((y0) =>
        NN_LAYERS[1].map((y1) => (
          <line
            key={`l0-${y0}-${y1}`}
            x1={lx[0]}
            y1={y0}
            x2={lx[1]}
            y2={y1}
            stroke="rgba(26,78,255,0.18)"
            strokeWidth="0.8"
          />
        )),
      )}
      {NN_LAYERS[1].map((y1) =>
        NN_LAYERS[2].map((y2) => (
          <line
            key={`l1-${y1}-${y2}`}
            x1={lx[1]}
            y1={y1}
            x2={lx[2]}
            y2={y2}
            stroke="rgba(26,78,255,0.28)"
            strokeWidth="0.8"
          />
        )),
      )}
      {NN_LAYERS.map((layer, li) =>
        layer.map((cy, ni) => (
          <g key={`node-${li}-${ni}`}>
            <circle
              cx={lx[li]}
              cy={cy}
              r={14}
              fill="rgba(26,78,255,0.12)"
              stroke="rgba(26,78,255,0.5)"
              strokeWidth="1.2"
            >
              <animate
                attributeName="opacity"
                values="1;0.6;1"
                dur={`${2 + li * 0.6 + ni * 0.3}s`}
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx={lx[li]}
              cy={cy}
              r={7}
              fill="rgba(26,78,255,0.3)"
              stroke="#1a4eff"
              strokeWidth="0.8"
            />
          </g>
        )),
      )}
      <text
        x="75"
        y="215"
        textAnchor="middle"
        fontSize="7.5"
        fontFamily="Geist Mono, monospace"
        fill="rgba(255,255,255,0.4)"
        letterSpacing="0.06em"
      >
        INPUT
      </text>
      <text
        x="195"
        y="215"
        textAnchor="middle"
        fontSize="7.5"
        fontFamily="Geist Mono, monospace"
        fill="rgba(255,255,255,0.4)"
        letterSpacing="0.06em"
      >
        HIDDEN
      </text>
      <text
        x="315"
        y="215"
        textAnchor="middle"
        fontSize="7.5"
        fontFamily="Geist Mono, monospace"
        fill="rgba(255,255,255,0.4)"
        letterSpacing="0.06em"
      >
        OUTPUT
      </text>
      <text
        x="210"
        y="15"
        textAnchor="middle"
        fontSize="8"
        fontFamily="Geist Mono, monospace"
        fill="rgba(26,78,255,0.7)"
        letterSpacing="0.12em"
      >
        NEURAL NETWORK · LLM · RAG · AGENTS
      </text>
    </svg>
  );
}

const DATA_STAGES = [
  "Sources",
  "Ingest",
  "Transform",
  "Store",
  "Analyse",
  "Insights",
];
function DataSVG() {
  const positions = [28, 96, 164, 232, 300, 368];
  return (
    <svg
      className="os-svc-svg"
      viewBox="0 0 420 175"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <line
        x1="28"
        y1="68"
        x2="392"
        y2="68"
        stroke="rgba(26,78,255,0.2)"
        strokeWidth="1"
      />
      <line
        x1="28"
        y1="68"
        x2="392"
        y2="68"
        stroke="#1a4eff"
        strokeWidth="1.5"
        strokeDasharray="6 4"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="-40"
          dur="2.5s"
          repeatCount="indefinite"
        />
      </line>
      {DATA_STAGES.map((stage, i) => {
        const cx = positions[i];
        const isLast = i === DATA_STAGES.length - 1;
        return (
          <g key={stage}>
            <rect
              x={cx - 27}
              y={44}
              width={54}
              height={48}
              rx="6"
              fill={isLast ? "rgba(26,78,255,0.12)" : "rgba(26,78,255,0.06)"}
              stroke={isLast ? "#1a4eff" : "rgba(26,78,255,0.35)"}
              strokeWidth={isLast ? "1.5" : "1"}
            />
            <text
              x={cx}
              y={73}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="7.5"
              fontFamily="Geist Mono, monospace"
              fill={isLast ? "#1a4eff" : "#6b6b6b"}
              letterSpacing="0.04em"
            >
              {stage}
            </text>
            <text
              x={cx}
              y={118}
              textAnchor="middle"
              fontSize="7"
              fontFamily="Geist Mono, monospace"
              fill="#6b6b6b"
            >{`0${i + 1}`}</text>
          </g>
        );
      })}
      <text
        x="210"
        y="155"
        textAnchor="middle"
        fontSize="7.5"
        fontFamily="Geist Mono, monospace"
        fill="rgba(26,78,255,0.65)"
        letterSpacing="0.12em"
      >
        DATA WAREHOUSE · LAKE · PIPELINES · BI
      </text>
    </svg>
  );
}

const SEC_LAYERS = [
  { r: 95, label: "INFRASTRUCTURE", opacity: 0.08 },
  { r: 72, label: "NETWORK", opacity: 0.11 },
  { r: 50, label: "APPLICATION", opacity: 0.15 },
  { r: 28, label: "DATA", opacity: 0.22 },
];
function SecuritySVG() {
  return (
    <svg
      className="os-svc-svg"
      viewBox="0 0 420 220"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="420" height="220" fill="#0a0a0f" rx="14" />
      {SEC_LAYERS.map((layer, i) => (
        <g key={i}>
          <circle
            cx="210"
            cy="105"
            r={layer.r}
            fill={`rgba(26,78,255,${layer.opacity})`}
            stroke="rgba(26,78,255,0.35)"
            strokeWidth="1"
          >
            <animate
              attributeName="r"
              values={`${layer.r};${layer.r + 2};${layer.r}`}
              dur={`${4 + i * 1.2}s`}
              repeatCount="indefinite"
            />
          </circle>
          <text
            x={210 + layer.r + 4}
            y={108}
            fontSize="7"
            fontFamily="Geist Mono, monospace"
            fill="rgba(26,78,255,0.7)"
            letterSpacing="0.05em"
            dominantBaseline="middle"
          >
            {layer.label}
          </text>
        </g>
      ))}
      {/* Shield center */}
      <path
        d="M210 86 L224 92 L224 106 Q224 117 210 122 Q196 117 196 106 L196 92 Z"
        fill="rgba(26,78,255,0.3)"
        stroke="#1a4eff"
        strokeWidth="1.5"
      />
      <line
        x1="210"
        y1="95"
        x2="210"
        y2="110"
        stroke="#fff"
        strokeWidth="1.5"
        opacity="0.7"
      />
      <circle cx="210" cy="93" r="2.5" fill="#fff" opacity="0.7" />
      <text
        x="210"
        y="196"
        textAnchor="middle"
        fontSize="7.5"
        fontFamily="Geist Mono, monospace"
        fill="rgba(26,78,255,0.65)"
        letterSpacing="0.1em"
      >
        CSPM · IAM · WAF · SIEM · COMPLIANCE
      </text>
    </svg>
  );
}

const DASH_METRICS = [
  { label: "CPU", value: 62, bar: true },
  { label: "MEM", value: 45, bar: true },
  { label: "DISK", value: 78, bar: true },
  { label: "ALERTS", value: 0, bar: false },
];
function ManagedSVG() {
  return (
    <svg
      className="os-svc-svg"
      viewBox="0 0 420 220"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        width="420"
        height="220"
        rx="14"
        fill="#fafaf7"
        stroke="#e5e2da"
        strokeWidth="1"
      />
      <rect x="12" y="12" width="396" height="28" rx="6" fill="#f2efe8" />
      <circle cx="28" cy="26" r="5" fill="rgba(26,78,255,0.5)" />
      <circle cx="44" cy="26" r="5" fill="rgba(26,78,255,0.3)" />
      <circle cx="60" cy="26" r="5" fill="rgba(26,78,255,0.15)" />
      <text
        x="88"
        y="30"
        fontSize="8"
        fontFamily="Geist Mono, monospace"
        fill="#6b6b6b"
        letterSpacing="0.08em"
        dominantBaseline="middle"
      >
        ODISEUS OBSERVABILITY PLATFORM · LIVE
      </text>
      <circle cx="390" cy="26" r="4" fill="#00b86b" opacity="0.8">
        <animate
          attributeName="opacity"
          values="0.8;0.3;0.8"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>

      {DASH_METRICS.map((m, i) => {
        const y = 58 + i * 38;
        return (
          <g key={m.label}>
            <text
              x="24"
              y={y + 10}
              fontSize="7.5"
              fontFamily="Geist Mono, monospace"
              fill="#6b6b6b"
              letterSpacing="0.06em"
              dominantBaseline="middle"
            >
              {m.label}
            </text>
            {m.bar ? (
              <>
                <rect
                  x="80"
                  y={y + 3}
                  width="280"
                  height="14"
                  rx="3"
                  fill="rgba(26,78,255,0.06)"
                  stroke="rgba(26,78,255,0.15)"
                  strokeWidth="1"
                />
                <rect
                  x="80"
                  y={y + 3}
                  width={(280 * m.value) / 100}
                  height="14"
                  rx="3"
                  fill="rgba(26,78,255,0.3)"
                />
                <text
                  x="370"
                  y={y + 11}
                  fontSize="7.5"
                  fontFamily="Geist Mono, monospace"
                  fill="#1a4eff"
                  dominantBaseline="middle"
                >
                  {m.value}%
                </text>
              </>
            ) : (
              <text
                x="80"
                y={y + 10}
                fontSize="14"
                fontFamily="Instrument Serif, serif"
                fill="#1a4eff"
                dominantBaseline="middle"
              >
                0 active
              </text>
            )}
          </g>
        );
      })}

      {/* Sparkline */}
      <polyline
        points="24,190 60,178 96,183 132,170 168,175 204,162 240,167 276,155 312,158 348,148 384,152"
        fill="none"
        stroke="#1a4eff"
        strokeWidth="1.5"
        opacity="0.5"
      />
      <text
        x="24"
        y="210"
        fontSize="7"
        fontFamily="Geist Mono, monospace"
        fill="#6b6b6b"
        letterSpacing="0.06em"
      >
        RESPONSE TIME · LAST 24H
      </text>
    </svg>
  );
}

const MICRO_GRID = [
  "Auth",
  "API GW",
  "Users",
  "Orders",
  "Notify",
  "Billing",
  "Search",
  "Events",
  "Reports",
];
function ModernizationSVG() {
  return (
    <svg
      className="os-svc-svg"
      viewBox="0 0 420 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="420" height="200" rx="14" fill="#0a0a0f" />
      {/* Monolith */}
      <rect
        x="20"
        y="50"
        width="110"
        height="110"
        rx="8"
        fill="rgba(26,78,255,0.08)"
        stroke="rgba(26,78,255,0.4)"
        strokeWidth="1.5"
      />
      <rect
        x="32"
        y="62"
        width="86"
        height="11"
        rx="3"
        fill="rgba(26,78,255,0.2)"
      />
      <rect
        x="32"
        y="78"
        width="86"
        height="11"
        rx="3"
        fill="rgba(26,78,255,0.2)"
      />
      <rect
        x="32"
        y="94"
        width="86"
        height="11"
        rx="3"
        fill="rgba(26,78,255,0.15)"
      />
      <rect
        x="32"
        y="110"
        width="86"
        height="11"
        rx="3"
        fill="rgba(26,78,255,0.15)"
      />
      <rect
        x="32"
        y="126"
        width="86"
        height="11"
        rx="3"
        fill="rgba(26,78,255,0.1)"
      />
      <text
        x="75"
        y="172"
        textAnchor="middle"
        fontSize="8"
        fontFamily="Geist Mono, monospace"
        fill="rgba(255,255,255,0.4)"
        letterSpacing="0.06em"
      >
        MONOLITH
      </text>

      {/* Arrow */}
      <line
        x1="138"
        y1="105"
        x2="180"
        y2="105"
        stroke="#1a4eff"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="-14"
          dur="1.2s"
          repeatCount="indefinite"
        />
      </line>
      <polygon points="180,101 190,105 180,109" fill="#1a4eff" opacity="0.9" />

      {/* Microservices grid */}
      {MICRO_GRID.map((name, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 200 + col * 72;
        const y = 40 + row * 52;
        return (
          <g key={name}>
            <rect
              x={x}
              y={y}
              width="62"
              height="40"
              rx="5"
              fill="rgba(26,78,255,0.1)"
              stroke="rgba(26,78,255,0.4)"
              strokeWidth="1"
            />
            <text
              x={x + 31}
              y={y + 22}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="7.5"
              fontFamily="Geist Mono, monospace"
              fill="rgba(255,255,255,0.75)"
              letterSpacing="0.04em"
            >
              {name}
            </text>
          </g>
        );
      })}
      <text
        x="290"
        y="185"
        textAnchor="middle"
        fontSize="8"
        fontFamily="Geist Mono, monospace"
        fill="rgba(26,78,255,0.65)"
        letterSpacing="0.06em"
      >
        MICROSERVICES
      </text>
    </svg>
  );
}

const CATEGORY_SVGS = [
  <CloudMigrationSVG key="01" />,
  <DevOpsSVG key="02" />,
  <CloudInfraSVG key="03" />,
  <AISVG key="04" />,
  <DataSVG key="05" />,
  <SecuritySVG key="06" />,
  <ManagedSVG key="07" />,
  <ModernizationSVG key="08" />,
];

const DARK_SVG_IDX = new Set([1, 3, 5, 7]);

/* ═══════════════════════════════════
   SECTION COMPONENTS
═══════════════════════════════════ */

const HERO_PARAGRAPH =
  "Odiseus helps businesses design, modernise, automate, secure, and scale their digital operations through specialist software, cloud, DevOps, AI, and business analysis services.";

function HeroSection() {
  return (
    /* Tall track gives the pinned hero room to play its scroll story. */
    <div className="os-hero-scroll">
      <section className="os-hero" aria-labelledby="os-hero-h1">
        {/* Perspective star-field — three depth layers that warp toward the
            viewer as the page scrolls, driven by the --p CSS variable. */}
        <div className="os-hero-warp" aria-hidden="true">
          <div className="os-hero-warp-layer os-hero-warp-l1" />
          <div className="os-hero-warp-layer os-hero-warp-l2" />
          <div className="os-hero-warp-layer os-hero-warp-l3" />
        </div>

        <div className="os-hero-grid" aria-hidden="true" />
        <div className="os-hero-nodes" aria-hidden="true">
          {HERO_NODES.map((n, i) => (
            <div
              key={i}
              className="os-hero-node"
              style={{
                left: n.left,
                top: n.top,
                width: n.size,
                height: n.size,
                animationDelay: n.delay,
              }}
            />
          ))}
        </div>

        <div className="os-hero-content">
          {/* <span className="os-hero-eyebrow">Odiseus Software · Cloud</span> */}
          <h1 id="os-hero-h1">
            Engineering <em>Cloud, AI,</em>
            <br />
            and Software Systems
            <br />
            That Scale
          </h1>
          {/* Full sentence kept on aria-label; words are written in on scroll. */}
          <p className="os-hero-sub" aria-label={HERO_PARAGRAPH}>
            {HERO_PARAGRAPH.split(" ").map((word, i) => (
              <Fragment key={i}>
                <span className="os-hero-word" aria-hidden="true">
                  {word}
                </span>{" "}
              </Fragment>
            ))}
          </p>
          <div className="os-hero-btns">
            <a href="/cloud" className="os-btn-primary">
              Explore Cloud Services
            </a>
            <a href="mailto:hr@odiseussoftware.com" className="os-btn-ghost">
              Start a Conversation
            </a>
          </div>
        </div>

        <div className="os-scroll-hint" aria-hidden="true">
          <span className="os-scroll-hint-label"></span>
          <span className="os-scroll-hint-bar" />
        </div>
      </section>
    </div>
  );
}

const KEYWORDS = [
  { label: "Cloud Engineering", hi: true },
  { label: "DevOps", hi: false },
  { label: "AI & GenAI", hi: true },
  { label: "Platform Engineering", hi: false },
  { label: "Data & Analytics", hi: false },
  { label: "Automation", hi: true },
  { label: "Security", hi: false },
  { label: "Business Analysis", hi: false },
  { label: "App Modernization", hi: true },
  { label: "Managed Operations", hi: false },
  { label: "MCP Servers", hi: false },
  { label: "AI Agents", hi: true },
];

function VisionSection() {
  return (
    /* Tall track pins the section while the pills scrub horizontally. */
    <div className="os-vision-track">
      <section className="os-vision">
        <div className="os-vision-inner">
          <span className="os-eyebrow" data-os-reveal>
            What we do
          </span>
          <h2 className="os-h2" data-os-reveal>
            Boutique. Senior. <em>Specialist.</em>
          </h2>
          <p className="os-vision-sub" data-os-reveal>
            We are a specialist technology partner — not a body shop, not a
            generalist firm. Every engagement is led by senior practitioners who
            have delivered at scale in exactly the discipline you need.
          </p>
        </div>

        {/* Full-bleed carousel — the row translates on vertical scroll. */}
        <div className="os-kw-viewport" data-os-reveal>
          <div className="os-kw-row">
            {KEYWORDS.map((kw) => (
              <span
                key={kw.label}
                className={`os-kw${kw.hi ? " os-kw-hi" : ""}`}
              >
                {kw.label}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function EcosystemMapSection() {
  return (
    /* Tall track pins the section while the brand core + nodes reveal. */
    <div className="os-eco-track">
      <section className="os-ecosystem" aria-labelledby="os-eco-h2">
        <div className="os-ecosystem-inner">
          {/* Heading group — zooms out + fades on scroll (hero-style). */}
          <div className="os-eco-head">
            <span className="os-eyebrow" data-os-reveal>
              Service Ecosystem
            </span>
            <h2 id="os-eco-h2" className="os-h2" data-os-reveal>
              Eight specialisms. <em>One partner.</em>
            </h2>
            <p className="os-eco-sub" data-os-reveal>
              Every domain connected — engineered to work together.
            </p>
          </div>

          <div className="os-eco-scroll" data-os-reveal>
            <svg
              className="os-eco-svg"
              viewBox="0 0 980 600"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Orbit guide ring */}
              <circle
                className="os-eco-ring"
                cx="490"
                cy="300"
                r="240"
                fill="none"
                stroke="rgba(26,78,255,0.1)"
                strokeWidth="1"
                strokeDasharray="3 10"
              />

              {/* Spokes from center (490, 300) */}
              {ECOSYSTEM_NODES.map((node, i) => (
                <line
                  key={`spoke-${i}`}
                  x1="490"
                  y1="300"
                  x2={node.cx}
                  y2={node.cy}
                  className="os-eco-line"
                  style={{ animationDelay: `${i * 0.6}s` }}
                />
              ))}

              {/* ── Center node (zooms in from depth first) ── */}
              <g className="os-eco-center">
                <circle
                  cx="490"
                  cy="300"
                  r="72"
                  fill="rgba(26,78,255,0.08)"
                  stroke="rgba(26,78,255,0.4)"
                  strokeWidth="1.5"
                />
                <circle
                  cx="490"
                  cy="300"
                  r="52"
                  fill="rgba(26,78,255,0.16)"
                  stroke="#1a4eff"
                  strokeWidth="1.5"
                >
                  <animate
                    attributeName="r"
                    values="52;56;52"
                    dur="4s"
                    repeatCount="indefinite"
                  />
                </circle>
                <text
                  x="490"
                  y="294"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="24"
                  fontFamily="Instrument Serif, serif"
                  fontStyle="italic"
                  fill="#ffffff"
                >
                  odiseus
                </text>
                <text
                  x="490"
                  y="316"
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="Geist Mono, monospace"
                  fill="rgba(255,255,255,0.38)"
                  letterSpacing="0.12em"
                >
                  SOFTWARE
                </text>
              </g>

              {/* ── Satellite nodes ── */}
              {ECOSYSTEM_NODES.map((node, i) => {
                const words = node.label.split(" ");
                const twoLine = words.length > 1;
                /* Vertical anchors: keep label + index inside the inner circle */
                const labelY = twoLine ? node.cy - 14 : node.cy - 5;
                const indexY = twoLine ? node.cy + 22 : node.cy + 16;

                /* Start the reveal pulled ~30% back toward the brand core so
                 each node slides outward into its final orbital slot. */
                const tx = (-(node.cx - 490) * 0.3).toFixed(1);
                const ty = (-(node.cy - 300) * 0.3).toFixed(1);

                return (
                  <g
                    key={`eco-node-${i}`}
                    className="os-eco-node"
                    style={{ "--os-tx": `${tx}px`, "--os-ty": `${ty}px` }}
                  >
                    {/* Outer halo */}
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r="52"
                      fill="rgba(26,78,255,0.06)"
                      stroke="rgba(26,78,255,0.22)"
                      strokeWidth="1.5"
                    />
                    {/* Inner pulsing circle */}
                    <circle
                      className="os-eco-core"
                      cx={node.cx}
                      cy={node.cy}
                      r="38"
                      fill="rgba(26,78,255,0.12)"
                      stroke="rgba(26,78,255,0.55)"
                      strokeWidth="1.5"
                    >
                      <animate
                        attributeName="r"
                        values="38;41;38"
                        dur={`${3.2 + i * 0.38}s`}
                        repeatCount="indefinite"
                      />
                    </circle>

                    {/* Label — split to two lines when multi-word */}
                    {twoLine ? (
                      <text
                        textAnchor="middle"
                        fontFamily="Geist Mono, monospace"
                        fontSize="10"
                        fill="rgba(255,255,255,0.92)"
                        letterSpacing="0.04em"
                      >
                        <tspan x={node.cx} y={labelY}>
                          {words[0]}
                        </tspan>
                        <tspan x={node.cx} dy="15">
                          {words[1]}
                        </tspan>
                      </text>
                    ) : (
                      <text
                        x={node.cx}
                        y={labelY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontFamily="Geist Mono, monospace"
                        fontSize="11"
                        fill="rgba(255,255,255,0.92)"
                        letterSpacing="0.04em"
                      >
                        {node.label}
                      </text>
                    )}

                    {/* Index badge */}
                    <text
                      x={node.cx}
                      y={indexY}
                      textAnchor="middle"
                      fontFamily="Geist Mono, monospace"
                      fontSize="9"
                      fill="rgba(26,78,255,0.85)"
                      letterSpacing="0.06em"
                    >
                      {`0${i + 1}`}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
}

/* Story scaffolding for each chapter — a concept line + a figure caption.
   Order matches CATEGORIES / CATEGORY_SVGS (01–08). */
const SVC_META = [
  {
    kicker: "From on-prem to cloud-native.",
    figure: "Fig.01 — Migration journey",
  },
  {
    kicker: "A pipeline that ships safely.",
    figure: "Fig.02 — Delivery pipeline",
  },
  {
    kicker: "Orchestrated, cloud-native foundations.",
    figure: "Fig.03 — Infrastructure fabric",
  },
  {
    kicker: "From data to inference.",
    figure: "Fig.04 — Model & inference flow",
  },
  { kicker: "Raw data into decisions.", figure: "Fig.05 — Insight pipeline" },
  { kicker: "Defence in depth.", figure: "Fig.06 — Layered protection" },
  {
    kicker: "Observe. Detect. Respond.",
    figure: "Fig.07 — Observability loop",
  },
  {
    kicker: "Monolith to microservices.",
    figure: "Fig.08 — Modernization path",
  },
];

function ServiceSection({ category, index }) {
  const flip = index % 2 !== 0;
  const darkSvg = DARK_SVG_IDX.has(index);
  const meta = SVC_META[index];
  const chapter = String(index + 1).padStart(2, "0");

  return (
    <section
      className={`os-svc-section${darkSvg ? " os-svc-dark" : ""}`}
      aria-labelledby={`os-svc-h2-${index}`}
      data-os-chapter={chapter}
    >
      <div className={`os-svc-inner${flip ? " os-flip" : ""}`}>
        {/* Story column */}
        <div className="os-svc-content">
          <div
            className="os-svc-chapter"
            data-os-reveal
            style={{ transitionDelay: "0ms" }}
          >
            <span className="os-svc-ch-num serif">{chapter}</span>
            <span className="os-svc-ch-line" aria-hidden="true" />
            <span className="os-svc-ch-label">Chapter {chapter} / 08</span>
          </div>

          <h2
            id={`os-svc-h2-${index}`}
            className="os-svc-h2"
            data-os-reveal
            style={{ transitionDelay: "70ms" }}
          >
            {category.title}
          </h2>
          <p
            className="os-svc-kicker serif"
            data-os-reveal
            style={{ transitionDelay: "140ms" }}
          >
            {meta.kicker}
          </p>
          <p
            className="os-svc-desc"
            data-os-reveal
            style={{ transitionDelay: "210ms" }}
          >
            {category.desc}
          </p>

          <div
            className="os-svc-cap-head"
            data-os-reveal
            style={{ transitionDelay: "280ms" }}
          >
            <span className="os-svc-cap-label">Capabilities</span>
            <span className="os-svc-cap-count mono">
              {String(category.services.length).padStart(2, "0")}
            </span>
          </div>
          <ul className="os-svc-caps" role="list">
            {category.services.map((name, i) => (
              <li
                key={name}
                className="os-svc-cap"
                data-os-reveal
                style={{ transitionDelay: `${320 + Math.min(i, 9) * 55}ms` }}
              >
                <span className="os-svc-cap-dot" aria-hidden="true" />
                <span className="os-svc-cap-name">{name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Sticky figure column */}
        <div className="os-svc-visual">
          <figure className="os-svc-figure">
            <div
              className={`os-svc-svg-wrap${darkSvg ? " os-dark" : ""}`}
              data-os-reveal
              style={{ transitionDelay: "120ms" }}
            >
              {CATEGORY_SVGS[index]}
            </div>
            <figcaption
              className="os-svc-figcap mono"
              data-os-reveal
              style={{ transitionDelay: "260ms" }}
            >
              <span className="os-svc-figcap-mark" aria-hidden="true" />
              {meta.figure}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

function JourneySection() {
  return (
    <section className="os-journey" aria-labelledby="os-journey-h2">
      <div className="os-journey-inner">
        <div className="os-journey-head">
          <span className="os-eyebrow" data-os-reveal>
            Cloud Transformation Journey
          </span>
          <h2 id="os-journey-h2" className="os-h2" data-os-reveal>
            From assessment to <em>continuous optimisation.</em>
          </h2>
        </div>

        <div className="os-journey-track">
          {JOURNEY_STEPS.map((step, i) => (
            <div
              key={step.idx}
              className="os-journey-step"
              data-os-reveal
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <div className="os-journey-node">
                <span className="os-journey-step-idx">{step.idx}</span>
              </div>
              <span className="os-journey-step-label">{step.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const ASIS = [
  "Manual, unpredictable releases",
  "High-risk integrations",
  "Missing observability",
  "Slow time-to-market",
];
const TOBE = [
  "Automated, safe deployments",
  "Independent micro-releases",
  "Full-stack observability",
  "Accelerated delivery",
];
const FW_STEPS = [
  "Discovery",
  "CI/CD",
  "IaC",
  "Monitoring",
  "DevSecOps",
  "Operations",
];

function DevOpsSection() {
  return (
    <section className="os-devops" aria-labelledby="os-devops-h2">
      <div className="os-devops-inner">
        <div className="os-devops-head">
          <span className="os-eyebrow" data-os-reveal>
            DevOps Transformation
          </span>
          <h2 id="os-devops-h2" className="os-h2" data-os-reveal>
            From chaos to <em>continuous delivery.</em>
          </h2>
        </div>

        <div className="os-devops-cols" data-os-reveal>
          {/* As-is */}
          <div className="os-devops-col">
            <span className="os-devops-col-label">As-is</span>
            {ASIS.map((item) => (
              <div key={item} className="os-devops-item">
                {item}
              </div>
            ))}
          </div>

          {/* Arrow */}
          <div className="os-devops-arrow-col" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 32 32">
              <line
                x1="4"
                y1="16"
                x2="28"
                y2="16"
                stroke="#1a4eff"
                strokeWidth="1.5"
              />
              <polygon
                points="28,11 32,16 28,21"
                fill="#1a4eff"
                opacity="0.8"
              />
            </svg>
          </div>

          {/* To-be */}
          <div className="os-devops-col">
            <span className="os-devops-col-label">To-be</span>
            {TOBE.map((item) => (
              <div key={item} className="os-devops-item os-pos">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="os-devops-framework" data-os-reveal>
          <span className="os-fw-eyebrow">Odiseus DevOps Framework</span>
          <div className="os-fw-steps">
            {FW_STEPS.map((step, i) => (
              <>
                <div key={step} className="os-fw-step">
                  <span className="os-fw-num">{`0${i + 1}`}</span>
                  <span className="os-fw-label">{step}</span>
                </div>
                {i < FW_STEPS.length - 1 && (
                  <span
                    key={`sep-${i}`}
                    className="os-fw-sep"
                    aria-hidden="true"
                  >
                    →
                  </span>
                )}
              </>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AILayerSection() {
  return (
    <section className="os-ai" aria-labelledby="os-ai-h2">
      <div className="os-ai-inner">
        <span className="os-eyebrow" data-os-reveal>
          AI &amp; Automation Layer
        </span>
        <h2 id="os-ai-h2" className="os-h2" data-os-reveal>
          Intelligence built into <em>every layer.</em>
        </h2>
        <p className="os-ai-sub" data-os-reveal>
          From strategy to production — we design and ship AI systems that
          integrate with your infrastructure, workflows, and data.
        </p>

        <div className="os-ai-grid">
          {AI_FEATURES.map((feat, i) => (
            <div
              key={feat.title}
              className="os-ai-card"
              data-os-reveal
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="os-ai-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="4" fill="#1a4eff" opacity="0.7" />
                  <circle
                    cx="9"
                    cy="9"
                    r="7"
                    stroke="#1a4eff"
                    strokeWidth="1"
                    opacity="0.4"
                  />
                </svg>
              </div>
              <div className="os-ai-title">{feat.title}</div>
              <div className="os-ai-desc">{feat.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MetricsSection() {
  return (
    <section className="os-metrics">
      <div className="os-metrics-inner">
        <span className="os-eyebrow" data-os-reveal>
          By the Numbers
        </span>
        <h2 className="os-h2" data-os-reveal>
          Built for scale, <em>delivered with precision.</em>
        </h2>
        <div className="os-stats-row">
          <div
            className="os-stat-item"
            data-os-reveal
            style={{ transitionDelay: "0ms" }}
          >
            <div className="os-stat-val">
              <span data-os-count="80">80</span>
              <span className="os-stat-sfx">+</span>
            </div>
            <div className="os-stat-label">
              Specialist services across 8 domains
            </div>
          </div>
          <div
            className="os-stat-item"
            data-os-reveal
            style={{ transitionDelay: "100ms" }}
          >
            <div className="os-stat-val">
              <span data-os-count="8">8</span>
            </div>
            <div className="os-stat-label">Core service domains</div>
          </div>
          <div
            className="os-stat-item"
            data-os-reveal
            style={{ transitionDelay: "200ms" }}
          >
            <div className="os-stat-val">
              <span data-os-count="2">2</span>
            </div>
            <div className="os-stat-label">
              Operating regions — Canada &amp; India
            </div>
          </div>
          <div
            className="os-stat-item"
            data-os-reveal
            style={{ transitionDelay: "300ms" }}
          >
            <div className="os-stat-val">
              <span>24</span>
              <span className="os-stat-sfx">/7</span>
            </div>
            <div className="os-stat-label">Scalable delivery mindset</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="os-cta-final" aria-labelledby="os-cta-h2">
      <div className="os-cta-glow" aria-hidden="true" />
      <div className="os-cta-inner">
        <span className="os-eyebrow" data-os-reveal>
          Get Started
        </span>
        <h2 id="os-cta-h2" className="os-h2" data-os-reveal>
          Build the next version of your <em>technology stack.</em>
        </h2>
        <p className="os-cta-sub" data-os-reveal>
          Tell us what you&apos;re building and we&apos;ll bring the right
          engineers, the right architecture, and the right experience.
        </p>
        <div className="os-cta-btns" data-os-reveal>
          <a href="/cloud" className="os-btn-primary">
            Explore Cloud Services
          </a>
          <a href="mailto:hr@odiseussoftware.com" className="os-btn-ghost">
            Start a Conversation
          </a>
        </div>
      </div>
    </section>
  );
}

function OsNav() {
  return (
    <nav
      className="site-nav os-nav-dark"
      id="mainNav"
      aria-label="Primary navigation"
    >
      <a className="nav-logo" href="/" aria-label="Odiseus home">
        <span className="nav-logo-dot"></span>
        <span>
          odiseus<em>.</em>
        </span>
      </a>

      <ul className="nav-center" role="list">
        <li>
          <a href="/" data-nav-link>
            Software
          </a>
        </li>
        <li className="nav-sep" aria-hidden="true">
          |
        </li>
        <li>
          <a href="/talent" data-nav-link>
            Talent
          </a>
        </li>
        <li className="nav-sep" aria-hidden="true">
          |
        </li>
        <li>
          <a href="/odiseus-cloud" className="active" data-nav-link>
            Cloud
          </a>
        </li>
      </ul>

      <div className="nav-right">
        <a href="mailto:hr@odiseussoftware.com" className="nav-cta">
          Start a conversation
        </a>
      </div>
    </nav>
  );
}

function OsFooter() {
  return (
    <footer>
      <div className="footer-top">
        <div>
          <div className="f-logo">
            <span className="nav-logo-dot"></span>
            odiseus<em>.</em>
          </div>
          <p className="f-tagline">
            Boutique consulting practice connecting Canadian enterprises with
            deep specialist expertise in DevOps, Cloud, AI, and business
            analysis.
          </p>

          <div className="f-office-label">CANADA — HEAD OFFICE</div>
          <div className="f-address">
            3392 Wonderland Rd S<br />
            London, ON N6L 1A8, Canada
            <br />
            <a href="mailto:info@odiseussoftware.com">
              info@odiseussoftware.com
            </a>
          </div>

          <div className="f-office-label">OFFSHORE — HYDERABAD, INDIA</div>
          <div className="f-address">
            <a
              href="https://share.google/aK4hTZOT1GE1kHdbS"
              target="_blank"
              rel="noopener noreferrer"
            >
              3rd Floor, Alcazar Mall, Plot No. 498,
              <br />
              Road No. 36, Venkatagiri,
              <br />
              Jubilee Hills, Hyderabad,
              <br />
              Telangana 500033
            </a>
          </div>
        </div>

        <div className="f-col">
          <h4>PRACTICE AREAS</h4>
          <ul>
            <li>
              <a href="#expertise">DevOps &amp; Platform</a>
            </li>
            <li>
              <a href="#expertise">Cloud Architecture</a>
            </li>
            <li>
              <a href="#expertise">AI &amp; Machine Learning</a>
            </li>
            <li>
              <a href="#expertise">Business Analysis</a>
            </li>
          </ul>
        </div>

        <div className="f-col">
          <h4>COMPANY</h4>
          <ul>
            <li>
              <a href="/">Odiseus Software</a>
            </li>
            <li>
              <a href="/talent">Odiseus Talent</a>
            </li>
            <li>
              <a href="/odiseus-cloud">Cloud</a>
            </li>
          </ul>
        </div>
        <div className="f-col">
          <h4>CONNECT</h4>
          <ul>
            <li>
              <a href="mailto:hr@odiseussoftware.com">Start a Conversation</a>
            </li>
            <li>
              <a href="mailto:info@odiseussoftware.com">Email Us</a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/company/odiseussoftware"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a href="#">Twitter / X</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="f-copy">
          © 2026 ODISEUS SOFTWARE INC · LONDON, ONTARIO · ALL RIGHTS RESERVED
        </span>
        <div className="f-socials">
          <a
            href="https://www.linkedin.com/company/odiseussoftware"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a href="#">Twitter / X</a>
          <a href="#">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════
   ROOT EXPORT
═══════════════════════════════════ */
export default function OdiseusStoryClient() {
  useRevealObserver();
  useCountUp();
  useCloudCursor();
  useAdaptiveNav();
  useHeroScroll();
  useEcosystemScroll();
  useVisionScroll();
  useServiceStory();

  return (
    <>
      {/* Cloud cursor — ring lags, cloud icon snaps */}
      <div id="osCRing" className="os-c-ring" aria-hidden="true" />
      <div id="osCCloud" className="os-c-cloud" aria-hidden="true">
        {/*
          viewBox 0 0 22 15 — all shapes have ≥1.5px clearance from every edge:
          left  cx=6  cy=10 r=4   → y∈[6,14]   x∈[2,10]
          main  cx=12 cy=7  r=5.5 → y∈[1.5,12.5] x∈[6.5,17.5]
          right cx=17 cy=10 r=3.5 → y∈[6.5,13.5] x∈[13.5,20.5]
          fill  x=2   y=10  → x∈[2,20] y∈[10,15]
        */}
        <svg
          viewBox="0 0 22 15"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="13"
        >
          <circle cx="6" cy="10" r="4" fill="#1a4eff" opacity="0.9" />
          <circle cx="12" cy="7" r="5.5" fill="#1a4eff" opacity="0.9" />
          <circle cx="17" cy="10" r="3.5" fill="#1a4eff" opacity="0.9" />
          <rect
            x="2"
            y="10"
            width="18"
            height="5"
            rx="1"
            fill="#1a4eff"
            opacity="0.9"
          />
        </svg>
      </div>

      <OsNav />
      <HeroSection />
      <VisionSection />
      <EcosystemMapSection />
      {CATEGORIES.map((cat, i) => (
        <ServiceSection key={cat.num} category={cat} index={i} />
      ))}
      <JourneySection />
      <DevOpsSection />
      <AILayerSection />
      <MetricsSection />
      <CTASection />
      <OsFooter />
    </>
  );
}
