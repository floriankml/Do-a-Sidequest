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

const makeTrip = (trip: Omit<Trip, "links"> & { links?: Trip["links"] }): Trip => ({
  ...trip,
  links: trip.links ?? [
    { label: "Verbindung prüfen", href: "https://int.bahn.de/en" },
    { label: "Route bei Komoot", href: "https://www.komoot.com/" },
  ],
});

const trips: Trip[] = [
  makeTrip({ id: "bw", title: "Schwarzwald: Schluchtensteig light", region: "Baden-Württemberg", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80", cost: 34, distance: "210 km", duration: "2 Tage", difficulty: "medium", transport: "RE + Bus", nights: "1 Nacht", description: "Moosige Wege, kleine Klammen und Schwarzwaldluft – ohne Wellnesshotel im Budget.", route: ["Sa · 07:20 — Freiburg → Kirchzarten", "Sa · 10:00 — Ravenna­schlucht bis Hinterzarten", "Sa · 18:00 — Zeltplatz am Titisee", "So · 09:00 — Seeufer-Runde & Rückfahrt"], costs: [{ label: "Bahn & Bus", value: "20 €" }, { label: "Zeltplatz", value: "8 €" }, { label: "Proviant", value: "6 €" }], gear: ["Feste Schuhe", "Regenjacke", "Isomatte", "Offline-Karte"], accent: "pine" }),
  makeTrip({ id: "bavaria", title: "Bayern: Tegernsee über die Alm", region: "Bayern", image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=80", cost: 42, distance: "65 km", duration: "2 Tage", difficulty: "medium", transport: "S-Bahn + Bus", nights: "1 Nacht", description: "Almwiesen, Seeufer und eine Nacht unter Sternen – der Klassiker ohne Auto.", route: ["Sa · 08:00 — München Hbf → Gmund", "Sa · 10:30 — Höhenweg zum Wallberg", "Sa · 17:30 — Campingplatz am See", "So · 09:00 — Uferweg nach Tegernsee"], costs: [{ label: "Bahn & Bus", value: "24 €" }, { label: "Camping", value: "11 €" }, { label: "Essen", value: "7 €" }], gear: ["Sonnencreme", "Badesachen", "Zelt", "Kopflampe"], accent: "saffron" }),
  makeTrip({ id: "berlin", title: "Berlin: Müggelberge & Badestrand", region: "Berlin", image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80", cost: 18, distance: "22 km", duration: "1 Tag", difficulty: "easy", transport: "S-Bahn + Tram", nights: "Tagestrip", description: "Wald, Sand und ein Sonnenuntergang am See – die Sidequest direkt vor der Haustür.", route: ["09:30 — S-Bahn nach Köpenick", "10:30 — Müggelheimer Damm bis Müggelturm", "14:00 — Picknick am Müggelsee", "19:00 — Tram zurück in die Stadt"], costs: [{ label: "ÖPNV", value: "8 €" }, { label: "Snacks", value: "8 €" }, { label: "Badezeug", value: "2 €" }], gear: ["Badezeug", "Decke", "Wasser", "Powerbank"], accent: "clay" }),
  makeTrip({ id: "brandenburg", title: "Brandenburg: Schorfheide-Runde", region: "Brandenburg", image: "https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=900&q=80", cost: 24, distance: "70 km", duration: "2 Tage", difficulty: "easy", transport: "RE + Rad", nights: "1 Nacht", description: "Kiefern, klare Seen und ein ruhiger Zeltplatz – Brandenburg kann mehr als Ausflugsverkehr.", route: ["Sa · 08:45 — Berlin → Joachimsthal", "Sa · 10:30 — Werbellinsee-Runde", "Sa · 17:00 — Naturcamp am See", "So · 10:00 — Kleine Radschleife nach Altenhof"], costs: [{ label: "Regionalbahn", value: "12 €" }, { label: "Zeltplatz", value: "8 €" }, { label: "Essen", value: "4 €" }], gear: ["Fahrrad", "Badesachen", "Mückenspray", "Tarp"], accent: "pine" }),
  makeTrip({ id: "bremen", title: "Bremen: Weser, Watt & Wind", region: "Bremen", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80", cost: 27, distance: "75 km", duration: "2 Tage", difficulty: "easy", transport: "RE + Rad", nights: "1 Nacht", description: "Mit dem Rad raus aus der Stadt, am Deich entlang und dem Wetter beim Wechseln zusehen.", route: ["Sa · 09:10 — Bremen Hbf → Nordenham", "Sa · 11:00 — Weserradweg Richtung Küste", "Sa · 18:00 — Jugendzeltplatz am Deich", "So · 08:00 — Wattkante & Rückfahrt"], costs: [{ label: "Bahn", value: "15 €" }, { label: "Zeltplatz", value: "7 €" }, { label: "Proviant", value: "5 €" }], gear: ["Windbreaker", "Fahrrad", "Stirnlampe", "Thermoskanne"], accent: "saffron" }),
  makeTrip({ id: "hamburg", title: "Hamburg: Elbe rauswärts", region: "Hamburg", image: "https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=900&q=80", cost: 21, distance: "48 km", duration: "1 Tag", difficulty: "easy", transport: "S-Bahn + Fähre", nights: "Tagestrip", description: "Containerhafen, Elbstrand und ein langer Rückweg mit Sand in den Schuhen.", route: ["10:00 — Landungsbrücken → Fähre nach Finkenwerder", "11:00 — Elbuferweg Richtung Blankenese", "15:00 — Picknick am Falkensteiner Ufer", "19:30 — S-Bahn zurück"], costs: [{ label: "HVV & Fähre", value: "12 €" }, { label: "Essen", value: "7 €" }, { label: "Kaffee", value: "2 €" }], gear: ["Decke", "Badezeug", "Snacks", "Windjacke"], accent: "clay" }),
  makeTrip({ id: "hesse", title: "Hessen: Edersee-Waldkante", region: "Hessen", image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80", cost: 39, distance: "155 km", duration: "2 Tage", difficulty: "medium", transport: "RE + Bus", nights: "1 Nacht", description: "Waldkante, Staumauer und ein See, der sich wie Urlaub anfühlt – nur näher.", route: ["Sa · 07:00 — Kassel → Vöhl", "Sa · 10:30 — Urwaldsteig bis Asel", "Sa · 18:00 — Trekkingplatz im Nationalpark", "So · 09:00 — Ederseeufer & Heimweg"], costs: [{ label: "Bahn & Bus", value: "23 €" }, { label: "Trekkingplatz", value: "8 €" }, { label: "Proviant", value: "8 €" }], gear: ["Wasserfilter", "Zelt", "Wanderschuhe", "Offline-Karte"], accent: "pine" }),
  makeTrip({ id: "mecklenburg", title: "Mecklenburg-Vorpommern: Seenplatte per Rad", region: "Mecklenburg-Vorpommern", image: "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=900&q=80", cost: 36, distance: "120 km", duration: "2 Tage", difficulty: "easy", transport: "RE + Rad", nights: "1 Nacht", description: "Ein See nach dem anderen, flache Kilometer und genug Badepausen für zwei Tage.", route: ["Sa · 08:15 — Berlin → Neustrelitz", "Sa · 10:30 — Müritz-Radweg nach Wesenberg", "Sa · 17:30 — Camping am Kleinen Labussee", "So · 09:00 — Seenschleife & Zug zurück"], costs: [{ label: "Bahn", value: "18 €" }, { label: "Camping", value: "10 €" }, { label: "Essen", value: "8 €" }], gear: ["Fahrrad", "Badesachen", "Sonnenhut", "Zelt"], accent: "saffron" }),
  makeTrip({ id: "lower-saxony", title: "Niedersachsen: Lüneburger Heide", region: "Niedersachsen", image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80", cost: 29, distance: "65 km", duration: "2 Tage", difficulty: "easy", transport: "RE + Bus", nights: "1 Nacht", description: "Weite Heideflächen, wenig Höhenmeter und ein Abend, der nach Kiefern riecht.", route: ["Sa · 08:40 — Hamburg → Schneverdingen", "Sa · 10:30 — Heidschnuckenweg-Etappe", "Sa · 17:30 — Jugendzeltplatz im Wald", "So · 09:00 — Heide loop & Rückfahrt"], costs: [{ label: "Bahn & Bus", value: "17 €" }, { label: "Zeltplatz", value: "7 €" }, { label: "Snacks", value: "5 €" }], gear: ["Wasser", "Sonnencreme", "Isomatte", "Mückenspray"], accent: "clay" }),
  makeTrip({ id: "nrw", title: "NRW: Eifelsteig mit Vulkanblick", region: "Nordrhein-Westfalen", image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80", cost: 33, distance: "95 km", duration: "2 Tage", difficulty: "medium", transport: "RE + Bus", nights: "1 Nacht", description: "Kraterseen, Waldpfade und eine kleine Flucht aus dem dichtesten Bundesland.", route: ["Sa · 07:30 — Köln → Blankenheim", "Sa · 10:30 — Eifelsteig bis Nettersheim", "Sa · 18:00 — Trekkingplatz am Waldrand", "So · 09:00 — Urftquelle & Rückfahrt"], costs: [{ label: "Bahn & Bus", value: "20 €" }, { label: "Trekkingplatz", value: "8 €" }, { label: "Proviant", value: "5 €" }], gear: ["Feste Schuhe", "Regenlayer", "Stirnlampe", "Erste Hilfe"], accent: "pine" }),
  makeTrip({ id: "rhineland", title: "Rheinland-Pfalz: Moselsteig kompakt", region: "Rheinland-Pfalz", image: "https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=900&q=80", cost: 41, distance: "130 km", duration: "2 Tage", difficulty: "medium", transport: "RE + Fähre", nights: "1 Nacht", description: "Weinberge, Flusskurven und ein Panorama, das du dir mit ein paar Höhenmetern verdienst.", route: ["Sa · 07:20 — Koblenz → Cochem", "Sa · 10:00 — Moselsteig Richtung Beilstein", "Sa · 18:00 — Camping oberhalb der Mosel", "So · 08:30 — Aussichtsschleife & Fähre"], costs: [{ label: "Bahn & Fähre", value: "25 €" }, { label: "Camping", value: "9 €" }, { label: "Essen", value: "7 €" }], gear: ["Wanderschuhe", "Sonnenhut", "Tarp", "Wasser"], accent: "saffron" }),
  makeTrip({ id: "saarland", title: "Saarland: Saarschleife früh", region: "Saarland", image: "https://images.unsplash.com/photo-1494783367193-149034c05e8f?auto=format&fit=crop&w=900&q=80", cost: 31, distance: "50 km", duration: "1 Tag", difficulty: "easy", transport: "RE + Bus", nights: "Tagestrip", description: "Früh los, hoch zum Baumwipfelpfad und zurück an die Saar – klein, aber sehr draußen.", route: ["08:00 — Saarbrücken → Mettlach", "09:30 — Tafeltour zur Saarschleife", "13:00 — Picknick am Aussichtspunkt", "17:00 — Saarufer & Rückfahrt"], costs: [{ label: "Bahn & Bus", value: "18 €" }, { label: "Eintritt", value: "8 €" }, { label: "Essen", value: "5 €" }], gear: ["Wasser", "Sonnencreme", "Decke", "Kamera"], accent: "clay" }),
  makeTrip({ id: "saxony", title: "Sachsen: Sächsische Schweiz", region: "Sachsen", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80", cost: 38, distance: "190 km", duration: "2 Tage", difficulty: "medium", transport: "EC + S-Bahn", nights: "1 Nacht", description: "Sandstein, Nebel über der Elbe und ein Aussichtspunkt, der sich nach mehr anfühlt als 38 €.", route: ["Sa · 06:45 — Dresden → Schmilka", "Sa · 10:30 — Malerweg bis Papststein", "Sa · 17:00 — Zeltplatz am Lilienstein", "So · 07:30 — Sonnenaufgang an der Bastei"], costs: [{ label: "Zug & Fähre", value: "22 €" }, { label: "Zeltplatz", value: "10 €" }, { label: "Proviant", value: "6 €" }], gear: ["Feste Schuhe", "Stirnlampe", "Kleines Zelt", "Offline-Karte"], accent: "pine" }),
  makeTrip({ id: "saxony-anhalt", title: "Sachsen-Anhalt: Harz auf Nebenwegen", region: "Sachsen-Anhalt", image: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=80", cost: 35, distance: "115 km", duration: "2 Tage", difficulty: "medium", transport: "RE + Bus", nights: "1 Nacht", description: "Fichtenwald, Granit und ein ruhigerer Weg zum Brocken – Harz ohne Gipfelstress.", route: ["Sa · 07:00 — Magdeburg → Wernigerode", "Sa · 10:30 — Ilsestein-Runde", "Sa · 17:30 — Trekkingplatz am Wald", "So · 08:00 — Torfhaus & Heimfahrt"], costs: [{ label: "Bahn & Bus", value: "19 €" }, { label: "Trekkingplatz", value: "9 €" }, { label: "Essen", value: "7 €" }], gear: ["Warme Schicht", "Wanderschuhe", "Wasser", "Kopflampe"], accent: "saffron" }),
  makeTrip({ id: "schleswig", title: "Schleswig-Holstein: Ostseeküste", region: "Schleswig-Holstein", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80", cost: 32, distance: "90 km", duration: "2 Tage", difficulty: "easy", transport: "RE + Rad", nights: "1 Nacht", description: "Steilküste, Wind und eine Nacht im Zelt – die Ostsee ist näher als dein Fernweh.", route: ["Sa · 08:00 — Kiel → Eckernförde", "Sa · 10:00 — Küstenweg nach Schwedeneck", "Sa · 17:00 — Camping an der Bucht", "So · 09:00 — Strandrunde & Regionalbahn"], costs: [{ label: "Bahn", value: "16 €" }, { label: "Camping", value: "10 €" }, { label: "Proviant", value: "6 €" }], gear: ["Windjacke", "Badesachen", "Zelt", "Powerbank"], accent: "clay" }),
  makeTrip({ id: "thuringia", title: "Thüringen: Rennsteig-Starter", region: "Thüringen", image: "https://images.unsplash.com/photo-1521336575822-6da63fb45455?auto=format&fit=crop&w=900&q=80", cost: 30, distance: "120 km", duration: "2 Tage", difficulty: "medium", transport: "RE + Bus", nights: "1 Nacht", description: "Moosige Pfade und Höhenluft im Thüringer Wald – der perfekte erste Fernwander-Schritt.", route: ["Sa · 07:30 — Erfurt → Ilmenau", "Sa · 10:30 — Rennsteig Richtung Schmücke", "Sa · 18:00 — Jugendherberge oder Trekkingplatz", "So · 08:30 — Kickelhahn & Rückfahrt"], costs: [{ label: "Bahn & Bus", value: "18 €" }, { label: "Schlafen", value: "7 €" }, { label: "Essen", value: "5 €" }], gear: ["Wanderschuhe", "Regenlayer", "Isomatte", "Wasser"], accent: "pine" }),
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
  const [location, setLocation] = useState("Deutschland");
  const [budget, setBudget] = useState(60);
  const [activeFilter, setActiveFilter] = useState<FilterName>("Alle");
  const [sortBy, setSortBy] = useState("budget");
  const [plannerMessage, setPlannerMessage] = useState("");
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredTrips = useMemo(() => {
    const query = location.trim().toLowerCase();
    const filtered = trips.filter((trip) => {
      const matchesLocation = !query || query === "deutschland" || trip.region.toLowerCase().includes(query) || trip.title.toLowerCase().includes(query);
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
        ? location.trim().toLowerCase() === "deutschland"
          ? `Alles klar. Ich zeige dir günstige Wochenendideen in ganz Deutschland unter ${budget} €.`
          : `Alles klar. Ich suche günstige Wochenendideen ab ${location.trim()} unter ${budget} €.`
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
          <h1>Raus aus dem Feed.<br /><em>Rein in die Wildnis.</em></h1>
          <p className="hero-lede">Günstige Abenteuer in allen 16 Bundesländern, die wirklich ab deiner Haustür starten. Mit groben Routen, ehrlichen Kosten und einer Packliste, die nicht nach Expedition aussieht.</p>
          <button className="hero-cta" onClick={scrollToPlanner}>Sidequest planen <ArrowUpRight size={19} /></button>
          <div className="hero-note"><span>01</span><span className="hero-note-rule" /><span>für kleine Budgets<br />und große Neugier</span></div>
          <div className="hero-facts" aria-label="Planungsfakten">
            <span><MapPin size={14} /> deutschlandweit</span>
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
              <span><MapPin size={15} /> Startort oder Bundesland</span>
              <input list="bundesland-options" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="z. B. Berlin oder Bayern" aria-label="Startort oder Bundesland" />
              <datalist id="bundesland-options">
                {['Deutschland', 'Baden-Württemberg', 'Bayern', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg', 'Hessen', 'Mecklenburg-Vorpommern', 'Niedersachsen', 'Nordrhein-Westfalen', 'Rheinland-Pfalz', 'Saarland', 'Sachsen', 'Sachsen-Anhalt', 'Schleswig-Holstein', 'Thüringen'].map((state) => <option key={state} value={state} />)}
              </datalist>
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
          <div className="planner-footnote"><span className="footnote-star">✳</span> 16 Bundesländer, 16 Einstiege. Die Preise sind Schätzwerte pro Person – lieber etwas Puffer einplanen.</div>
        </div>
      </section>

      <section className="adventures-section" id="abenteuer">
        <div className="adventures-topline">
          <div>
            <div className="eyebrow eyebrow-dark"><span className="eyebrow-marker" /> sidequests in deutschland</div>
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
