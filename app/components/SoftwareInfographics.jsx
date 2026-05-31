"use client";

import { useEffect, useRef } from "react";

/* ─── shared observer hook ─── */
function useRevealObserver() {
  const observerRef = useRef(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        el.classList.add("in-view");
      });
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observerRef.current.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    document.querySelectorAll("[data-reveal]").forEach((el) => {
      observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);
}

/* ─── count-up for #network stats ─── */
function useCountUp() {
  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const targets = [
      { selector: '[data-countup="200"]', end: 200 },
      { selector: '[data-countup="5"]', end: 5 },
      { selector: '[data-countup="7"]', end: 7 },
      { selector: '[data-countup="96"]', end: 96 },
    ];

    if (prefersReduced) return; // final values already in DOM

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const end = parseInt(el.dataset.countup, 10);
          const duration = 1200;
          const start = performance.now();

          function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * end);
            if (progress < 1) requestAnimationFrame(tick);
          }

          requestAnimationFrame(tick);
          observer.unobserve(el);
        });
      },
      { threshold: 0.5 },
    );

    targets.forEach(({ selector }) => {
      const el = document.querySelector(selector);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
}

/* ═══════════════════════════════════════════
   SECTION 2 — Portfolio / Cloud Solutions
═══════════════════════════════════════════ */
const cloudCapabilities = [
  "App / DB Modernization",
  "Data Analytics",
  "GenAI / AI-ML",
  "DevOps",
  "Serverless",
  "Security",
  "BCP / DR",
  "Database Performance",
  "VDI",
  "Data Warehouse",
];

const pills = [
  "Cost Optimization",
  "Security as a Service",
  "Well-Architected Review",
  "Next-Gen Managed Service",
];

function PortfolioSection() {
  return (
    <section className="ig-portfolio" aria-labelledby="ig-portfolio-heading">
      <div className="ig-inner">
        <div className="ig-section-head" data-reveal>
          <div className="eyebrow mono ig-eyebrow">What we build</div>
          <h2 id="ig-portfolio-heading" className="ig-h2">
            From data center to <em>cloud-native.</em>
          </h2>
          <p className="ig-sub">
            We guide organisations across the full transformation journey — from
            on-premises infrastructure to modern cloud architectures.
          </p>
        </div>

        {/* Flow band */}
        <div className="ig-flow-band" data-reveal>
          <div className="ig-flow-node ig-flow-origin">
            <div className="ig-flow-label mono">Not on cloud</div>
            <div className="ig-flow-tiles">
              <div className="ig-tile mono">Physical Data Center</div>
              <div className="ig-tile mono">Native Cloud</div>
              <div className="ig-tile mono">On-Prem Servers</div>
            </div>
          </div>

          {/* connector */}
          <div className="ig-connector" aria-hidden="true">
            <svg
              className="ig-connector-svg"
              viewBox="0 0 160 40"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                className="ig-line-draw"
                x1="0"
                y1="20"
                x2="148"
                y2="20"
                stroke="var(--blue)"
                strokeWidth="1"
              />
              <polygon
                points="148,14 160,20 148,26"
                fill="var(--blue)"
                opacity="0.7"
              />
            </svg>
            <div className="ig-connector-label mono">
              Digital Transformation Advisory · Well-Architected Framework
            </div>
          </div>

          <div className="ig-flow-node ig-flow-dest">
            <div className="ig-flow-label mono">On cloud</div>
            <div className="ig-cap-grid">
              {cloudCapabilities.map((cap, i) => (
                <div
                  key={cap}
                  className="ig-cap-cell"
                  style={{ transitionDelay: `${i * 50}ms` }}
                  data-reveal
                >
                  <span className="mono">{cap}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Foot pills */}
        <div className="ig-pills" data-reveal>
          {pills.map((p) => (
            <span key={p} className="ig-pill mono">
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 3 — DevOps Transformation Staircase
═══════════════════════════════════════════ */
const steps = [
  "Discovery",
  "Transformation",
  "Continuous Integration",
  "Continuous Deployment",
  "DevSecOps",
  "Operations",
];

const asIs = [
  "Unpredictable velocity",
  "Manual testing",
  "High-risk integration",
  "Big interdependent releases",
];

const toBe = [
  "Faster GTM",
  "Automated testing",
  "Low-risk releases",
  "Independent micro-releases",
];

function DevOpsSection() {
  return (
    <section className="ig-devops" aria-labelledby="ig-devops-heading">
      <div className="ig-inner">
        <div className="ig-section-head" data-reveal>
          <div className="eyebrow mono ig-eyebrow">DevOps transformation</div>
          <h2 id="ig-devops-heading" className="ig-h2">
            The path from chaos to <em>continuous delivery.</em>
          </h2>
        </div>

        <div className="ig-stair-layout">
          {/* Left: As-is */}
          <div className="ig-stair-col ig-stair-left" data-reveal>
            <div className="mono ig-col-label">As-is</div>
            <ul className="ig-col-list">
              {asIs.map((item, i) => (
                <li
                  key={item}
                  className="ig-col-item"
                  style={{ transitionDelay: `${200 + i * 80}ms` }}
                  data-reveal
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Center: Staircase */}
          <div className="ig-stair-center">
            {/* diagonal arrow SVG */}
            <svg
              className="ig-stair-arrow"
              viewBox="0 0 40 240"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                className="ig-stair-path"
                d="M 20 230 L 20 20"
                fill="none"
                stroke="var(--blue)"
                strokeWidth="1"
              />
              <polygon points="14,24 20,10 26,24" fill="var(--blue)" />
            </svg>

            <ol className="ig-stairs" role="list">
              {steps.map((step, i) => (
                <li
                  key={step}
                  className="ig-step"
                  style={{ transitionDelay: `${i * 120}ms` }}
                  data-reveal
                >
                  <span className="ig-step-num mono">0{i + 1}</span>
                  <span className="ig-step-title">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Right: To-be */}
          <div className="ig-stair-col ig-stair-right" data-reveal>
            <div className="mono ig-col-label">To-be</div>
            <ul className="ig-col-list">
              {toBe.map((item, i) => (
                <li
                  key={item}
                  className="ig-col-item"
                  style={{ transitionDelay: `${200 + i * 80}ms` }}
                  data-reveal
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 4 — Migration Approach Pipeline
═══════════════════════════════════════════ */
const phases = [
  {
    num: "01",
    title: "Assessment",
    steps: [
      "Migration Readiness Assessment",
      "TCO",
      "Application Assessment",
      "Discovery",
    ],
  },
  {
    num: "02",
    title: "Readiness & Planning",
    steps: [
      "Landing Zone Design",
      "Wave Planning",
      "Security & Compliance",
      "DevOps Automation",
    ],
  },
  {
    num: "03",
    title: "Migrations",
    steps: ["Wave 1", "Wave 2", "Wave n", "Operate & Optimize"],
  },
];

function MigrationSection() {
  return (
    <section className="ig-migration" aria-labelledby="ig-migration-heading">
      <div className="ig-inner">
        <div className="ig-section-head" data-reveal>
          <div className="eyebrow mono ig-eyebrow">Migration approach</div>
          <h2 id="ig-migration-heading" className="ig-h2">
            Three phases. One <em>structured path.</em>
          </h2>
          <p className="ig-sub">
            A repeatable framework that reduces risk and accelerates
            time-to-value across every cloud migration engagement.
            {/* TODO: validate copy */}
          </p>
        </div>

        <div className="ig-pipeline">
          {phases.map((phase, pi) => (
            <div key={phase.num} className="ig-phase-wrap">
              <div
                className="ig-phase"
                style={{ transitionDelay: `${pi * 160}ms` }}
                data-reveal
              >
                <div className="ig-phase-head">
                  <span className="ig-phase-num mono">{phase.num}</span>
                  <span className="ig-phase-title">{phase.title}</span>
                </div>
                <div className="ig-chips">
                  {phase.steps.map((s, si) => (
                    <div
                      key={s}
                      className="ig-chip mono"
                      style={{
                        transitionDelay: `${pi * 160 + si * 60}ms`,
                      }}
                      data-reveal
                    >
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              {/* chevron between phases */}
              {pi < phases.length - 1 && (
                <div className="ig-chevron-wrap" aria-hidden="true">
                  <svg
                    className="ig-chevron-svg"
                    viewBox="0 0 24 48"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      className={`ig-chevron-path ig-chevron-path-${pi}`}
                      d="M 2 4 L 22 24 L 2 44"
                      fill="none"
                      stroke="var(--blue)"
                      strokeWidth="1"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   ROOT EXPORT
═══════════════════════════════════════════ */
export default function SoftwareInfographics() {
  useRevealObserver();
  useCountUp();

  return (
    <>
      {/* inject count-up data attributes onto existing #network .num spans */}
      {/* <CountUpBridge /> */}
      {/* <PortfolioSection /> */}
      {/* <DevOpsSection /> */}
      {/* <MigrationSection /> */}
    </>
  );
}

/* patches data-countup attributes onto the server-rendered #network nums */
function CountUpBridge() {
  useEffect(() => {
    const map = [
      { selector: ".network .stat:nth-child(1) .num", value: "200" },
      { selector: ".network .stat:nth-child(2) .num", value: "5" },
      { selector: ".network .stat:nth-child(3) .num", value: "7" },
      { selector: ".network .stat:nth-child(4) .num", value: "96" },
    ];
    map.forEach(({ selector, value }) => {
      const el = document.querySelector(selector);
      if (!el) return;
      // isolate only the text node (not the <em> suffix)
      const textNode = Array.from(el.childNodes).find(
        (n) => n.nodeType === Node.TEXT_NODE,
      );
      if (!textNode) return;

      // wrap text node in a span so we can target it
      const span = document.createElement("span");
      span.dataset.countup = value;
      span.textContent = textNode.textContent.trim();
      el.replaceChild(span, textNode);
    });
  }, []);

  return null;
}
