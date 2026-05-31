export default function NavClient({ active }) {
  return (
    <nav className="site-nav" id="mainNav" aria-label="Primary navigation">
      <a className="nav-logo" href="/" aria-label="Odiseus home">
        <span className="nav-logo-dot" />
        <span>
          odiseus<em>.</em>
        </span>
      </a>

      <ul className="nav-center" role="list">
        <li>
          <a
            href="/"
            className={active === "software" ? "active" : undefined}
            data-nav-link
          >
            Software
          </a>
        </li>
        <li className="nav-sep" aria-hidden="true">
          |
        </li>
        <li>
          <a
            href="/talent"
            className={active === "talent" ? "active" : undefined}
            data-nav-link
          >
            Talent
          </a>
        </li>
        <li className="nav-sep" aria-hidden="true">
          |
        </li>
        <li>
          <a
            href="/odiseus-cloud"
            className={active === "cloud" ? "active" : undefined}
            data-nav-link
          >
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
