/* Trail Notes reminder: Build every block like a useful page from a field journal—paper texture, pine ink, saffron waypoints, asymmetric editorial rhythm. */

import { FormEvent, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Backpack,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Compass,
  ExternalLink,
  MapPin,
  Menu,
  NotebookPen,
  Route,
  SlidersHorizontal,
  Sun,
  Tent,
  TrainFront,
  Trees,
  X,
} from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";
type FilterName = "Alle" | "Unter 30 €" | "Mit ÖPNV" | "Eine Nacht";

type Trip = {
  id: string;
  title: string;
  region: string;
  image: string;
  cost: number;
  distance: string;
  duration: string;
  difficulty: Difficulty;
  transport: string;
  nights: string;
  description: string;
  route: string[];
  costs: { label: string; value: string }[];
  gear: string[];
  links: { label: string; href: string }[];
  accent: string;
};

const trips: Trip[] = [
  {
    id: "spreewald",
    title: "Spreewald: Kanäle & Kiefern",
    region: "Brandenburg · ab Berlin",
    image: "/manus-storage/sidequest-forest-fallback_f5d5abde.jpg",
    cost: 24,
    distance: "85 km",
    duration: "2 Tage",
    difficulty: "easy",
    transport: "RE + Rad",
    nights: "1 Nacht",
    description:
      "Flache Pfade, stille Kanäle und ein Sonnenaufgang, für den du kein Auto brauchst.",
    route: [
      "Sa · 08:10 — Berlin Ostkreuz → Lübbenau",
      "Sa · 10:00 — Gurkenradweg bis Lehde",
      "Sa · 18:30 — Biwakplatz am Wasser",
      "So · 09:00 — Kleine Runde durch den Hochwald",
    ],
    costs: [
      { label: "Regionalbahn", value: "12 €" },
      { label: "Biwakplatz", value: "8 €" },
      { label: "Essen & Snacks", value: "4 €" },
    ],
    gear: ["Fahrrad oder Leih-Rad", "Isomatte + Schlafsack", "Wasserflasche", "Regenlayer"],
    links: [
      { label: "DB Navigator öffnen", href: "https://int.bahn.de/en" },
      { label: "Route bei Komoot", href: "https://www.komoot.com/" },
    ],
    accent: "saffron",
  },
  {
    id: "saxon-switzerland",
    title: "Sächsische Schweiz: Felsenfenster",
    region: "Sachsen · ab Berlin",
    image: "/manus-storage/sidequest-lake-fallback_01434695.jpg",
    cost: 38,
    distance: "190 km",
    duration: "2 Tage",
    difficulty: "medium",
    transport: "EC + S-Bahn",
    nights: "1 Nacht",
    description:
      "Sandstein, Nebel über der Elbe und ein Aussichtspunkt, der sich nach mehr anfühlt als 38 €.",
    route: [
      "Sa · 06:45 — Berlin Hbf → Schmilka",
      "Sa · 10:30 — Malerweg bis Papststein",
      "Sa · 17:00 — Zeltplatz am Lilienstein",
      "So · 07:30 — Sonnenaufgang an der Bastei",
    ],
    costs: [
      { label: "Zug & Fähre", value: "22 €" },
      { label: "Zeltplatz", value: "10 €" },
      { label: "Proviant", value: "6 €" },
    ],
    gear: ["Feste Schuhe", "Stirnlampe", "Kleines Zelt", "Offline-Karte"],
    links: [
      { label: "Nationalpark-Regeln", href: "https://nationalpark-saechsische-schweiz.de/" },
      { label: "Tour bei Komoot", href: "https://www.komoot.com/" },
    ],
    accent: "pine",
  },
  {
    id: "harz",
    title: "Harz: Brocken auf Umwegen",
    region: "Sachsen-Anhalt · ab Berlin",
    image: "/manus-storage/sidequest-hero_13e2e1f7.jpg",
    cost: 56,
    distance: "255 km",
    duration: "2 Tage",
    difficulty: "hard",
    transport: "RE + Bus",
    nights: "1 Nacht",
    description:
      "Eine lange Linie durch Fichtenwald und Hochmoor – für den Moment, in dem die Stadt wirklich weg ist.",
    route: [
      "Sa · 06:00 — Berlin → Wernigerode",
      "Sa · 10:45 — Aufstieg über den Hohnekamm",
      "Sa · 18:00 — Hütte oder Trekkingplatz",
      "So · 08:30 — Brockenrunde & Rückfahrt",
    ],
    costs: [
      { label: "Bahn & Bus", value: "35 €" },
      { label: "Trekkingplatz", value: "12 €" },
      { label: "Essen & Kaffee", value: "9 €" },
    ],
    gear: ["Wasser für 6 Stunden", "Warme Schicht", "Blasenpflaster", "Powerbank"],
    links: [
      { label: "Fahrplan prüfen", href: "https://int.bahn.de/en" },
      { label: "Wetter im Harz", href: "https://www.dwd.de/" },
    ],
    accent: "clay",
  },
];

const filterOptions: FilterName[] = ["Alle", "Unter 30 €", "Mit ÖPNV", "Eine Nacht"];

function difficultyLabel(difficulty: Difficulty) {
  return {
    easy: "locker",
    medium: "machbar",
    hard: "fordernd",
  }[difficulty];
}

function TripCard({ trip, onOpen }: { trip: Trip; onOpen: (trip: Trip) => void }) {
  const [saved, setSaved] = useState(false);

  return (
    <article className="trip-card group">
      <div className="trip-image-wrap">
        <img src={trip.image} alt={`Landschaft für ${trip.title}`} className="trip-image" />
        <div className="trip-image-shade" />
        <span className={`trip-stamp trip-stamp-${trip.accent}`}>WOCHENEND-MISSION</span>
        <button
          className={`save-button ${saved ? "save-button-active" : ""}`}
          aria-label={saved ? `${trip.title} aus Favoriten entfernen` : `${trip.title} speichern`}
          onClick={() => setSaved((value) => !value)}
        >
          {saved ? <Check size={16} strokeWidth={2.5} /> : <NotebookPen size={16} />}
          <span>{saved ? "gemerkt" : "merken"}</span>
        </button>
      </div>
      <div className="trip-card-body">
        <div className="trip-kicker">
          <span>{trip.region}</span>
          <span className="trip-kicker-dot" aria-hidden="true" />
          <span>{trip.distance}</span>
        </div>
        <h3>{trip.title}</h3>
        <p>{trip.description}</p>
        <div className="trip-facts" aria-label="Trip Fakten">
          <span><CircleDollarSign size={15} /> {trip.cost} €</span>
          <span><TrainFront size={15} /> {trip.transport}</span>
          <span><Clock3 size={15} /> {trip.duration}</span>
        </div>
        <div className="trip-route-preview"><Route size={14} /><span>Start: {trip.route[0].split("—")[1]?.trim()}</span><span className="route-preview-arrow">↗</span></div>
        <div className="trip-card-footer">
          <span className={`difficulty difficulty-${trip.difficulty}`}>
            <span className="difficulty-dot" /> {difficultyLabel(trip.difficulty)}
          </span>
          <button className="text-link" onClick={() => onOpen(trip)}>
            Plan öffnen <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [location, setLocation] = useState("Berlin");
  const [budget, setBudget] = useState(60);
  const [activeFilter, setActiveFilter] = useState<FilterName>("Alle");
  const [sortBy, setSortBy] = useState("budget");
  const [plannerMessage, setPlannerMessage] = useState("");
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredTrips = useMemo(() => {
    const query = location.trim().toLowerCase();
    const filtered = trips.filter((trip) => {
      const matchesLocation = !query || trip.region.toLowerCase().includes(query) || "berlin".includes(query);
      const matchesBudget = trip.cost <= budget;
      const matchesFilter =
        activeFilter === "Alle" ||
        (activeFilter === "Unter 30 €" && trip.cost < 30) ||
        (activeFilter === "Mit ÖPNV" && trip.transport.includes("RE")) ||
        (activeFilter === "Eine Nacht" && trip.nights === "1 Nacht");
      return matchesLocation && matchesBudget && matchesFilter;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "duration") return a.duration.localeCompare(b.duration);
      if (sortBy === "distance") return parseInt(a.distance) - parseInt(b.distance);
      return a.cost - b.cost;
    });
  }, [activeFilter, budget, location, sortBy]);

  function handlePlanSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPlannerMessage(
      location.trim()
        ? `Alles klar. Ich suche günstige Wochenendideen ab ${location.trim()} unter ${budget} €.`
        : "Trag einen Startort ein – dann kann die Sidequest losgehen."
    );
    document.getElementById("abenteuer")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function scrollToPlanner() {
    document.getElementById("planer")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="site-shell">
      <header className="site-header">
        <a className="brand-lockup" href="#top" aria-label="Plan-a-Sidequest Startseite">
          <img src="/manus-storage/sidequest-mark_21ad81d5.png" alt="" className="brand-mark" />
          <span className="brand-wordmark">Plan-a-Sidequest<span className="brand-dash">↗</span></span>
        </a>
        <nav className={`site-nav ${mobileMenuOpen ? "site-nav-open" : ""}`} aria-label="Hauptnavigation">
          <a href="#abenteuer" onClick={() => setMobileMenuOpen(false)}>Abenteuer finden</a>
          <a href="#so-gehts" onClick={() => setMobileMenuOpen(false)}>So geht’s</a>
          <a href="#budget-logik" onClick={() => setMobileMenuOpen(false)}>Budget-Logik</a>
        </nav>
        <div className="header-actions">
          <button className="header-note" onClick={scrollToPlanner}>
            <NotebookPen size={16} />
            <span>Neuen Plan</span>
          </button>
          <button
            className="mobile-menu-button"
            aria-label={mobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
            onClick={() => setMobileMenuOpen((value) => !value)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <section className="hero-section" id="top">
        <div className="hero-photo" role="img" aria-label="Zwei Wandernde auf einem Bergpfad">
          <img src="/manus-storage/sidequest-hero_13e2e1f7.jpg" alt="Zwei Wandernde auf einem Bergpfad" />
        </div>
        <div className="hero-content">
          <div className="eyebrow"><span className="eyebrow-marker" /> Wochenendmodus: an</div>
          <h1>Raus aus dem Feed.<br /><em>Rein in den Wald.</em></h1>
          <p className="hero-lede">Günstige Abenteuer, die wirklich ab deiner Haustür starten. Mit groben Routen, ehrlichen Kosten und einer Packliste, die nicht nach Expedition aussieht.</p>
          <button className="hero-cta" onClick={scrollToPlanner}>Sidequest planen <ArrowUpRight size={19} /></button>
          <div className="hero-note"><span>01</span><span className="hero-note-rule" /><span>für kleine Budgets<br />und große Neugier</span></div>
          <div className="hero-facts" aria-label="Planungsfakten">
            <span><MapPin size={14} /> ab Berlin</span>
            <span><CircleDollarSign size={14} /> ab 24 €</span>
            <span><TrainFront size={14} /> mit ÖPNV</span>
            <span><CalendarDays size={14} /> 1–2 Tage</span>
          </div>
        </div>
        <div className="hero-corner-note"><span>FIELD NOTE · 2026</span><span className="hero-corner-line" /><span>BERLIN / DE</span></div>
      </section>

      <section className="planner-section" id="planer">
        <div className="section-rail">
          <span className="rail-number">01</span>
          <span className="vertical-label">DEIN STARTPUNKT</span>
        </div>
        <div className="planner-main">
          <div className="section-heading-row">
            <div>
              <div className="eyebrow eyebrow-dark"><span className="eyebrow-marker" /> dein nächster ausbruch</div>
              <h2>Plan nicht zu viel.<br /><em>Plan los.</em></h2>
            </div>
            <p className="section-aside">Ein paar Eckdaten reichen. Wir halten die Pläne flexibel, damit du noch Platz für Zufälle hast.</p>
          </div>
          <form className="planner-form" onSubmit={handlePlanSubmit}>
            <label className="planner-field planner-field-location">
              <span><MapPin size={15} /> Startort</span>
              <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="z. B. Berlin" aria-label="Startort" />
            </label>
            <label className="planner-field planner-field-budget">
              <span><CircleDollarSign size={15} /> Max. pro Person</span>
              <div className="budget-input-wrap"><input type="number" min="10" max="150" value={budget} onChange={(event) => setBudget(Number(event.target.value))} aria-label="Maximales Budget" /><b>€</b></div>
            </label>
            <label className="planner-field planner-field-mood">
              <span><Sun size={15} /> Stimmung</span>
              <select defaultValue="wald" aria-label="Stimmung auswählen">
                <option value="wald">Wald & Ruhe</option>
                <option value="wasser">Wasser sehen</option>
                <option value="hoehenmeter">Höhenmeter sammeln</option>
              </select>
            </label>
            <button className="planner-submit" type="submit">Abenteuer zeigen <ChevronRight size={18} /></button>
          </form>
          {plannerMessage && <div className="planner-message" role="status"><Check size={16} /> {plannerMessage}</div>}
          <div className="planner-footnote"><span className="footnote-star">✳</span> Die Preise sind Schätzwerte pro Person für ein Wochenende. Lieber etwas Puffer einplanen.</div>
        </div>
      </section>

      <section className="adventures-section" id="abenteuer">
        <div className="adventures-topline">
          <div>
            <div className="eyebrow eyebrow-dark"><span className="eyebrow-marker" /> sidequests in deiner nähe</div>
            <h2>Gute Ideen.<br /><em>Kleines Budget.</em></h2>
          </div>
          <div className="result-count"><strong>{filteredTrips.length.toString().padStart(2, "0")}</strong><span>Pläne<br />gefunden</span></div>
        </div>
        <div className="filter-bar" aria-label="Abenteuer filtern">
          <div className="filter-pills">
            <SlidersHorizontal size={16} className="filter-icon" />
            {filterOptions.map((filter) => (
              <button key={filter} className={`filter-pill ${activeFilter === filter ? "filter-pill-active" : ""}`} onClick={() => setActiveFilter(filter)}>{filter}</button>
            ))}
          </div>
          <label className="sort-select"><span>Sortiert nach</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sortierung"><option value="budget">Budget</option><option value="distance">Entfernung</option><option value="duration">Dauer</option></select></label>
        </div>
        {filteredTrips.length > 0 ? (
          <div className="trip-grid">
            {filteredTrips.map((trip) => <TripCard key={trip.id} trip={trip} onOpen={setSelectedTrip} />)}
          </div>
        ) : (
          <div className="empty-state"><Compass size={28} /><h3>Diese Route ist noch nicht markiert.</h3><p>Erhöhe dein Budget ein wenig oder probiere „Alle“ – wir wollen, dass du dieses Wochenende rauskommst.</p><button onClick={() => { setBudget(60); setActiveFilter("Alle"); }}>Filter zurücksetzen</button></div>
        )}
        <div className="more-adventures"><span className="more-line" /><button onClick={() => { setBudget(100); setActiveFilter("Alle"); }}>Mehr Sidequests laden <ArrowUpRight size={16} /></button><span className="more-line" /></div>
      </section>

      <section className="how-section" id="so-gehts">
        <div className="how-image-wrap"><img src="/manus-storage/sidequest-lake-fallback_01434695.jpg" alt="Waldpfad für ein günstiges Wochenendabenteuer" /><span className="image-caption">NOTIZ 02 · DER WEG IST DAS ZIEL</span></div>
        <div className="how-copy">
          <div className="eyebrow eyebrow-dark"><span className="eyebrow-marker" /> so funktioniert’s</div>
          <h2>Große Luft.<br /><em>Kleine Rechnung.</em></h2>
          <p>Du brauchst kein perfektes Equipment und keine zwei Wochen Urlaub. Wir zerlegen Wochenendabenteuer in machbare Stücke – und zeigen dir, wo du Geld sparen kannst.</p>
          <ol className="steps-list">
            <li><span>01</span><div><strong>Startpunkt setzen</strong><p>Wo willst du los? Wie viel darf das Wochenende kosten?</p></div></li>
            <li><span>02</span><div><strong>Sidequest wählen</strong><p>Filtere nach Stimmung, Anreise und dem, was in deinem Rucksack fehlt.</p></div></li>
            <li><span>03</span><div><strong>Losziehen</strong><p>Route speichern, zwei Leute anschreiben, Freitag die Tür aufmachen.</p></div></li>
          </ol>
          <button className="text-link text-link-large" onClick={scrollToPlanner}>Deine Eckdaten eintragen <ArrowUpRight size={17} /></button>
        </div>
      </section>

      <section className="budget-section" id="budget-logik">
        <div className="budget-heading"><div className="eyebrow eyebrow-dark"><span className="eyebrow-marker" /> budget-logik</div><h2>Wofür dein Geld<br /><em>eigentlich draufgeht.</em></h2></div>
        <div className="budget-breakdown">
          <div className="budget-item"><span className="budget-icon"><TrainFront size={21} /></span><div><h3>Anfahrt</h3><p>Regionalzüge, Gruppentickets, Abkürzungen. Der Weg ist oft billiger als gedacht.</p></div><strong>~ 50 %</strong></div>
          <div className="budget-item"><span className="budget-icon"><Tent size={21} /></span><div><h3>Schlafen</h3><p>Zeltplatz statt Hotel. Oder: frag jemanden mit Garten am Weg.</p></div><strong>~ 25 %</strong></div>
          <div className="budget-item"><span className="budget-icon"><Backpack size={21} /></span><div><h3>Essen & Extras</h3><p>Supermarkt-Frühstück, Thermoskanne, kein Maut-Instagram-Spot.</p></div><strong>~ 25 %</strong></div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-brand"><img src="/manus-storage/sidequest-mark_21ad81d5.png" alt="" className="brand-mark" /><span className="brand-wordmark">Plan-a-Sidequest<span className="brand-dash">↗</span></span></div>
        <p>Weniger scrollen. Mehr draußen sein.</p>
        <div className="footer-links"><a href="#top">Nach oben <ArrowUpRight size={14} /></a><a href="mailto:hallo@plan-a-sidequest.de">Sag hallo <ArrowUpRight size={14} /></a></div>
        <div className="footer-meta"><span>Made for the almost-broke & curious</span><span>© 2026 Plan-a-Sidequest</span></div>
      </footer>

      {selectedTrip && (
        <div className="drawer-backdrop" role="presentation" onClick={() => setSelectedTrip(null)}>
          <aside className="trip-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-head"><span className="trip-stamp trip-stamp-saffron">FIELD NOTE · {selectedTrip.region.split("·")[0]}</span><button className="drawer-close" onClick={() => setSelectedTrip(null)} aria-label="Detailansicht schließen"><X size={20} /></button></div>
            <div className="drawer-scroll">
              <img src={selectedTrip.image} alt={`Landschaft für ${selectedTrip.title}`} className="drawer-image" />
              <div className="drawer-content"><div className="trip-kicker">{selectedTrip.region} <span className="trip-kicker-dot" /> {selectedTrip.distance}</div><h2 id="drawer-title">{selectedTrip.title}</h2><p className="drawer-intro">{selectedTrip.description}</p><div className="drawer-stat-grid"><div><span>KOSTEN CA.</span><strong>{selectedTrip.cost} €</strong><small>pro Person</small></div><div><span>DAUER</span><strong>{selectedTrip.duration}</strong><small>{selectedTrip.nights}</small></div><div><span>ANREISE</span><strong>{selectedTrip.transport}</strong><small>ab {location || "deinem Ort"}</small></div></div><div className="drawer-section"><h3><Route size={17} /> Grobe Route</h3><ol className="route-list">{selectedTrip.route.map((stop) => <li key={stop}><span className="route-dot" />{stop}</li>)}</ol></div><div className="drawer-section"><h3><CircleDollarSign size={17} /> Kosten-Split</h3><div className="cost-list">{selectedTrip.costs.map((item) => <div key={item.label}><span>{item.label}</span><strong>{item.value}</strong></div>)}</div></div><div className="drawer-section"><h3><Backpack size={17} /> Packliste</h3><div className="gear-list">{selectedTrip.gear.map((item) => <span key={item}><Check size={14} /> {item}</span>)}</div></div><div className="drawer-links">{selectedTrip.links.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noreferrer">{link.label} <ExternalLink size={14} /></a>)}</div></div>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
