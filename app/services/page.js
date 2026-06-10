import "../home.css";
import "./services.css";
import NavClient from "../components/NavClient";
import GlowButton from "../components/GlowButton";

export const metadata = {
  title: "Odiseus — · DevOps · Cloud · AI · Data · Security",
  description:
    "Eight specialisms, eighty services — the disciplines we staff and the engineers we connect you with.",
};

const CATEGORIES = [
  {
    num: "01 / 08",
    title: "Cloud Migration & Strategy",
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

export default function ServicesPage() {
  return (
    <>
      <NavClient />

      {/* ─── HERO ─── */}
      <section className="svc-hero">
        <p className="svc-hero-label mono">Our Capabilities</p>
        <h1>Eight specialisms. Eighty services. One partner.</h1>
        <p className="svc-hero-sub">
          Across DevOps, Cloud, AI, Data, Security, and Modernization — these
          are the disciplines we staff and the engineers we connect you with.
        </p>
      </section>

      {/* ─── CATALOGUE ─── */}
      <div className="svc-catalogue">
        {CATEGORIES.map((cat) => (
          <section key={cat.num} className="svc-category">
            <div className="svc-cat-header">
              <span className="svc-cat-num mono">{cat.num}</span>
              <h2 className="svc-cat-title">{cat.title}</h2>
            </div>
            <div className="svc-cat-rule" />
            <ul className="svc-grid" role="list">
              {cat.services.map((name) => (
                <li key={name} className="svc-service">
                  {name}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* ─── CTA ─── */}
      <section className="svc-cta">
        <div className="svc-cta-inner">
          <h2>Don&apos;t see what you need?</h2>
          <p className="svc-cta-sub">
            We staff across the full DevOps, Cloud, and AI stack. Tell us the
            role and we&apos;ll find the engineer.
          </p>
          <div className="svc-cta-btns">
            <GlowButton
              href="mailto:hr@odiseussoftware.com"
              variant="primary"
              className="svc-btn-primary"
            >
              Get in touch
            </GlowButton>
            <GlowButton href="/" variant="secondary" className="svc-btn-secondary">
              Back to home
            </GlowButton>
          </div>
        </div>
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
                <a href="mailto:info@odiseussoftware.com">Contact</a>
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
    </>
  );
}
