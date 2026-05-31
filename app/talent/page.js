// Talent route entry (server component).
// CSS is imported here so it is scoped to the /talent route chunk only,
// keeping it isolated from the home page styles. Order matters:
// responsive.css must load last.
import "../../styles/hero.css";
import "../../styles/sections.css";
import "../../styles/footer.css";
import "../../styles/responsive.css";

import TalentClient from "./TalentClient";

export const metadata = {
  title: "Odiseus Talent — DevOps · Cloud · AI Recruitment · London, Ontario",
  description:
    "Odiseus Talent connects DevOps, Cloud, Data, and AI engineers with companies building the future across Canada, USA, and beyond.",
};

export default function TalentPage() {
  return <TalentClient />;
}
