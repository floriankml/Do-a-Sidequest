/* Trail Notes reminder: A packlist should feel like a calm field-note checklist—specific, borrow-first, and useful before leaving. */

import type { Trip } from "@/pages/Home";

export type PackingCategory =
  | "Schlafen"
  | "Klamotten"
  | "Essen & Trinken"
  | "Navigation & Safety"
  | "Draußen";

export type PackingItem = {
  id: string;
  item: string;
  note: string;
  category: PackingCategory;
  essential: boolean;
};

export function createPackingList(trip: Trip): PackingItem[] {
  const overnight = trip.nights === "1 Nacht";
  const bike = trip.transport.includes("Rad");
  const water =
    trip.title.toLowerCase().includes("see") ||
    trip.title.toLowerCase().includes("küste") ||
    trip.title.toLowerCase().includes("ostsee") ||
    trip.title.toLowerCase().includes("watt") ||
    trip.title.toLowerCase().includes("badestrand");
  const id = (value: string) => `${trip.id}-${value}`;

  const items: PackingItem[] = [
    {
      id: id("water"),
      item: "Wasserflasche (mind. 1 L)",
      note: "Vor dem Start auffüllen; unterwegs nach einer Quelle schauen.",
      category: "Essen & Trinken",
      essential: true,
    },
    {
      id: id("snacks"),
      item: overnight ? "Proviant für 2 Tage" : "Snacks für unterwegs",
      note: "Brot, Obst, Nüsse oder was schon zu Hause ist – kein Outdoor-Menü nötig.",
      category: "Essen & Trinken",
      essential: true,
    },
    {
      id: id("cash"),
      item: "Karte + etwas Bargeld",
      note: "Für Kiosk, Fähre oder den letzten Kaffee am Bahnhof.",
      category: "Navigation & Safety",
      essential: true,
    },
    {
      id: id("phone"),
      item: "Handy mit Offline-Karte",
      note: "Route vorher herunterladen, Empfang ist im Wald kein Versprechen.",
      category: "Navigation & Safety",
      essential: true,
    },
    {
      id: id("powerbank"),
      item: "Powerbank + Ladekabel",
      note: "Besonders wichtig bei langen Rückfahrten oder kaltem Wetter.",
      category: "Navigation & Safety",
      essential: false,
    },
    {
      id: id("firstaid"),
      item: "Mini-Erste-Hilfe-Set",
      note: "Blasenpflaster, Tape, Desinfektion und persönliche Medikamente.",
      category: "Navigation & Safety",
      essential: true,
    },
    {
      id: id("headlamp"),
      item: "Stirnlampe oder kleine Lampe",
      note: "Auch für den Rückweg vom Waschhaus – nicht nur für Nachtwanderungen.",
      category: "Navigation & Safety",
      essential: overnight,
    },
    {
      id: id("layers"),
      item: "T-Shirt + warme Zwischenschicht",
      note: "Zwei dünne Schichten sind flexibler als eine dicke Jacke.",
      category: "Klamotten",
      essential: true,
    },
    {
      id: id("rain"),
      item: "Regenjacke oder Poncho",
      note: "Klein zusammenpackbar und oft wichtiger als die Wetter-App.",
      category: "Klamotten",
      essential: true,
    },
    {
      id: id("socks"),
      item: "Ersatzsocken",
      note: "Trocken bleiben = bessere Laune. In einen Zip-Beutel packen.",
      category: "Klamotten",
      essential: true,
    },
    {
      id: id("sun"),
      item: "Sonnen- und Lippenschutz",
      note: "Auch bei Wolken; besonders an See, Küste und auf freien Höhen.",
      category: "Draußen",
      essential: false,
    },
    {
      id: id("trash"),
      item: "Kleiner Müllbeutel",
      note: "Für Snacks, nasse Sachen und alles, was wieder mit zurückkommt.",
      category: "Draußen",
      essential: true,
    },
  ];

  if (overnight) {
    items.push(
      {
        id: id("sleepingbag"),
        item: "Schlafsack",
        note: "Leihen ist völlig okay – Hauptsache warm genug für die Nacht.",
        category: "Schlafen",
        essential: true,
      },
      {
        id: id("mat"),
        item: "Isomatte",
        note: "Bodenwärme ist wichtiger als ein fancy Kissen.",
        category: "Schlafen",
        essential: true,
      },
      {
        id: id("shelter"),
        item: "Zelt oder Tarp",
        note: "Vorher prüfen, ob der Schlafplatz Zelten erlaubt.",
        category: "Schlafen",
        essential: true,
      },
      {
        id: id("toiletries"),
        item: "Mini-Waschset + kleines Handtuch",
        note: "Zahnbürste, Zahnpasta, Seife; in Reisegröße bleibt Platz.",
        category: "Schlafen",
        essential: false,
      }
    );
  } else {
    items.push({
      id: id("blanket"),
      item: water ? "Decke oder Sitzunterlage" : "Sitzunterlage",
      note: "Für Pausen, Picknick und trockene Kleidung auf nassem Boden.",
      category: "Draußen",
      essential: false,
    });
  }

  if (bike) {
    items.push(
      {
        id: id("bike-lights"),
        item: "Fahrradlicht vorne + hinten",
        note: "Auch bei Tagesfahrten: Rückfahrt kann länger dauern als gedacht.",
        category: "Navigation & Safety",
        essential: true,
      },
      {
        id: id("bike-repair"),
        item: "Mini-Pumpe + Ersatzschlauch",
        note: "Oder vorher checken, wo der nächste Radladen liegt.",
        category: "Draußen",
        essential: true,
      }
    );
  }

  if (water) {
    items.push({
      id: id("swim"),
      item: "Badesachen",
      note: "Nur wenn Wetter, Gewässer und Regeln es zulassen.",
      category: "Draußen",
      essential: false,
    });
  }

  return items;
}

export const packingCategories: PackingCategory[] = [
  "Navigation & Safety",
  "Klamotten",
  "Essen & Trinken",
  "Schlafen",
  "Draußen",
];
