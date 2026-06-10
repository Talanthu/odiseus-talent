"use client";

import { useEffect } from "react";
import GlowButton from "../components/GlowButton";

export default function TalentClient() {
  useEffect(() => {
    // ── Hero word scramble ──────────────────────────────────────────────
    const words = [
      "Cloud",
      "Data",
      "AI Agents",
      "AI Assistants",
      "MCP Servers",
    ];
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let wordIndex = 0;
    let scrambleTimer = null;

    function scrambleTo(el, word) {
      if (!el) return;
      if (scrambleTimer) clearInterval(scrambleTimer);

      let iteration = 0;
      scrambleTimer = setInterval(() => {
        el.textContent = word
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < Math.floor(iteration / 2)) return char;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");

        iteration += 1;

        if (iteration > word.length * 2 + 4) {
          clearInterval(scrambleTimer);
          scrambleTimer = null;
          el.textContent = word;
        }
      }, 55);
    }

    function cycleWord() {
      const el = document.getElementById("cycleWord");
      if (!el) return;
      wordIndex = (wordIndex + 1) % words.length;
      scrambleTo(el, words[wordIndex]);
    }

    const cycleInterval = setInterval(cycleWord, 2200);

    // ── Mobile navigation ───────────────────────────────────────────────
    const navToggle = document.getElementById("navToggle");
    const navMenu = document.getElementById("navMenu");
    const mainNav = document.getElementById("mainNav");

    function closeNav() {
      if (!navToggle || !navMenu) return;
      navMenu.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation menu");
      document.body.classList.remove("nav-open");
    }

    function openNav() {
      if (!navToggle || !navMenu || !mainNav) return;

      const navH = Math.round(mainNav.getBoundingClientRect().height);
      document.documentElement.style.setProperty("--nav-h", `${navH}px`);

      navMenu.classList.add("open");
      navToggle.classList.add("open");
      navToggle.setAttribute("aria-expanded", "true");
      navToggle.setAttribute("aria-label", "Close navigation menu");
      document.body.classList.add("nav-open");
    }

    const navListeners = [];
    if (navToggle && navMenu && mainNav) {
      const toggleHandler = (event) => {
        event.stopPropagation();
        navMenu.classList.contains("open") ? closeNav() : openNav();
      };
      navToggle.addEventListener("click", toggleHandler);
      navListeners.push([navToggle, "click", toggleHandler]);

      const linkHandlers = [];
      navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeNav);
        linkHandlers.push(link);
      });

      const keyHandler = (event) => {
        if (event.key === "Escape" && navMenu.classList.contains("open")) {
          closeNav();
          navToggle.focus();
        }
      };
      document.addEventListener("keydown", keyHandler);
      navListeners.push([document, "keydown", keyHandler]);

      const docClickHandler = (event) => {
        if (
          navMenu.classList.contains("open") &&
          !mainNav.contains(event.target)
        ) {
          closeNav();
        }
      };
      document.addEventListener("click", docClickHandler);
      navListeners.push([document, "click", docClickHandler]);

      const resizeHandler = () => {
        if (window.innerWidth > 768) closeNav();
      };
      window.addEventListener("resize", resizeHandler);
      navListeners.push([window, "resize", resizeHandler]);

      navListeners.push(["__navLinks__", null, linkHandlers]);
    }

    // ── Role filters ────────────────────────────────────────────────────
    const filterButtons = document.querySelectorAll(".filter-btn[data-filter]");
    const roleRows = document.querySelectorAll(".role-row[data-category]");
    const filterHandlers = [];

    filterButtons.forEach((button) => {
      const handler = () => {
        const filter = button.dataset.filter || "all";

        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        roleRows.forEach((row) => {
          const category = row.dataset.category;
          const shouldShow = filter === "all" || category === filter;
          row.classList.toggle("is-hidden", !shouldShow);
        });
      };
      button.addEventListener("click", handler);
      filterHandlers.push([button, handler]);
    });

    // ── Custom cursor on desktop/fine pointer only ──────────────────────
    const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const dot = document.getElementById("cDot");
    const ring = document.getElementById("cRing");

    let rafId = null;
    let mouseMoveHandler = null;
    let cursorEnabled = false;

    if (supportsFinePointer && !prefersReducedMotion && dot && ring) {
      document.body.classList.add("custom-cursor-enabled");
      cursorEnabled = true;

      let mouseX = 0;
      let mouseY = 0;
      let ringX = 0;
      let ringY = 0;

      mouseMoveHandler = (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
      };
      document.addEventListener("mousemove", mouseMoveHandler);

      const animateCursor = () => {
        ringX += (mouseX - ringX) * 0.13;
        ringY += (mouseY - ringY) * 0.13;

        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;

        rafId = requestAnimationFrame(animateCursor);
      };

      animateCursor();
    }

    // ── Scroll reveal ───────────────────────────────────────────────────
    const revealElements = document.querySelectorAll(".reveal");
    let observer = null;

    if ("IntersectionObserver" in window && revealElements.length) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
      );

      revealElements.forEach((el) => observer.observe(el));
    } else {
      revealElements.forEach((el) => el.classList.add("in"));
    }

    // ── Cleanup on unmount ──────────────────────────────────────────────
    return () => {
      clearInterval(cycleInterval);
      if (scrambleTimer) clearInterval(scrambleTimer);

      navListeners.forEach(([target, type, handler]) => {
        if (target === "__navLinks__") {
          handler.forEach((link) =>
            link.removeEventListener("click", closeNav),
          );
        } else {
          target.removeEventListener(type, handler);
        }
      });

      filterHandlers.forEach(([button, handler]) =>
        button.removeEventListener("click", handler),
      );

      if (rafId) cancelAnimationFrame(rafId);
      if (mouseMoveHandler)
        document.removeEventListener("mousemove", mouseMoveHandler);
      if (cursorEnabled)
        document.body.classList.remove("custom-cursor-enabled");

      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <>
      <div className="cursor" aria-hidden="true">
        <div className="c-dot" id="cDot"></div>
        <div className="c-ring" id="cRing"></div>
      </div>

      {/* NAV */}
      <nav className="site-nav" id="mainNav" aria-label="Primary navigation">
        <a className="nav-logo" href="/talent" aria-label="Odiseus Talent home">
          <span className="nav-logo-dot"></span>
          <span>
            Odiseus <em className="nav-logo-talent">Talent</em>
          </span>
        </a>

        <ul className="nav-center" id="navMenu" role="list">
          <li>
            <a href="/" data-nav-link>
              Software
            </a>
          </li>
          <li className="nav-sep" aria-hidden="true">
            |
          </li>
          <li>
            <a href="/talent" className="active" data-nav-link>
              Talent
            </a>
          </li>
          <li className="nav-sep" aria-hidden="true">
            |
          </li>
          <li>
            <a href="/odiseus-cloud" data-nav-link>
              Cloud
            </a>
          </li>
        </ul>

        <div className="nav-right">
          <GlowButton href="#cta" variant="dark" className="nav-cta">
            Start a Conversation
          </GlowButton>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-body">
          <div className="hero-pill">
            <div className="pill-dot"></div>
            <span className="pill-text">
              LONDON, ONTARIO · TECH TALENT SPECIALISTS · SINCE 2019
            </span>
          </div>

          <h1 className="hero-h1">
            The engineers who build
            <br />
            tomorrow&apos;s{" "}
            <span id="cycleWord" className="italic">
              Cloud
            </span>
            <br />— found.
          </h1>

          <p className="hero-sub">
            Odiseus Talent connects DevOps, Cloud, Data, and AI engineers with
            companies building the future — in Canada, USA and beyond.
          </p>

          <div className="hero-ctas">
            <GlowButton href="#roles" variant="dark" className="btn-dark">
              Browse Open Roles
            </GlowButton>
            <GlowButton href="#specialisms" variant="outline" className="btn-outline">
              Our Specialisms
            </GlowButton>
          </div>
        </div>

        <div className="hero-stats" aria-label="Odiseus Talent key metrics">
          <div className="hstat">
            <div className="hstat-num">
              <span>187</span>+
            </div>
            <div className="hstat-label">Tech placements made</div>
            <div className="hstat-mono">// since 2021</div>
          </div>
          <div className="hstat">
            <div className="hstat-num">
              <span>12</span>w
            </div>
            <div className="hstat-label">Average time-to-offer</div>
            <div className="hstat-mono">// target timeline</div>
          </div>
          <div className="hstat">
            <div className="hstat-num">
              <span>92</span>%
            </div>
            <div className="hstat-label">6-month retention</div>
            <div className="hstat-mono">// roles filled</div>
          </div>
          <div className="hstat">
            <div className="hstat-num">
              <span>140</span>+
            </div>
            <div className="hstat-label">Tech clients</div>
            <div className="hstat-mono">// active partners</div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker-inner">
          <span className="ticker-item">
            <span className="tag tag-devops">DevOps</span> Platform Engineer
          </span>
          <span className="ticker-item">
            <span className="tag tag-cloud">Cloud</span> AWS Solutions Architect
          </span>
          <span className="ticker-item">
            <span className="tag tag-ai">AI</span> ML Engineer — RAG &amp; LLMs
          </span>
          <span className="ticker-item">
            <span className="tag tag-devops">DevOps</span> Site Reliability
            Engineer
          </span>
          <span className="ticker-item">
            <span className="tag tag-cloud">Cloud</span> GCP Infrastructure Lead
          </span>
          <span className="ticker-item">
            <span className="tag tag-ai">AI</span> LLMOps Specialist
          </span>
          <span className="ticker-item">
            <span className="tag tag-devops">DevOps</span> Kubernetes Engineer
          </span>
          <span className="ticker-item">
            <span className="tag tag-cloud">Cloud</span> Azure Architect
          </span>
          <span className="ticker-item">
            <span className="tag tag-ai">AI</span> Data Scientist
          </span>

          <span className="ticker-item">
            <span className="tag tag-devops">DevOps</span> Platform Engineer
          </span>
          <span className="ticker-item">
            <span className="tag tag-cloud">Cloud</span> AWS Solutions Architect
          </span>
          <span className="ticker-item">
            <span className="tag tag-ai">AI</span> ML Engineer — RAG &amp; LLMs
          </span>
          <span className="ticker-item">
            <span className="tag tag-devops">DevOps</span> Site Reliability
            Engineer
          </span>
          <span className="ticker-item">
            <span className="tag tag-cloud">Cloud</span> GCP Infrastructure Lead
          </span>
          <span className="ticker-item">
            <span className="tag tag-ai">AI</span> LLMOps Specialist
          </span>
          <span className="ticker-item">
            <span className="tag tag-devops">DevOps</span> Kubernetes Engineer
          </span>
          <span className="ticker-item">
            <span className="tag tag-cloud">Cloud</span> Azure Architect
          </span>
          <span className="ticker-item">
            <span className="tag tag-ai">AI</span> Data Scientist
          </span>
        </div>
      </div>

      {/* MARKET INTELLIGENCE */}
      <section className="market" id="market">
        <div className="market-head reveal">
          <div className="eyebrow">// MARKET_DEMAND_REPORT</div>
          <h2 className="market-h2">
            Where the talent market
            <br />
            <em>is moving.</em>
          </h2>
        </div>

        <div className="market-tier reveal">
          <div className="tier-label tier-label--hot">
            TIER 1 — HOTTEST DEMAND
          </div>
          <div className="demand-grid">
            <article className="demand-card">
              <span className="demand-badge demand-badge--hot">
                Hottest demand
              </span>
              <div className="demand-role">
                Cybersecurity Engineer / Analyst
              </div>
              <p className="demand-stat">
                Security hiring continues to accelerate as every digital
                transformation program needs protection by design.
              </p>
              <div className="demand-skills">
                <span className="spec-tag">CISSP</span>
                <span className="spec-tag">CCNP</span>
                <span className="spec-tag">Cloud security</span>
                <span className="spec-tag">Zero Trust</span>
                <span className="spec-tag">SIEM/SOAR</span>
              </div>
              <div className="demand-salary">
                <span>Salary range</span>CAD $83K–$140K
              </div>
            </article>

            <article className="demand-card">
              <span className="demand-badge demand-badge--hot">
                Hottest demand
              </span>
              <div className="demand-role">AI / ML Engineer</div>
              <p className="demand-stat">
                LLM, RAG, and applied AI teams need engineers who can move
                models from pilots into production systems.
              </p>
              <div className="demand-skills">
                <span className="spec-tag">PyTorch</span>
                <span className="spec-tag">LLM fine-tuning</span>
                <span className="spec-tag">MLOps</span>
                <span className="spec-tag">Python</span>
                <span className="spec-tag">RAG</span>
              </div>
              <div className="demand-salary">
                <span>Salary range</span>CAD $116K–$190K
              </div>
            </article>

            <article className="demand-card">
              <span className="demand-badge demand-badge--hot">
                Hottest demand
              </span>
              <div className="demand-role">Cloud Engineer / Architect</div>
              <p className="demand-stat">
                Cloud adoption keeps expanding across Canadian industries, with
                demand for architecture and cost control.
              </p>
              <div className="demand-skills">
                <span className="spec-tag">AWS</span>
                <span className="spec-tag">Azure</span>
                <span className="spec-tag">Terraform</span>
                <span className="spec-tag">GCP</span>
                <span className="spec-tag">FinOps</span>
              </div>
              <div className="demand-salary">
                <span>Salary range</span>CAD $100K–$160K
              </div>
            </article>
          </div>
        </div>

        <div className="market-tier reveal">
          <div className="tier-label tier-label--growing">
            TIER 2 — STRONG, CONSISTENT ORGANIC HIRING
          </div>
          <div className="demand-grid">
            <article className="demand-card">
              <span className="demand-badge demand-badge--growing">
                Growing
              </span>
              <div className="demand-role">DevOps / Platform Engineer</div>
              <p className="demand-stat">
                Demand driven by transformation programs — CI/CD, platform, and
                IaC skills remain critical.
              </p>
              <div className="demand-skills">
                <span className="spec-tag">Kubernetes</span>
                <span className="spec-tag">CI/CD</span>
                <span className="spec-tag">GitHub Actions</span>
                <span className="spec-tag">Ansible</span>
              </div>
              <div className="demand-salary">
                <span>Salary range</span>CAD $90K–$145K
              </div>
            </article>

            <article className="demand-card">
              <span className="demand-badge demand-badge--growing">
                Growing
              </span>
              <div className="demand-role">Data Scientist / Data Engineer</div>
              <p className="demand-stat">
                Analytics and ML pipelines are in demand across SaaS, fintech,
                healthcare, and enterprise teams.
              </p>
              <div className="demand-skills">
                <span className="spec-tag">SQL</span>
                <span className="spec-tag">Spark</span>
                <span className="spec-tag">dbt</span>
                <span className="spec-tag">Tableau</span>
                <span className="spec-tag">Python</span>
              </div>
              <div className="demand-salary">
                <span>Salary range</span>CAD $85K–$140K
              </div>
            </article>

            <article className="demand-card">
              <span className="demand-badge demand-badge--growing">
                Growing
              </span>
              <div className="demand-role">Solutions Architect</div>
              <p className="demand-stat">
                Architects are needed to connect product goals, infrastructure
                decisions, and scalable delivery.
              </p>
              <div className="demand-skills">
                <span className="spec-tag">TOGAF</span>
                <span className="spec-tag">AWS SA cert</span>
                <span className="spec-tag">Microservices</span>
                <span className="spec-tag">API design</span>
              </div>
              <div className="demand-salary">
                <span>Salary range</span>CAD $110K–$170K
              </div>
            </article>
          </div>
        </div>

        <div className="market-tier reveal">
          <div className="tier-label tier-label--steady">
            TIER 3 — STABLE, SPECIALIST NICHES
          </div>
          <div className="demand-grid">
            <article className="demand-card">
              <span className="demand-badge demand-badge--steady">Steady</span>
              <div className="demand-role">
                Software Engineer (Full-stack / Backend)
              </div>
              <p className="demand-stat">
                Strong demand continues for product engineers who can build
                reliable systems and ship quickly.
              </p>
              <div className="demand-skills">
                <span className="spec-tag">Node.js</span>
                <span className="spec-tag">React</span>
                <span className="spec-tag">Golang</span>
                <span className="spec-tag">Microservices</span>
              </div>
              <div className="demand-salary">
                <span>Salary range</span>CAD $80K–$135K
              </div>
            </article>

            <article className="demand-card">
              <span className="demand-badge demand-badge--steady">Steady</span>
              <div className="demand-role">Business Systems Analyst</div>
              <p className="demand-stat">
                AI and cloud programs need translators who can clarify
                requirements and align stakeholders.
              </p>
              <div className="demand-skills">
                <span className="spec-tag">SQL</span>
                <span className="spec-tag">Tableau</span>
                <span className="spec-tag">Agile</span>
                <span className="spec-tag">Stakeholder mgmt</span>
              </div>
              <div className="demand-salary">
                <span>Salary range</span>CAD $70K–$110K
              </div>
            </article>

            <article className="demand-card">
              <span className="demand-badge demand-badge--steady">Steady</span>
              <div className="demand-role">IT Support / Infrastructure</div>
              <p className="demand-stat">
                Core infrastructure roles remain essential as cloud migration
                and modernization projects expand.
              </p>
              <div className="demand-skills">
                <span className="spec-tag">CompTIA A+</span>
                <span className="spec-tag">CCNP</span>
                <span className="spec-tag">Azure AD</span>
              </div>
              <div className="demand-salary">
                <span>Salary range</span>CAD $50K–$85K
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* SPECIALISMS */}
      <section className="specialisms" id="specialisms">
        <div className="spec-header reveal">
          <div>
            <div className="eyebrow">// OUR_SPECIALISMS</div>
            <h2 className="spec-h2">
              Three domains.
              <br />
              <em>Deep expertise.</em>
            </h2>
          </div>
        </div>

        <div className="spec-grid reveal">
          <article className="spec-card">
            <div className="spec-icon">⚙️</div>
            <div className="spec-title">DevOps &amp; Platform</div>
            <p className="spec-body">
              From CI/CD pipelines to internal developer platforms, we place the
              engineers who keep software shipping fast and reliably. We know
              the toolchain inside out.
            </p>
            <div className="spec-tags">
              <span className="spec-tag">Kubernetes</span>
              <span className="spec-tag">Terraform</span>
              <span className="spec-tag">GitHub Actions</span>
              <span className="spec-tag">ArgoCD</span>
              <span className="spec-tag">Helm</span>
              <span className="spec-tag">SRE</span>
              <span className="spec-tag">Platform Eng</span>
            </div>
          </article>

          <article className="spec-card">
            <div className="spec-icon">☁️</div>
            <div className="spec-title">Cloud Infrastructure</div>
            <p className="spec-body">
              Multi-cloud architects, FinOps specialists, and cloud-native
              engineers for AWS, GCP, and Azure — from individual contributors
              to cloud centre-of-excellence leads.
            </p>
            <div className="spec-tags">
              <span className="spec-tag">AWS</span>
              <span className="spec-tag">GCP</span>
              <span className="spec-tag">Azure</span>
              <span className="spec-tag">FinOps</span>
              <span className="spec-tag">Cloud Security</span>
              <span className="spec-tag">IaC</span>
            </div>
          </article>

          <article className="spec-card">
            <div className="spec-icon">🧠</div>
            <div className="spec-title">AI &amp; Machine Learning</div>
            <p className="spec-body">
              ML Engineers, MLOps, LLM specialists, and AI Product Managers. We
              understand the full stack from model training to production
              inference and RAG pipelines.
            </p>
            <div className="spec-tags">
              <span className="spec-tag">PyTorch</span>
              <span className="spec-tag">MLflow</span>
              <span className="spec-tag">LangChain</span>
              <span className="spec-tag">Vertex AI</span>
              <span className="spec-tag">SageMaker</span>
              <span className="spec-tag">RAG</span>
              <span className="spec-tag">LLMOps</span>
            </div>
          </article>
        </div>
      </section>

      {/* OPEN ROLES */}
      <section className="roles" id="roles">
        <div className="roles-head reveal">
          <div>
            <div className="eyebrow">// ACTIVE_SEARCHES</div>
            <h2 className="roles-h2">
              Featured <em>open roles.</em>
            </h2>
          </div>

          <div className="roles-filters" aria-label="Filter open roles">
            <button
              className="filter-btn active"
              type="button"
              data-filter="all"
            >
              All
            </button>
            <button className="filter-btn" type="button" data-filter="devops">
              DevOps
            </button>
            <button className="filter-btn" type="button" data-filter="cloud">
              Cloud
            </button>
            <button className="filter-btn" type="button" data-filter="ai">
              AI
            </button>
          </div>
        </div>

        <div className="roles-list reveal" aria-live="polite">
          <article className="role-row" data-category="devops">
            <span className="role-badge badge-devops">DevOps</span>
            <div className="role-info">
              <div className="role-title-text">Senior Platform Engineer</div>
              <div className="role-co">FinTech Scale-up · Series C</div>
            </div>
            <div className="role-meta">
              <div className="role-loc">New York, NY (Hybrid)</div>
              <div className="role-sal">$145–175K CAD</div>
              <div className="role-arrow" aria-hidden="true">
                →
              </div>
            </div>
          </article>

          <article className="role-row" data-category="ai">
            <span className="role-badge badge-ai">AI</span>
            <div className="role-info">
              <div className="role-title-text">ML Engineer — LLM &amp; RAG</div>
              <div className="role-co">AI Product Company · San Francisco</div>
            </div>
            <div className="role-meta">
              <div className="role-loc">Remote-Friendly (US / Canada)</div>
              <div className="role-sal">$155–195K CAD</div>
              <div className="role-arrow" aria-hidden="true">
                →
              </div>
            </div>
          </article>

          <article className="role-row" data-category="cloud">
            <span className="role-badge badge-cloud">Cloud</span>
            <div className="role-info">
              <div className="role-title-text">AWS Solutions Architect</div>
              <div className="role-co">Enterprise Retail · Seattle</div>
            </div>
            <div className="role-meta">
              <div className="role-loc">Seattle, WA (Onsite)</div>
              <div className="role-sal">$160–190K CAD</div>
              <div className="role-arrow" aria-hidden="true">
                →
              </div>
            </div>
          </article>

          <article className="role-row" data-category="devops">
            <span className="role-badge badge-devops">DevOps</span>
            <div className="role-info">
              <div className="role-title-text">
                Site Reliability Engineer (SRE)
              </div>
              <div className="role-co">Banking Platform · New York</div>
            </div>
            <div className="role-meta">
              <div className="role-loc">Austin, TX (Hybrid)</div>
              <div className="role-sal">$140–170K CAD</div>
              <div className="role-arrow" aria-hidden="true">
                →
              </div>
            </div>
          </article>

          <article className="role-row" data-category="ai">
            <span className="role-badge badge-ai">AI</span>
            <div className="role-info">
              <div className="role-title-text">Director of AI Engineering</div>
              <div className="role-co">Health-Tech Startup · Chicago</div>
            </div>
            <div className="role-meta">
              <div className="role-loc">Chicago, IL</div>
              <div className="role-sal">$200–240K CAD</div>
              <div className="role-arrow" aria-hidden="true">
                →
              </div>
            </div>
          </article>

          <article className="role-row" data-category="cloud">
            <span className="role-badge badge-cloud">Cloud</span>
            <div className="role-info">
              <div className="role-title-text">
                FinOps &amp; Cloud Cost Strategist
              </div>
              <div className="role-co">Multi-cloud Enterprise · Remote</div>
            </div>
            <div className="role-meta">
              <div className="role-loc">Hybrid · Remote</div>
              <div className="role-sal">$130–155K CAD</div>
              <div className="role-arrow" aria-hidden="true">
                →
              </div>
            </div>
          </article>
        </div>

        <div className="see-all">
          <a href="#cta">Sign up to browse all 38+ open roles</a>
        </div>
      </section>

      {/* WHY US */}
      <section className="why" id="why">
        <div className="why-content reveal">
          <div className="eyebrow">// WHY_ODISEUS</div>
          <h2 className="why-h2">
            We speak <em>engineer,</em>
            <br />
            not just recruiter.
          </h2>
          <p className="why-p">
            We&apos;re active in AI communities and university ecosystems
            identifying rising talent before they hit the job market. Our
            strength lies in career advisory: we know how to shape candidates to
            meet employer expectations, not just match job descriptions.
          </p>

          <div className="why-items">
            <div className="why-item">
              <div className="why-icon">🎯</div>
              <div className="why-item-text">
                <strong>Specialist Networks Only</strong>
                <span>
                  Our talent pools are mapped specifically to cloud-native and
                  AI engineering communities — no generalist noise.
                </span>
              </div>
            </div>

            <div className="why-item">
              <div className="why-icon">⚡</div>
              <div className="why-item-text">
                <strong>12-Week Average to Offer</strong>
                <span>
                  Speed matters in a competitive market. Our process is built to
                  move fast without sacrificing quality or fit.
                </span>
              </div>
            </div>

            <div className="why-item">
              <div className="why-icon">🔁</div>
              <div className="why-item-text">
                <strong>90-Day Guarantee</strong>
                <span>
                  If a placed candidate leaves within 90 days, we replace at no
                  additional cost.
                </span>
              </div>
            </div>

            <div className="why-item">
              <div className="why-icon">📍</div>
              <div className="why-item-text">
                <strong>London, ON HQ — North America Reach</strong>
                <span>
                  Headquartered in London, Ontario with active candidate
                  pipelines across Canada, the US, and offshore.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="process" id="process">
        <div className="process-head reveal">
          <div className="eyebrow">// HOW_IT_WORKS</div>
          <h2 className="process-h2">
            Built for speed.
            <br />
            <em>Optimised for fit.</em>
          </h2>
        </div>

        <div className="process-steps reveal">
          <article className="p-step" data-num="01">
            <div className="p-step-num">01 / BRIEF</div>
            <div className="p-step-title">Technical Discovery</div>
            <div className="p-step-body">
              We go deep on your stack, team culture, and growth roadmap so
              every search starts with full alignment.
            </div>
          </article>

          <article className="p-step" data-num="02">
            <div className="p-step-num">02 / SEARCH</div>
            <div className="p-step-title">Targeted Outreach</div>
            <div className="p-step-body">
              We tap specialist networks and reach passively-employed engineers
              who may not respond to generic outreach.
            </div>
          </article>

          <article className="p-step" data-num="03">
            <div className="p-step-num">03 / SHORTLIST</div>
            <div className="p-step-title">Curated Slate</div>
            <div className="p-step-body">
              A handpicked shortlist of 3–5 candidates with scorecards,
              technical assessments, and our honest read.
            </div>
          </article>

          <article className="p-step" data-num="04">
            <div className="p-step-num">04 / CLOSE</div>
            <div className="p-step-title">Offer &amp; Onboard</div>
            <div className="p-step-body">
              We manage compensation conversations, references, and stay engaged
              through the first 90 days.
            </div>
          </article>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="testimonial" id="testimonial">
        <div className="reveal">
          <div className="eyebrow">// CLIENT_STORY</div>
          <h2 className="testi-h2">
            When the right hire
            <br />
            <em>changes everything.</em>
          </h2>
          <p className="testi-p">
            Our clients come to us when they need engineers who are genuinely
            hard to find — and they stay because we find them.
          </p>
        </div>

        <figure className="quote-wrap reveal">
          <blockquote className="q-text">
            Odiseus placed our entire DevOps team — five engineers in under two
            months. They understood Kubernetes and GitOps better than most
            engineers I&apos;ve interviewed. This wasn&apos;t a recruiter, it
            was a technical partner.
          </blockquote>

          <figcaption className="q-author">
            <div className="q-avatar">R</div>
            <div>
              <div className="q-name">Rohan Mehta</div>
              <div className="q-role">
                VP Engineering · Covalent Labs, Toronto
              </div>
            </div>
          </figcaption>

          <div className="q-rating">
            <div className="q-metric">
              <strong>5</strong>
              <span>engineers placed</span>
            </div>
            <div className="q-metric">
              <strong>52d</strong>
              <span>total timeline</span>
            </div>
            <div className="q-metric">
              <strong>100%</strong>
              <span>still at company</span>
            </div>
          </div>
        </figure>
      </section>

      {/* CTA */}
      <section className="cta-section" id="cta">
        <div className="cta-blob"></div>
        <div className="eyebrow">// LET&apos;S_BUILD_TOGETHER</div>
        <h2 className="cta-h2">
          Find the engineer
          <br />
          <em>you can&apos;t find yourself.</em>
        </h2>
        <p className="cta-p">
          Whether you&apos;re scaling a platform team or finding a singular AI
          architect, we&apos;d love to hear your challenge.
        </p>
        <div className="cta-btns">
          <GlowButton
            href="mailto:info@odiseussoftware.com"
            variant="dark"
            className="btn-dark"
          >
            Start a Conversation
          </GlowButton>
          <GlowButton href="#roles" variant="outline" className="btn-outline">
            Browse Roles
          </GlowButton>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-top">
          <div>
            <div className="f-logo">
              <span className="nav-logo-dot"></span>Odiseus Talent
            </div>
            <p className="f-tagline">
              Recruitment partner for DevOps, Cloud Infrastructure, Data, and AI
              engineering.
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
            <h4>SPECIALISMS</h4>
            <ul>
              <li>
                <a href="#specialisms">DevOps &amp; Platform</a>
              </li>
              <li>
                <a href="#specialisms">Cloud Infrastructure</a>
              </li>
              <li>
                <a href="#specialisms">AI &amp; Machine Learning</a>
              </li>
              <li>
                <a href="#market">Data Engineering</a>
              </li>
              <li>
                <a href="#market">Cloud Security</a>
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
                <a href="#why">Why Odiseus</a>
              </li>
              <li>
                <a href="#process">Process</a>
              </li>
            </ul>
          </div>

          <div className="f-col">
            <h4>FOR CANDIDATES</h4>
            <ul>
              <li>
                <a href="#roles">Open Roles</a>
              </li>
              <li>
                <a href="#cta">Submit Your CV</a>
              </li>
              <li>
                <a href="#market">Salary Benchmarks</a>
              </li>
              <li>
                <a href="#cta">Career Advice</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="f-copy">
            © 2026 ODISEUS TALENT INC · LONDON, ONTARIO · ALL RIGHTS RESERVED
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
    </>
  );
}
