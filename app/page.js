import "./home.css";
import SoftwareInfographics from "./components/SoftwareInfographics";
import NavClient from "./components/NavClient";

export const metadata = {
  title: "Odiseus — Consulting in DevOps, Cloud, AI & Business Analysis",
};

export default function HomePage() {
  return (
    <>
      <NavClient active="software" />

      {/* ─── HERO ─── */}
      <section className="hero">
        <div>
          <div className="eyebrow mono reveal reveal-1">
            <span className="dot"></span>
            Consulting ·
          </div>
          <h1 className="reveal reveal-2">
            The network
            <br />
            behind <br />
            <em>most ambitious</em>
            <br />
            engineering teams.
          </h1>
          <p className="hero-sub reveal reveal-3">
            Odiseus is a boutique consulting practice connecting Canadian
            enterprises with deep expertise in DevOps, Cloud, AI, and business
            analysis — backed by a coast-to-coast network of senior
            practitioners.
          </p>
          <div className="hero-meta reveal reveal-4">
            <div className="meta-item">
              <div className="label mono">Headquarters</div>
              <div className="value">London, ON</div>
            </div>
            <div className="meta-item">
              <div className="label mono">Network reach</div>
              <div className="value">Coast to coast</div>
            </div>
            <div className="meta-item">
              <div className="label mono">Practice areas</div>
              <div className="value">Four</div>
            </div>
          </div>
        </div>

        {/* ─── HERO ILLUSTRATION: CANADIAN NETWORK MAP ─── */}
        <div className="illustration reveal reveal-2">
          <svg viewBox="0 0 600 580" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="1"
                />
              </pattern>
              <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1A4EFF" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#1A4EFF" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="600" height="580" fill="url(#grid)" />

            {/* Atmospheric glow */}
            <circle cx="300" cy="280" r="200" fill="url(#glow)" />

            {/* Stylized Canada outline (simplified) */}
            <path
              d="
        M 60 240
        L 90 200 L 130 195 L 160 175 L 200 170 L 230 155
        L 270 145 L 310 140 L 350 145 L 400 155 L 440 165
        L 480 175 L 520 195 L 540 220 L 530 250
        L 525 270 L 510 290 L 490 305 L 480 330
        L 475 360 L 470 385 L 460 405 L 440 415
        L 415 425 L 390 432 L 360 438 L 330 442
        L 300 444 L 270 442 L 245 438 L 220 432
        L 195 425 L 175 418 L 160 408 L 145 395
        L 130 378 L 115 358 L 100 335 L 85 310
        L 75 285 L 65 260 Z"
              fill="rgba(255,255,255,0.04)"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1"
            />

            {/* Connection lines between cities */}
            <g stroke="#1A4EFF" strokeWidth="1.2" fill="none" opacity="0.7">
              <line x1="110" y1="290" x2="220" y2="270" className="line-draw" />
              <line
                x1="220"
                y1="270"
                x2="380"
                y2="330"
                className="line-draw line-draw-2"
              />
              <line
                x1="380"
                y1="330"
                x2="365"
                y2="345"
                className="line-draw line-draw-2"
              />
              <line
                x1="380"
                y1="330"
                x2="445"
                y2="305"
                className="line-draw line-draw-3"
              />
              <line
                x1="445"
                y1="305"
                x2="510"
                y2="290"
                className="line-draw line-draw-4"
              />
              <line
                x1="380"
                y1="330"
                x2="420"
                y2="310"
                className="line-draw line-draw-3"
              />
            </g>

            {/* City: Vancouver */}
            <g>
              <circle
                cx="110"
                cy="290"
                r="28"
                fill="#1A4EFF"
                opacity="0"
                className="node-pulse"
              />
              <circle cx="110" cy="290" r="5" fill="#1A4EFF" />
              <circle cx="110" cy="290" r="2" fill="#FAFAF7" />
              <text
                x="110"
                y="315"
                textAnchor="middle"
                fill="rgba(255,255,255,0.85)"
                fontFamily="Geist Mono"
                fontSize="10"
                letterSpacing="1"
              >
                VANCOUVER
              </text>
            </g>

            {/* City: Calgary */}
            <g>
              <circle
                cx="220"
                cy="270"
                r="28"
                fill="#1A4EFF"
                opacity="0"
                className="node-pulse node-pulse-2"
              />
              <circle cx="220" cy="270" r="5" fill="#1A4EFF" />
              <circle cx="220" cy="270" r="2" fill="#FAFAF7" />
              <text
                x="220"
                y="295"
                textAnchor="middle"
                fill="rgba(255,255,255,0.85)"
                fontFamily="Geist Mono"
                fontSize="10"
                letterSpacing="1"
              >
                CALGARY
              </text>
            </g>

            {/* City: Toronto (HUB) */}
            <g>
              <circle
                cx="380"
                cy="330"
                r="40"
                fill="#1A4EFF"
                opacity="0"
                className="node-pulse"
              />
              <circle cx="380" cy="330" r="8" fill="#1A4EFF" />
              <circle cx="380" cy="330" r="3" fill="#FAFAF7" />
              <text
                x="380"
                y="358"
                textAnchor="middle"
                fill="#1A4EFF"
                fontFamily="Geist Mono"
                fontSize="11"
                fontWeight="500"
                letterSpacing="1"
              >
                TORONTO
              </text>
            </g>

            {/* City: London ON (HQ) */}
            <g>
              <circle
                cx="365"
                cy="345"
                r="32"
                fill="#1A4EFF"
                opacity="0"
                className="node-pulse node-pulse-3"
              />
              <circle cx="365" cy="345" r="6" fill="#FAFAF7" />
              <circle cx="365" cy="345" r="3" fill="#1A4EFF" />
              <text
                x="365"
                y="378"
                textAnchor="middle"
                fill="#FAFAF7"
                fontFamily="Geist Mono"
                fontSize="9"
                letterSpacing="1"
              >
                LONDON · HQ
              </text>
            </g>

            {/* City: Ottawa */}
            <g>
              <circle
                cx="420"
                cy="310"
                r="22"
                fill="#1A4EFF"
                opacity="0"
                className="node-pulse node-pulse-4"
              />
              <circle cx="420" cy="310" r="4" fill="#1A4EFF" />
              <text
                x="420"
                y="298"
                textAnchor="middle"
                fill="rgba(255,255,255,0.7)"
                fontFamily="Geist Mono"
                fontSize="9"
                letterSpacing="1"
              >
                OTTAWA
              </text>
            </g>

            {/* City: Montreal */}
            <g>
              <circle
                cx="445"
                cy="305"
                r="28"
                fill="#1A4EFF"
                opacity="0"
                className="node-pulse node-pulse-2"
              />
              <circle cx="445" cy="305" r="5" fill="#1A4EFF" />
              <circle cx="445" cy="305" r="2" fill="#FAFAF7" />
              <text
                x="465"
                y="295"
                textAnchor="start"
                fill="rgba(255,255,255,0.85)"
                fontFamily="Geist Mono"
                fontSize="10"
                letterSpacing="1"
              >
                MONTRÉAL
              </text>
            </g>

            {/* City: Halifax */}
            <g>
              <circle
                cx="510"
                cy="290"
                r="22"
                fill="#1A4EFF"
                opacity="0"
                className="node-pulse node-pulse-3"
              />
              <circle cx="510" cy="290" r="4" fill="#1A4EFF" />
              <text
                x="510"
                y="278"
                textAnchor="middle"
                fill="rgba(255,255,255,0.7)"
                fontFamily="Geist Mono"
                fontSize="9"
                letterSpacing="1"
              >
                HALIFAX
              </text>
            </g>

            {/* Compass / coordinate marker */}
            <g transform="translate(50, 50)" opacity="0.4">
              <circle r="14" fill="none" stroke="#FAFAF7" strokeWidth="0.8" />
              <line
                x1="0"
                y1="-14"
                x2="0"
                y2="14"
                stroke="#FAFAF7"
                strokeWidth="0.6"
              />
              <line
                x1="-14"
                y1="0"
                x2="14"
                y2="0"
                stroke="#FAFAF7"
                strokeWidth="0.6"
              />
              <text
                y="-20"
                textAnchor="middle"
                fill="#FAFAF7"
                fontFamily="Geist Mono"
                fontSize="8"
              >
                N
              </text>
            </g>
          </svg>

          <div className="illustration-caption">
            <div>
              <div className="mono">FIG. 01 · CONSULTING NETWORK</div>
            </div>
            <div className="num">
              07<em>+</em>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SPECIALIZATIONS ─── */}
      <section className="specs" id="expertise">
        <div className="section-head">
          <h2>
            Four practice areas.
            <br />
            <em>One curated network.</em>
          </h2>
          <p>
            We don&apos;t try to do everything. We go deep in the four
            disciplines where senior, specialized expertise compounds — and
            where the right consultant changes the trajectory of a project.
          </p>
        </div>

        <div className="spec-grid">
          {/* DevOps */}
          <div className="spec">
            <div className="num mono">01 / DevOps</div>
            <svg
              className="glyph"
              viewBox="0 0 72 72"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="36" cy="36" r="22" />
              <path d="M14 36 a22 22 0 0 1 44 0" strokeDasharray="4 3" />
              <path d="M36 14 v8 M58 36 h-8 M36 58 v-8 M14 36 h8" />
              <circle cx="36" cy="36" r="6" fill="currentColor" />
              <path d="M36 22 l4 6 -8 0 z" fill="currentColor" />
            </svg>
            <h3>
              DevOps &amp; <em>Platform</em> Engineering
            </h3>
            <p>
              CI/CD pipelines, infrastructure-as-code, observability, and the
              platform discipline that turns good engineering teams into fast
              ones.
            </p>
            <div className="tag mono">Terraform · Kubernetes · GitOps</div>
          </div>

          {/* Cloud */}
          <div className="spec">
            <div className="num mono">02 / Cloud</div>
            <svg
              className="glyph"
              viewBox="0 0 72 72"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M20 44 a10 10 0 0 1 4-19.5 a14 14 0 0 1 26 4 a8 8 0 0 1 2 15.5 z" />
              <line x1="28" y1="52" x2="28" y2="60" />
              <line x1="36" y1="52" x2="36" y2="62" />
              <line x1="44" y1="52" x2="44" y2="60" />
              <circle cx="28" cy="63" r="1.5" fill="currentColor" />
              <circle cx="36" cy="65" r="1.5" fill="currentColor" />
              <circle cx="44" cy="63" r="1.5" fill="currentColor" />
            </svg>
            <h3>
              Cloud <em>Architecture</em> &amp; Migration
            </h3>
            <p>
              AWS, Azure, GCP — multi-cloud strategy, cost optimization, and
              migrations led by architects who&apos;ve shipped at scale.
            </p>
            <div className="tag mono">AWS · Azure · GCP · FinOps</div>
          </div>

          {/* AI */}
          <div className="spec">
            <div className="num mono">03 / AI</div>
            <svg
              className="glyph"
              viewBox="0 0 72 72"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="22" cy="22" r="4" fill="currentColor" />
              <circle cx="50" cy="22" r="4" fill="currentColor" />
              <circle cx="36" cy="36" r="5" fill="currentColor" />
              <circle cx="22" cy="50" r="4" fill="currentColor" />
              <circle cx="50" cy="50" r="4" fill="currentColor" />
              <line x1="22" y1="22" x2="36" y2="36" />
              <line x1="50" y1="22" x2="36" y2="36" />
              <line x1="22" y1="50" x2="36" y2="36" />
              <line x1="50" y1="50" x2="36" y2="36" />
              <line x1="22" y1="22" x2="22" y2="50" strokeDasharray="2 2" />
              <line x1="50" y1="22" x2="50" y2="50" strokeDasharray="2 2" />
            </svg>
            <h3>
              AI &amp; <em>Applied</em> Machine Learning
            </h3>
            <p>
              From LLM strategy to production ML — agents, RAG systems, and the
              integration work that turns AI pilots into business outcomes.
            </p>
            <div className="tag mono">LLMs · RAG · MLOps · Agents</div>
          </div>

          {/* Business Analysis */}
          <div className="spec">
            <div className="num mono">04 / Business Analysis</div>
            <svg
              className="glyph"
              viewBox="0 0 72 72"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="14" y="38" width="8" height="20" />
              <rect x="28" y="28" width="8" height="30" />
              <rect x="42" y="20" width="8" height="38" />
              <path
                d="M14 22 L26 18 L40 14 L56 8"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="14" cy="22" r="2" fill="currentColor" />
              <circle cx="56" cy="8" r="2" fill="currentColor" />
              <path d="M52 12 L56 8 L60 12" stroke="currentColor" />
            </svg>
            <h3>
              Business <em>Analysis</em> &amp; Strategy
            </h3>
            <p>
              Requirements, process design, and the translation layer between
              executives and engineering — bringing clarity to complex
              transformations.
            </p>
            <div className="tag mono">Discovery · Roadmaps · Process</div>
          </div>
        </div>
      </section>

      {/* <SoftwareInfographics /> */}

      {/* ─── NETWORK STATS ─── */}
      {/* <section className="network" id="network">
        <div className="network-inner">
          <h2>
            A consulting network
            <br />
            built on <em>deep relationships.</em>
          </h2>
          <div className="stats">
            <div className="stat">
              <div className="num">
                200<em>+</em>
              </div>
              <div className="label">Vetted senior consultants</div>
            </div>
            <div className="stat">
              <div className="num">5</div>
              <div className="label">Major at metros in active network</div>
            </div>
            <div className="stat">
              <div className="num">
                7<em>yr</em>
              </div>
              <div className="label">Average practitioner experience</div>
            </div>
            <div className="stat">
              <div className="num">
                96<em>%</em>
              </div>
              <div className="label">Client engagement renewal rate</div>
            </div>
          </div>
        </div>
      </section> */}

      {/* ─── CTA ─── */}
      <section className="cta" id="contact">
        <h2>
          Tell us what you&apos;re <em>building.</em>
          <br />
          We&apos;ll bring the right people.
        </h2>
        <a href="#" className="cta-btn">
          <span>Start a conversation</span>
          <span className="arrow">→</span>
        </a>
      </section>

      {/* ─── FOOTER ─── */}
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
                <a href="#network">Our Network</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </div>

          <div className="f-col">
            <h4>CONNECT</h4>
            <ul>
              <li>
                <a href="#contact">Start a Conversation</a>
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
    </>
  );
}
