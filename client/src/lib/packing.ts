/* Trail Notes reminder: A packlist should feel like a calm field-note checklist—specific, borrow-first, and useful before leaving. */

import type { PackTag, Trip } from "@/lib/quests";

export type PackingCategory = "Quest-Ausrüstung" | "Schlafen" | "Klamotten" | "Essen & Trinken" | "Navigation & Safety" | "Draußen";

export type PackingItem = {
  id: string;
  item: string;
  note: string;
  category: PackingCategory;
  essential: boolean;
};

export type PackingPlan = {
  items: PackingItem[];
  /** Gear entries that describe an attitude ("Neugier", "Mut") rather than something to pack. */
  mindset: string[];
  summary: string;
};

// Gear words that name a mindset, not an object – these are shown as a reminder instead of a checkbox.
const mindsetWords = ["neugier", "mut", "laune", "geduld", "blick", "respekt", "fantasie", "ehrlichkeit", "stille", "offenheit", "hunger", "ohren", "geschmack", "gast"];
const isMindset = (gear: string) => mindsetWords.some((word) => gear.toLowerCase().split(/[^a-zäöüß]+/).includes(word));

type Rule = Omit<PackingItem, "id" | "essential"> & { key: string; covers: RegExp; when: (ctx: Context) => boolean; essential: (ctx: Context) => boolean };
type Context = { trip: Trip; tags: Set<PackTag>; outdoors: boolean; nature: boolean; hours: number; night: boolean; overnight: boolean };

const always = () => true;

const rules: Rule[] = [
  // Navigation & Safety
  { key: "phone", covers: /handy/i, item: "Handy, voll geladen", note: "Für Notfälle, Fotos und den Rückweg – vorher aufladen.", category: "Navigation & Safety", when: (c) => c.trip.setting !== "home", essential: always },
  { key: "offline-map", covers: /offline-karte|karte aus papier|sternkarte/i, item: "Offline-Karte der Gegend", note: "In der Karten-App herunterladen – Empfang ist im Wald kein Versprechen.", category: "Navigation & Safety", when: (c) => c.nature || c.tags.has("travel"), essential: (c) => c.nature },
  { key: "ticket", covers: /ticket/i, item: "Ticket oder Deutschlandticket", note: "Vor der Abfahrt kaufen bzw. in der App bereithalten.", category: "Navigation & Safety", when: (c) => /ÖPNV|Zug/i.test(c.trip.transport), essential: (c) => c.tags.has("travel") || c.trip.transport === "ÖPNV" || c.trip.transport === "Regionalzug" },
  { key: "cash", covers: /bargeld|€|euro|münze/i, item: "Karte + etwas Bargeld", note: "Kleine Läden, Märkte und Kioske nehmen oft nur bar.", category: "Navigation & Safety", when: (c) => c.trip.cost > 0 || c.tags.has("travel"), essential: (c) => c.trip.cost > 0 && c.trip.setting !== "nature" },
  { key: "powerbank", covers: /powerbank/i, item: "Powerbank + Ladekabel", note: "Navigation und Fotos leeren den Akku schneller als gedacht.", category: "Navigation & Safety", when: (c) => c.outdoors && (c.hours >= 4 || c.night) || c.tags.has("travel"), essential: (c) => c.tags.has("travel") || c.overnight },
  { key: "headlamp", covers: /lampe|notlicht|rotlicht/i, item: "Stirnlampe oder Taschenlampe", note: "Auch wenn die Mission im Dunkeln spielt: für den Rückweg und Notfälle.", category: "Navigation & Safety", when: (c) => c.night && c.outdoors, essential: (c) => c.nature },
  { key: "firstaid", covers: /erste-hilfe/i, item: "Mini-Erste-Hilfe-Set", note: "Blasenpflaster, Tape, Desinfektion und persönliche Medikamente.", category: "Navigation & Safety", when: (c) => c.nature && (c.hours >= 3 || c.trip.difficulty !== "easy" || c.tags.has("bike") || c.tags.has("fire")), essential: (c) => c.overnight || c.trip.difficulty === "hard" || c.tags.has("fire") },
  { key: "bike-lights", covers: /fahrradlicht/i, item: "Fahrradlicht vorne + hinten", note: "Die Rückfahrt dauert oft länger als geplant.", category: "Navigation & Safety", when: (c) => c.tags.has("bike"), essential: always },
  { key: "bike-repair", covers: /flickzeug|schlauch/i, item: "Flickzeug oder Ersatzschlauch", note: "Oder vorher checken, wo der nächste Radladen liegt.", category: "Draußen", when: (c) => c.tags.has("bike"), essential: () => false },
  // Klamotten
  { key: "layers", covers: /warme schicht|wetterfeste schicht|zwischenschicht/i, item: "Warme Zwischenschicht", note: "Morgens, abends und auf Anhöhen wird es schnell kühl.", category: "Klamotten", when: (c) => c.nature || (c.night && c.outdoors), essential: (c) => c.night },
  { key: "rain", covers: /regen|poncho|wetterfeste/i, item: "Regenjacke oder Poncho", note: "Klein zusammenpackbar – vorher kurz den Wetterbericht checken.", category: "Klamotten", when: (c) => c.outdoors && (c.nature ? c.hours >= 2 : c.hours >= 3), essential: (c) => c.nature && c.hours >= 3 && !c.tags.has("swim") },
  { key: "shoes", covers: /schuhe/i, item: "Bequeme, feste Schuhe", note: "Du bist länger zu Fuß unterwegs, als es sich anfühlt.", category: "Klamotten", when: (c) => c.outdoors && c.hours >= 3 && !c.tags.has("bike") && !c.tags.has("swim"), essential: (c) => c.nature },
  { key: "socks", covers: /ersatzsocken/i, item: "Ersatzsocken", note: "Nasse Füße ruinieren jede Mission. In einen Zip-Beutel packen.", category: "Klamotten", when: (c) => c.nature && !c.tags.has("swim") && (c.hours >= 4 || c.overnight), essential: (c) => c.overnight },
  { key: "sports", covers: /sportkleidung/i, item: "Sportkleidung", note: "Atmungsaktiv, plus ein trockenes Shirt für danach.", category: "Klamotten", when: (c) => c.tags.has("sport"), essential: always },
  { key: "swim", covers: /bade/i, item: "Badesachen + Handtuch", note: "Nur an offiziellen Badestellen und wenn Wetter und Wasser es zulassen.", category: "Klamotten", when: (c) => c.tags.has("swim"), essential: always },
  // Essen & Trinken
  { key: "water", covers: /wasserflasche|^wasser$/i, item: "Wasserflasche (mind. 1 L)", note: "Vor dem Start auffüllen.", category: "Essen & Trinken", when: (c) => c.outdoors && (c.hours >= 3 || c.nature), essential: (c) => c.nature || c.hours >= 4 },
  { key: "snacks", covers: /snack|proviant/i, item: "Snacks für unterwegs", note: "Brot, Obst, Nüsse – was schon zu Hause ist.", category: "Essen & Trinken", when: (c) => c.outdoors && c.hours >= 3 && !c.overnight && c.trip.category !== "Food" && !c.tags.has("cook") && !c.tags.has("fire"), essential: (c) => c.hours >= 5 },
  { key: "provisions", covers: /proviant/i, item: "Proviant für Abendessen + Frühstück", note: "Einfach halten: Brot, Aufstrich, Obst, etwas Warmes in der Thermoskanne.", category: "Essen & Trinken", when: (c) => c.overnight, essential: always },
  { key: "cup", covers: /becher/i, item: "Becher für jede Person", note: "Für Tee aus der Thermoskanne – Einweg bleibt zu Hause.", category: "Essen & Trinken", when: (c) => c.trip.gear.some((gear) => /thermoskanne/i.test(gear)), essential: () => false },
  { key: "cutlery", covers: /messer/i, item: "Taschenmesser + Servietten", note: "Zum Teilen, Schneiden und Aufräumen.", category: "Essen & Trinken", when: (c) => c.tags.has("picnic") || c.tags.has("fire"), essential: () => false },
  // Draußen
  { key: "lighter", covers: /feuerzeug|streichh/i, item: "Feuerzeug oder Streichhölzer + Anzünder", note: "Nur an der offiziellen Feuerstelle benutzen.", category: "Draußen", when: (c) => c.tags.has("fire"), essential: always },
  { key: "sticks", covers: /stöcke|spieße/i, item: "Stöcke für das Stockbrot", note: "Vorher zu Hause schnitzen oder Holzspieße nehmen – keine Äste von lebenden Bäumen abbrechen.", category: "Draußen", when: (c) => c.tags.has("fire"), essential: always },
  { key: "seat", covers: /decke|sitzunterlage/i, item: "Sitzunterlage oder Decke", note: "Für Pausen auf nassem oder kaltem Boden.", category: "Draußen", when: (c) => c.nature && !c.overnight && (c.night || c.tags.has("picnic") || c.hours >= 3), essential: (c) => c.night },
  { key: "sun", covers: /sonnenschutz/i, item: "Sonnen- und Lippenschutz", note: "Auch bei Wolken; besonders am Wasser und auf freien Höhen.", category: "Draußen", when: (c) => c.outdoors && !c.night && (c.nature || c.hours >= 4), essential: (c) => c.tags.has("swim") },
  { key: "trash", covers: /müll/i, item: "Kleiner Müllbeutel", note: "Alles, was mitkommt, geht auch wieder mit nach Hause.", category: "Draußen", when: (c) => c.nature || c.tags.has("picnic"), essential: (c) => c.tags.has("picnic") || c.tags.has("fire") || c.overnight },
  // Schlafen
  { key: "sleepingbag", covers: /schlafsack/i, item: "Schlafsack", note: "Leihen ist völlig okay – Komforttemperatur zur Nacht passend wählen.", category: "Schlafen", when: (c) => c.overnight, essential: always },
  { key: "mat", covers: /isomatte/i, item: "Isomatte", note: "Bodenkälte ist der häufigste Grund für eine schlechte Nacht.", category: "Schlafen", when: (c) => c.overnight, essential: always },
  { key: "shelter", covers: /zelt|tarp|hängematte/i, item: "Zelt, Tarp oder Hängematte", note: "Vorher prüfen, was am Übernachtungsplatz erlaubt ist.", category: "Schlafen", when: (c) => c.overnight, essential: always },
  { key: "toiletries", covers: /zahnbürste/i, item: "Zahnbürste + kleines Handtuch", note: "Reisegröße reicht völlig.", category: "Schlafen", when: (c) => c.overnight, essential: () => false },
];

const settingSummary: Record<Trip["setting"], string> = {
  home: "Keine Anreise nötig – du brauchst nur, was die Mission selbst verlangt.",
  indoor: "Die Mission spielt drinnen: wenig Gepäck, dafür Ticket und Zahlungsmittel.",
  city: "Unterwegs in der Stadt: leicht packen, das Wichtigste griffbereit.",
  nature: "Draußen in der Natur: Wetter, Wasser und Rückweg mitdenken.",
};

export function createPackingList(trip: Trip): PackingPlan {
  const tags = new Set(trip.packTags ?? []);
  const overnight = tags.has("overnight");
  const ctx: Context = { trip, tags, outdoors: trip.setting === "city" || trip.setting === "nature", nature: trip.setting === "nature", hours: trip.durationHours, night: tags.has("night") || overnight, overnight };
  const id = (value: string) => `${trip.id}-${value}`;
  const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9äöüß]+/g, "-");

  // The quest's own gear comes first: it is exactly what the mission needs. Mindset entries become a reminder instead.
  const mindset = trip.gear.filter(isMindset);
  const questGear = trip.gear.filter((gear) => !isMindset(gear));
  const items: PackingItem[] = questGear.map((gear) => ({ id: id(`gear-${slug(gear)}`), item: gear, note: "Steht im Mission-Briefing – ohne das wird es schwierig.", category: "Quest-Ausrüstung", essential: true }));

  // Generic items only when the setting and circumstances call for them, and never twice when the quest gear already names them.
  for (const rule of rules) {
    if (!rule.when(ctx) || questGear.some((gear) => rule.covers.test(gear))) continue;
    // Phone-free missions still carry a phone for emergencies – it just stays in the bag.
    const phoneFree = rule.key === "phone" && /ohne handy/i.test(trip.title);
    items.push({ id: id(rule.key), item: phoneFree ? "Handy für den Notfall" : rule.item, note: phoneFree ? "Bleibt ausgeschaltet im Rucksack – nur für den Notfall." : rule.note, category: rule.category, essential: rule.essential(ctx) });
  }

  return { items, mindset, summary: settingSummary[trip.setting] };
}

export const packingCategories: PackingCategory[] = ["Quest-Ausrüstung", "Navigation & Safety", "Klamotten", "Essen & Trinken", "Schlafen", "Draußen"];
