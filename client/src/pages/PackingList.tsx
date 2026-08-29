/* Trail Notes reminder: This page is the calm pre-departure desk—clear checklist hierarchy, saffron route marks, and practical notes over decoration. */

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Backpack, Check, CircleDollarSign, Compass, RotateCcw, Route, Save, Tent, TrainFront } from "lucide-react";
import { Link } from "wouter";
import { createPackingList, packingCategories, type PackingCategory } from "@/lib/packing";
import { trips } from "./Home";

const STORAGE_KEY = "plan-a-sidequest-packed";

export default function PackingList() {
  const params = new URLSearchParams(window.location.search);
  const requestedTrip = params.get("trip");
  const trip = trips.find((item) => item.id === requestedTrip) ?? trips[0];
  const items = useMemo(() => createPackingList(trip), [trip]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [showEssentials, setShowEssentials] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Record<string, Record<string, boolean>>;
      setChecked(saved[trip.id] ?? {});
    } catch {
      setChecked({});
    }
  }, [trip.id]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Record<string, Record<string, boolean>>;
      saved[trip.id] = checked;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      // localStorage may be unavailable in private browsing; the checklist still works in memory.
    }
  }, [checked, trip.id]);

  const visibleItems = showEssentials ? items.filter((item) => item.essential) : items;
  const packedCount = items.filter((item) => checked[item.id]).length;
  const percentage = Math.round((packedCount / items.length) * 100);

  function toggleItem(id: string) {
    setChecked((current) => ({ ...current, [id]: !current[id] }));
  }

  function resetList() {
    setChecked({});
  }

  return (
    <main className="packing-shell">
      <header className="packing-header">
        <Link className="brand-lockup packing-brand" href="/" aria-label="Zurück zu Plan-a-Sidequest">
          <img src="/manus-storage/sidequest-mark_21ad81d5.png" alt="" className="brand-mark" />
          <span className="brand-wordmark">Plan-a-Sidequest<span className="brand-dash">↗</span></span>
        </Link>
        <Link className="packing-back" href={`/?trip=${trip.id}#abenteuer`}><ArrowLeft size={16} /> Zurück zur Sidequest</Link>
      </header>

      <section className="packing-hero">
        <div className="packing-hero-copy">
          <div className="eyebrow eyebrow-dark"><span className="eyebrow-marker" /> zwischenstopp · packliste</div>
          <h1>Rucksack auf.<br /><em>Kopf frei.</em></h1>
          <p>Eine ausführliche, aber realistische Liste für <strong>{trip.title}</strong>. Erst leihen oder aus dem Schrank holen, dann kaufen.</p>
          <div className="packing-trip-meta"><span><MapPinIcon /> {trip.region}</span><span><TrainFront size={15} /> {trip.transport}</span><span><CircleDollarSign size={15} /> ca. {trip.cost} €</span></div>
        </div>
        <div className="packing-hero-image-wrap"><img src={trip.image} alt={`Landschaft für ${trip.title}`} /><span className="packing-image-note">NOTIZ 03 · NICHTS MUSS NEU SEIN</span></div>
      </section>

      <section className="packing-workspace">
        <div className="packing-progress-panel">
          <div className="packing-progress-top"><span>DEIN PACKSTATUS</span><strong>{packedCount}/{items.length}</strong></div>
          <div className="packing-progress-track"><span style={{ width: `${percentage}%` }} /></div>
          <p>{percentage === 100 ? "Alles drin. Jetzt nur noch los." : percentage > 0 ? `${percentage}% gepackt – das wird.` : "Noch nichts abgehakt. Der erste Schritt zählt."}</p>
          <div className="packing-actions"><button className={`essential-toggle ${showEssentials ? "essential-toggle-active" : ""}`} onClick={() => setShowEssentials((value) => !value)}><Compass size={15} /> {showEssentials ? "Alles zeigen" : "Nur Essentials"}</button><button className="reset-list" onClick={resetList}><RotateCcw size={14} /> Zurücksetzen</button></div>
        </div>
        <div className="packing-list-column">
          <div className="packing-list-intro"><div><span className="list-index">03</span><h2>Was wirklich<br /><em>mit muss.</em></h2></div><p>Abhaken, was schon da ist. Die kleinen Notizen helfen beim Improvisieren.</p></div>
          <div className="packing-categories">
            {packingCategories.map((category: PackingCategory) => {
              const categoryItems = visibleItems.filter((item) => item.category === category);
              if (!categoryItems.length) return null;
              return <div className="packing-category" key={category}><div className="packing-category-head"><h3>{categoryIcon(category)} {category}</h3><span>{categoryItems.filter((item) => checked[item.id]).length}/{categoryItems.length}</span></div><div className="packing-items">{categoryItems.map((item) => <label className={`packing-item ${checked[item.id] ? "packing-item-checked" : ""}`} key={item.id}><input type="checkbox" checked={Boolean(checked[item.id])} onChange={() => toggleItem(item.id)} /><span className="packing-checkbox"><Check size={14} /></span><span className="packing-item-copy"><strong>{item.item}{item.essential && <b>essentiell</b>}</strong><small>{item.note}</small></span></label>)}</div></div>;
            })}
          </div>
          <div className="packing-bottom-note"><Save size={16} /><span>Dein Fortschritt wird automatisch auf diesem Gerät gespeichert.</span></div>
        </div>
      </section>

      <footer className="packing-footer"><Link href="/"><Backpack size={17} /> Plan-a-Sidequest</Link><span>Weniger Zeug. Mehr Weg.</span><Link href={`/?trip=${trip.id}#abenteuer`}>Noch eine Sidequest <ArrowLeft size={14} /></Link></footer>
    </main>
  );
}

function categoryIcon(category: PackingCategory) {
  if (category === "Schlafen") return <Tent size={17} />;
  if (category === "Navigation & Safety") return <Route size={17} />;
  if (category === "Essen & Trinken") return <CircleDollarSign size={17} />;
  return <Backpack size={17} />;
}

function MapPinIcon() {
  return <span className="packing-map-pin" aria-hidden="true">↗</span>;
}
