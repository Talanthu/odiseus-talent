import "../home.css";
import "./odiseus-cloud.css";
import OdiseusStoryClient from "../components/OdiseusStoryClient";

export const metadata = {
  title: "Odiseus — Cloud · Engineering Systems That Scale",
  description:
    "Discover how Odiseus engineers cloud, AI, DevOps, and software systems through an animated journey across our full service ecosystem.",
};

export default function OdiseusCloudPage() {
  return <OdiseusStoryClient />;
}
