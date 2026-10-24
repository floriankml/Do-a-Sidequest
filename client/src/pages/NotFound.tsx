import { ArrowRight, Compass } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <main className="sidequest-app not-found">
      <div className="not-found-card">
        <span className="finder-mission-symbol"><Compass size={28} /></span>
        <p className="sq-eyebrow"><span className="sq-eyebrow-line" /> ERROR 404 · OFF THE MAP</p>
        <h1>Diese Route<br /><em>gibt es nicht.</em></h1>
        <p>Du bist versehentlich in einer Sidequest ohne Ziel gelandet. Zurück zur Basis – dort warten echte Missionen.</p>
        <Link className="primary-sq-button" href="/">Zur Startseite <ArrowRight size={17} /></Link>
      </div>
    </main>
  );
}
