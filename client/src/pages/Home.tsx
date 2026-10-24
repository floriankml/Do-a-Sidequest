/* Sidequest redesign: dark minimal gaming interface, real-life motivation, vivid quest metadata, and one clear action—accept the mission. */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight, ArrowUpRight, Backpack, Check, ChevronRight, CircleDollarSign, Clock3, Compass, Dice5, Dumbbell,
  Feather, Flame, Gamepad2, HandHeart, Landmark, Map, Menu, Mountain, Palette, Pizza, RotateCcw, Route, Shuffle,
  Sparkles, Star, Tent, TrainFront, Users, X, Zap, Award, Gift, LockKeyhole, Medal, Trophy, Wallet, Wrench,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import QuestArt from "@/components/QuestArt";
import { categories, trips, type Difficulty, type QuestCategory, type Trip } from "@/lib/quests";

const categoryMeta: Record<QuestCategory, { icon: LucideIcon; color: string }> = {
  Outdoor: { icon: Mountain, color: "mint" }, Explore: { icon: TrainFront, color: "blue" }, Friends: { icon: Users, color: "yellow" }, Challenge: { icon: Dumbbell, color: "red" }, Creative: { icon: Palette, color: "violet" }, Food: { icon: Pizza, color: "orange" }, Spontaneous: { icon: Zap, color: "pink" }, Random: { icon: Dice5, color: "blue" }, Kultur: { icon: Landmark, color: "violet" }, Abenteuer: { icon: Tent, color: "red" }, Skill: { icon: Sparkles, color: "blue" }, Reflexion: { icon: Feather, color: "pink" }, Soziales: { icon: HandHeart, color: "orange" },
};

type BadgeMeta = { id: string; title: string; description: string; icon: LucideIcon; color: string; target: number; progress: (completed: Trip[]) => number };
const badgeMeta: BadgeMeta[] = [
  { id: "first-step", title: "First Step", description: "Deine erste Sidequest abgeschlossen.", icon: Award, color: "lime", target: 1, progress: (done) => done.length },
  { id: "creative-spark", title: "Creative Spark", description: "Drei kreative Missionen gemacht.", icon: Palette, color: "violet", target: 3, progress: (done) => done.filter((quest) => quest.category === "Creative").length },
  { id: "zero-budget", title: "Zero Budget", description: "Drei Sidequests für 0 € abgeschlossen.", icon: Medal, color: "cyan", target: 3, progress: (done) => done.filter((quest) => quest.cost === 0).length },
  { id: "good-company", title: "Good Company", description: "Drei Quests mit anderen erlebt.", icon: Gift, color: "orange", target: 3, progress: (done) => done.filter((quest) => quest.playerMode !== "solo").length },
  { id: "off-the-map", title: "Off the Map", description: "Drei Explore- oder Random-Quests abgeschlossen.", icon: Compass, color: "blue", target: 3, progress: (done) => done.filter((quest) => quest.category === "Explore" || quest.category === "Random").length },
  { id: "sidequest-veteran", title: "Sidequest Veteran", description: "Zehn Missionen abgeschlossen.", icon: Trophy, color: "pink", target: 10, progress: (done) => done.length },
];

type FinderAnswers = { time: string; budget: string; with: string; mood: string };
const emptyAnswers: FinderAnswers = { time: "", budget: "", with: "", mood: "" };
const FEATURED_COUNT = 9;
const COMPLETED_KEY = "sidequest-completed";
const ACCEPTED_KEY = "sidequest-accepted";

function readIds(key: string): string[] {
  try { const value = JSON.parse(localStorage.getItem(key) ?? "[]"); return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string" && trips.some((quest) => quest.id === id)) : []; } catch { return []; }
}
function writeIds(key: string, ids: string[]) {
  try { localStorage.setItem(key, JSON.stringify(ids)); } catch { /* localStorage may be blocked; progress then lives only in memory. */ }
}
function playerRange(players: string) { const numbers = players.match(/\d+/g)?.map(Number) ?? [1]; return { min: numbers[0], max: numbers[numbers.length - 1] }; }
function costLabel(cost: number) { return cost === 0 ? "0 €" : `bis ${cost} €`; }
function difficultyText(value: Difficulty) { return value === "easy" ? "leicht" : value === "medium" ? "mittel" : "schwer"; }

const matchers: Record<keyof FinderAnswers, (quest: Trip, value: string) => boolean> = {
  time: (quest, value) => value === "short" ? quest.durationHours <= 2 : value === "half" ? quest.durationHours <= 5 : value === "day" ? quest.durationHours <= 10 : true,
  budget: (quest, value) => value === "free" ? quest.cost === 0 : value === "ten" ? quest.cost <= 10 : value === "twentyfive" ? quest.cost <= 25 : true,
  with: (quest, value) => { const { min, max } = playerRange(quest.players); return value === "solo" ? min === 1 : value === "duo" ? min <= 2 && max >= 2 : value === "friends" ? max >= 3 : value === "group" ? max >= 4 : true; },
  mood: (quest, value) => !value || value === "random" || quest.category === value,
};
// When nothing fits, drop the softest constraint first so the result still respects time and budget as long as possible.
const relaxOrder: (keyof FinderAnswers)[] = ["mood", "with", "budget", "time"];

function findQuestPool(answers: FinderAnswers) {
  const active = (Object.keys(answers) as (keyof FinderAnswers)[]).filter((key) => answers[key]);
  for (let dropped = 0; dropped <= relaxOrder.length; dropped++) {
    const ignored = relaxOrder.slice(0, dropped);
    const pool = trips.filter((quest) => active.every((key) => ignored.includes(key) || matchers[key](quest, answers[key])));
    if (pool.length) return { pool, relaxed: ignored.filter((key) => active.includes(key)) };
  }
  return { pool: trips, relaxed: active };
}

const relaxLabels: Record<keyof FinderAnswers, string> = { mood: "Stimmung", with: "Mitspieler:innen", budget: "Budget", time: "Zeit" };

function CategoryIcon({ category, size = 16 }: { category: QuestCategory; size?: number }) { const Icon = categoryMeta[category].icon; return <Icon size={size} />; }
function Stars({ count }: { count: number }) { return <span className="quest-stars" aria-label={`${count} von 5`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} size={12} fill={index < count ? "currentColor" : "none"} />)}</span>; }
function BadgeCard({ badge, completed }: { badge: BadgeMeta; completed: Trip[] }) { const progress = Math.min(badge.progress(completed), badge.target); const isUnlocked = progress >= badge.target; const Icon = isUnlocked ? badge.icon : LockKeyhole; return <article className={`badge-card badge-card-${badge.color} ${isUnlocked ? "badge-unlocked" : "badge-locked"}`}><div className="badge-icon"><Icon size={22} /></div><div className="badge-copy"><div className="badge-status">{isUnlocked ? "UNLOCKED" : `${progress}/${badge.target}`}</div><h3>{badge.title}</h3><p>{badge.description}</p><div className="badge-track"><span style={{ width: `${(progress / badge.target) * 100}%` }} /></div></div></article>; }

type QuestStatus = "open" | "accepted" | "completed";
function StatusButton({ status, onAdvance, className }: { status: QuestStatus; onAdvance: () => void; className: string }) {
  const label = status === "completed" ? "Completed" : status === "accepted" ? "Als erledigt markieren" : "Accept Quest";
  return <button className={`${className} ${status === "completed" ? "accept-button-complete" : ""} ${status === "accepted" ? "accept-button-active" : ""}`} onClick={onAdvance} title={status === "completed" ? "Klicken, um die Quest wieder zu öffnen" : undefined}>{status === "completed" ? <Check size={15} /> : status === "accepted" ? <Flame size={15} /> : <Gamepad2 size={15} />} {label}</button>;
}

function QuestCard({ quest, onOpen, status, onAdvance }: { quest: Trip; onOpen: (quest: Trip) => void; status: QuestStatus; onAdvance: (quest: Trip) => void }) {
  return <article className={`quest-card quest-card-${categoryMeta[quest.category].color} ${status === "completed" ? "quest-card-completed" : ""}`}>
    <button className="quest-card-image" onClick={() => onOpen(quest)} aria-label={`${quest.title} – Details öffnen`}><QuestArt scene={quest.scene} seed={quest.id} accent={quest.accent} /><div className="quest-card-overlay" /><span className="quest-number">SIDEQUEST #{quest.questNo}</span><span className="quest-category-badge"><CategoryIcon category={quest.category} size={13} /> {quest.category}</span></button>
    <div className="quest-card-content"><div className="quest-card-topline"><span>MISSION</span><span>{status === "completed" ? "COMPLETED" : status === "accepted" ? "AKTIV" : "OFFEN"}</span></div><h3>{quest.title}</h3><p className="quest-mission">{quest.mission}</p><div className="quest-fact-grid"><span><Clock3 size={14} /> {quest.duration}</span><span><CircleDollarSign size={14} /> {costLabel(quest.cost)}</span><span><Users size={14} /> {quest.players}</span><span><Flame size={14} /> {difficultyText(quest.difficulty)}</span></div><div className="quest-card-reward"><span>REWARD</span><p>{quest.reward}</p></div><div className="quest-card-actions"><StatusButton className="accept-button" status={status} onAdvance={() => onAdvance(quest)} /><button className="details-button" onClick={() => onOpen(quest)}>Details <ArrowUpRight size={15} /></button></div></div>
  </article>;
}

function QuestModal({ quest, status, onAdvance, onClose }: { quest: Trip; status: QuestStatus; onAdvance: () => void; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onCloseRef.current(); };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = previousOverflow; previousFocus?.focus?.(); };
  }, []);
  return <div className="quest-modal-backdrop" onClick={onClose}><aside className="quest-modal" role="dialog" aria-modal="true" aria-labelledby="quest-modal-title" onClick={(event) => event.stopPropagation()}>
    <button ref={closeRef} className="modal-close" onClick={onClose} aria-label="Mission schließen"><X size={20} /></button>
    <div className="modal-image"><QuestArt scene={quest.scene} seed={quest.id} accent={quest.accent} /><span>SIDEQUEST #{quest.questNo}</span></div>
    <div className="modal-content">
      <div className="quest-card-topline"><span><CategoryIcon category={quest.category} size={14} /> {quest.category}</span><span>{quest.region}</span></div>
      <h2 id="quest-modal-title">{quest.title}</h2><p className="modal-tagline">{quest.description}</p><p className="modal-mission">{quest.mission}</p>
      <div className="modal-stat-row"><span><Clock3 size={15} /> {quest.duration}</span><span><CircleDollarSign size={15} /> {costLabel(quest.cost)}</span><span><Users size={15} /> {quest.players}</span><span><Route size={15} /> {quest.transport}</span><span><Flame size={15} /> Überraschung <Stars count={quest.surprise} /></span></div>
      <div className="modal-section"><span>MISSION RULES</span><ul>{quest.rules.map((rule) => <li key={rule}><Check size={15} /> {rule}</li>)}</ul></div>
      <div className="modal-section"><span>ABLAUF</span><ol className="modal-route">{quest.route.map((step) => <li key={step}>{step}</li>)}</ol></div>
      <div className="modal-columns"><div className="modal-section"><span><Wallet size={12} /> KOSTEN</span><ul>{quest.costs.map((item) => <li key={item.label} className="modal-cost"><span>{item.label}</span><strong>{item.value}</strong></li>)}</ul></div><div className="modal-section"><span><Wrench size={12} /> AUSRÜSTUNG</span><ul>{quest.gear.map((item) => <li key={item}><Backpack size={14} /> {item}</li>)}</ul></div></div>
      <div className="modal-section modal-reward"><span>REWARD</span><p>{quest.reward}</p></div>
      <div className="modal-actions"><StatusButton className="primary-sq-button" status={status} onAdvance={onAdvance} /><a className="modal-pack-link" href={`/packliste?trip=${quest.id}`}>Packliste öffnen <Backpack size={15} /></a></div>
    </div>
  </aside></div>;
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [finderStep, setFinderStep] = useState(0);
  const [finderAnswers, setFinderAnswers] = useState<FinderAnswers>(emptyAnswers);
  const [generated, setGenerated] = useState<{ quest: Trip; relaxed: (keyof FinderAnswers)[] } | null>(null);
  const [selectedQuest, setSelectedQuest] = useState<Trip | null>(() => trips.find((quest) => quest.id === new URLSearchParams(window.location.search).get("quest")) ?? null);
  const [activeCategory, setActiveCategory] = useState<QuestCategory | "Alle">("Alle");
  const [showAll, setShowAll] = useState(false);
  const [completedIds, setCompletedIds] = useState<string[]>(() => readIds(COMPLETED_KEY));
  const [acceptedIds, setAcceptedIds] = useState<string[]>(() => readIds(ACCEPTED_KEY));

  useEffect(() => writeIds(COMPLETED_KEY, completedIds), [completedIds]);
  useEffect(() => writeIds(ACCEPTED_KEY, acceptedIds), [acceptedIds]);
  useEffect(() => { if (new URLSearchParams(window.location.search).has("quest")) window.history.replaceState(null, "", window.location.pathname + window.location.hash); }, []);

  const questOfTheDay = useMemo(() => { const now = new Date(); const day = Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(now.getFullYear(), 0, 0)) / 86400000); return trips[(day * 7) % trips.length]; }, []);
  const filteredQuests = activeCategory === "Alle" ? (showAll ? trips : trips.slice(0, FEATURED_COUNT)) : trips.filter((quest) => quest.category === activeCategory);
  const completedQuests = trips.filter((quest) => completedIds.includes(quest.id));
  const logCounts = categories.map((category) => ({ category, count: completedQuests.filter((quest) => quest.category === category).length })).sort((a, b) => b.count - a.count).slice(0, 6);
  const unlockedBadgeCount = badgeMeta.filter((badge) => badge.progress(completedQuests) >= badge.target).length;

  const statusOf = (quest: Trip): QuestStatus => completedIds.includes(quest.id) ? "completed" : acceptedIds.includes(quest.id) ? "accepted" : "open";
  function advanceQuest(quest: Trip) {
    const status = statusOf(quest);
    if (status === "open") { setAcceptedIds((ids) => [...ids, quest.id]); toast.success(`Quest angenommen: ${quest.title}`, { description: "Viel Spaß da draußen. Markiere sie danach als erledigt." }); }
    else if (status === "accepted") { setAcceptedIds((ids) => ids.filter((id) => id !== quest.id)); setCompletedIds((ids) => [...ids, quest.id]); toast.success("Quest abgeschlossen!", { description: `${quest.title} steht jetzt in deinem Quest Log.` }); }
    else { setCompletedIds((ids) => ids.filter((id) => id !== quest.id)); toast("Quest wieder geöffnet", { description: quest.title }); }
  }

  function scrollTo(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); setMobileMenuOpen(false); }
  function answer(key: keyof FinderAnswers, value: string) { setFinderAnswers((current) => ({ ...current, [key]: value })); setFinderStep((step) => step + 1); }
  function generateQuest(answers: FinderAnswers, excludeId?: string) {
    const { pool, relaxed } = findQuestPool(answers);
    const candidates = pool.length > 1 && excludeId ? pool.filter((quest) => quest.id !== excludeId) : pool;
    setGenerated({ quest: candidates[Math.floor(Math.random() * candidates.length)], relaxed });
    setFinderStep(5);
    setTimeout(() => document.getElementById("generated-quest")?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
  }
  function resetFinder() { setFinderStep(0); setFinderAnswers(emptyAnswers); setGenerated(null); }
  function chooseCategory(category: QuestCategory | "Alle") { setActiveCategory(category); setShowAll(false); }

  const navLinks = [["finder", "Quest Finder"], ["quests", "Discover"], ["quest-log", "Quest Log"]];
  const generatedQuest = generated?.quest;

  return <main className="sidequest-app">
    <header className="sq-header"><a className="sq-logo" href="#top"><span className="sq-logo-mark">↗</span><span>Plan-a-Sidequest<span className="sq-logo-dot">↗</span></span></a><nav className={`sq-nav ${mobileMenuOpen ? "sq-nav-open" : ""}`}>{navLinks.map(([id, label]) => <a key={id} href={`#${id}`} onClick={(event) => { event.preventDefault(); scrollTo(id); }}>{label}</a>)}</nav><div className="sq-header-actions"><span className="live-pill"><span /> REAL-LIFE MODE</span><button className="sq-menu-button" aria-label={mobileMenuOpen ? "Menü schließen" : "Menü öffnen"} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((value) => !value)}>{mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}</button></div></header>

    <section className="sq-hero" id="top"><div className="hero-grid-glow" /><div className="hero-copy"><div className="sq-eyebrow"><span className="sq-eyebrow-line" /> REAL-LIFE QUEST GENERATOR</div><h1>Keine Pläne?<br /><em>Starte eine Sidequest.</em></h1><p>Spontane Missionen, kleine Abenteuer und ungewöhnliche Erlebnisse für deine freie Zeit. Kein endloses Suchen. Eine Idee, die du heute wirklich machen kannst.</p><div className="hero-actions"><button className="primary-sq-button" onClick={() => scrollTo("finder")}><Dice5 size={18} /> Find my Sidequest <ArrowRight size={17} /></button><button className="secondary-sq-button" onClick={() => scrollTo("quests")}>Quests entdecken <ArrowUpRight size={16} /></button></div><div className="hero-proof"><span><Sparkles size={14} /> {trips.length} spielbare Missionen</span><span><CircleDollarSign size={14} /> ab 0 €</span><span><Zap size={14} /> heute startklar</span></div></div><div className="hero-visual"><div className="hero-scanline" /><button className="hero-visual-card" onClick={() => setSelectedQuest(questOfTheDay)} aria-label={`Mission des Tages: ${questOfTheDay.title} öffnen`}><QuestArt scene={questOfTheDay.scene} seed={questOfTheDay.id} accent={questOfTheDay.accent} /><div className="hero-visual-overlay" /><div className="hero-quest-stamp"><span>SIDEQUEST</span><strong>#{questOfTheDay.questNo}</strong></div><div className="hero-visual-copy"><span>MISSION OF THE DAY</span><strong>{questOfTheDay.title}</strong><small>{costLabel(questOfTheDay.cost).toUpperCase()} · {questOfTheDay.duration.toUpperCase()} · {difficultyText(questOfTheDay.difficulty).toUpperCase()}</small></div></button><div className="hero-orbit hero-orbit-one" /><div className="hero-orbit hero-orbit-two" /><span className="hero-coordinate">52°31'N / 13°24'E</span></div><div className="hero-bottom-line"><span>01 / START HERE</span><span>LESS SCROLLING · MORE LIVING</span><span>BUILD 2026.10</span></div></section>

    <section className="sq-statement"><div className="statement-index">[ 00 ]</div><div><p className="sq-eyebrow">THE PROBLEM WITH FREE TIME</p><h2>Du hast heute nichts vor.<br /><em>Das Problem lösen wir.</em></h2></div><p>Sidequest macht aus einem leeren Kalender eine konkrete Mission. Vier kurze Fragen, eine Idee – und ein Grund, die Tür aufzumachen.</p></section>

    <section className="finder-section" id="finder"><div className="section-topline"><div><p className="sq-eyebrow"><span className="sq-eyebrow-line" /> FIND YOUR SIDEQUEST</p><h2>Worauf hast du<br /><em>heute Lust?</em></h2></div><div className="finder-progress"><span>QUEST FINDER</span><strong>{finderStep === 0 ? "START" : finderStep < 5 ? `0${finderStep}/04` : "READY"}</strong><div><i style={{ width: `${finderStep === 5 ? 100 : Math.max(0, finderStep - 1) * 25}%` }} /></div></div></div><div className="finder-shell">
      {finderStep === 0 && <div className="finder-intro"><span className="finder-mission-symbol"><Compass size={28} /></span><h3>Deine nächste Mission<br /><em>ist vier Fragen entfernt.</em></h3><p>Zeit. Budget. Menschen. Stimmung. Keine Anmeldung, keine komplizierte Planung.</p><button className="finder-next-button" onClick={() => setFinderStep(1)}>Start Finder <ChevronRight size={18} /></button></div>}
      {finderStep === 1 && <FinderQuestion title="Wie viel Zeit hast du?" options={[["short", "Unter 2 Stunden", "quick hit"], ["half", "Halber Tag", "enough time"], ["day", "Ganzer Tag", "go explore"], ["weekend", "Wochenende", "full send"]]} onAnswer={(value) => answer("time", value)} />}
      {finderStep === 2 && <FinderQuestion title="Wie viel möchtest du ausgeben?" options={[["free", "0 €", "no budget needed"], ["ten", "Bis 10 €", "snack money"], ["twentyfive", "Bis 25 €", "still cheap"], ["egal", "Egal", "surprise me"]]} onAnswer={(value) => answer("budget", value)} onBack={() => setFinderStep(1)} />}
      {finderStep === 3 && <FinderQuestion title="Mit wem?" options={[["solo", "Alleine", "main character"], ["duo", "Zu zweit", "two player"], ["friends", "Mit Freunden", "squad goals"], ["group", "Größere Gruppe", "the more the weird"]]} onAnswer={(value) => answer("with", value)} onBack={() => setFinderStep(2)} />}
      {finderStep === 4 && <FinderQuestion title="Worauf hast du Lust?" options={[["Outdoor", "Outdoor", "fresh air"], ["Explore", "Entdecken", "new places"], ["Friends", "Freunde", "together"], ["Challenge", "Challenge", "level up"], ["Creative", "Kreativität", "make something"], ["Food", "Food", "eat the city"], ["Kultur", "Kultur", "see something new"], ["Abenteuer", "Abenteuer", "go beyond routine"], ["Skill", "Skill", "learn a trick"], ["Reflexion", "Reflexion", "make space to think"], ["Soziales", "Soziales", "do some good"], ["random", "Überraschung", "roll the dice"]]} onAnswer={(value) => { const answers = { ...finderAnswers, mood: value }; setFinderAnswers(answers); generateQuest(answers); }} onBack={() => setFinderStep(3)} />}
      {finderStep === 5 && <div className="finder-ready"><div><span className="sq-eyebrow"><span className="sq-eyebrow-line" /> MATCH FOUND</span><h3>Deine Sidequest<br /><em>wartet schon.</em></h3><p>{generated?.relaxed.length ? `Kein exakter Treffer – wir haben ${generated.relaxed.map((key) => relaxLabels[key]).join(" und ")} gelockert.` : "Diese Mission passt zu all deinen Eckdaten."}</p></div><div className="finder-ready-actions"><button className="finder-next-button" onClick={() => generateQuest(finderAnswers, generatedQuest?.id)}><Shuffle size={15} /> Andere Quest</button><button className="reset-finder" onClick={resetFinder}><RotateCcw size={15} /> Neu starten</button></div></div>}
    </div></section>

    {generatedQuest && <section className="generated-section" id="generated-quest"><div className="generated-label"><span className="sq-eyebrow">YOUR GENERATED QUEST</span><span className="generated-line" /></div><div className="generated-card"><div className="generated-image"><QuestArt scene={generatedQuest.scene} seed={generatedQuest.id} accent={generatedQuest.accent} /><span>SIDEQUEST #{generatedQuest.questNo}</span></div><div className="generated-content"><div className="quest-card-topline"><span><CategoryIcon category={generatedQuest.category} size={14} /> {generatedQuest.category}</span><span>BEREIT FÜR DICH</span></div><h2>{generatedQuest.title}</h2><p className="generated-mission">{generatedQuest.mission}</p><div className="generated-meta"><span><Clock3 size={15} /> {generatedQuest.duration}</span><span><CircleDollarSign size={15} /> {costLabel(generatedQuest.cost)}</span><span><Users size={15} /> {generatedQuest.players}</span><span><Flame size={15} /> {generatedQuest.surprise}/5 surprise</span></div><div className="generated-reward"><span>REWARD</span><p>{generatedQuest.reward}</p></div><div className="hero-actions"><StatusButton className="primary-sq-button" status={statusOf(generatedQuest)} onAdvance={() => advanceQuest(generatedQuest)} /><button className="secondary-sq-button" onClick={() => setSelectedQuest(generatedQuest)}>Open mission <ArrowUpRight size={16} /></button></div></div></div></section>}

    <section className="quests-section" id="quests"><div className="section-topline quest-section-heading"><div><p className="sq-eyebrow"><span className="sq-eyebrow-line" /> FEATURED SIDEQUESTS</p><h2>Keine Liste.<br /><em>Deine nächste Mission.</em></h2></div><p>Outdoor, Explore, Food, Creative und ein bisschen Unfug. Such dir eine aus – oder lass den Finder würfeln.</p></div><div className="category-tabs" role="tablist" aria-label="Quest-Kategorien"><button role="tab" aria-selected={activeCategory === "Alle"} className={activeCategory === "Alle" ? "category-tab-active" : ""} onClick={() => chooseCategory("Alle")}>Alle <span>{trips.length}</span></button>{categories.map((category) => <button key={category} role="tab" aria-selected={activeCategory === category} className={activeCategory === category ? "category-tab-active" : ""} onClick={() => chooseCategory(category)}><CategoryIcon category={category} size={14} /> {category} <span>{trips.filter((quest) => quest.category === category).length}</span></button>)}</div><div className="quest-grid">{filteredQuests.map((quest) => <QuestCard key={quest.id} quest={quest} onOpen={setSelectedQuest} status={statusOf(quest)} onAdvance={advanceQuest} />)}</div>{activeCategory === "Alle" && trips.length > FEATURED_COUNT && <button className="show-all-button" onClick={() => setShowAll((value) => !value)}>{showAll ? "Weniger anzeigen" : `Alle ${trips.length} Quests anzeigen`} <ArrowRight size={16} /></button>}</section>

    <section className="how-section" id="how"><div className="how-content"><p className="sq-eyebrow"><span className="sq-eyebrow-line" /> HOW IT WORKS</p><h2>Vier Fragen.<br /><em>Ein echter Plan.</em></h2><p className="how-lede">Wir glauben, dass die besten Erinnerungen oft entstehen, wenn man einfach losgeht. Sidequest nimmt dir die Recherche ab – nicht das Erlebnis.</p><div className="how-steps"><div><span>01</span><strong>Wähle deine Zeit</strong><p>Quick hit oder ganzer Tag?</p></div><div><span>02</span><strong>Setz dein Budget</strong><p>0 € ist eine valide Antwort.</p></div><div><span>03</span><strong>Wähle deine Leute</strong><p>Solo, zu zweit oder die ganze Crew?</p></div><div><span>04</span><strong>Accept Quest</strong><p>Stimmung wählen. Tür auf. Mission starten.</p></div></div></div><div className="how-side-card"><Map size={22} /><span>NO MAP REQUIRED</span><strong>Die beste Route<br /><em>ist manchmal keine.</em></strong><div className="route-doodle"><span /><span /><span /><span /><span /></div></div></section>

    <section className="categories-section"><div><p className="sq-eyebrow"><span className="sq-eyebrow-line" /> EXPLORE CATEGORIES</p><h2>Was darf’s<br /><em>heute sein?</em></h2></div><div className="category-orbit">{categories.map((category) => <button key={category} className={`orbit-category orbit-${categoryMeta[category].color}`} onClick={() => { chooseCategory(category); scrollTo("quests"); }}><CategoryIcon category={category} size={18} /><span>{category}</span></button>)}</div></section>

    <section className="quest-log-section" id="quest-log"><div className="log-heading"><p className="sq-eyebrow"><span className="sq-eyebrow-line" /> YOUR QUEST LOG</p><h2>Du warst<br /><em>draußen.</em></h2><p>Deine Erfolge bleiben auf diesem Gerät. Keine Anmeldung. Kein Druck.</p></div><div className="log-stats"><div className="log-main-stat"><span>COMPLETED QUESTS</span><strong>{String(completedIds.length).padStart(2, "0")}</strong><div className="log-xp"><span style={{ width: `${Math.min(100, (completedIds.length / trips.length) * 100)}%` }} /></div><small>{completedIds.length === 0 ? "Dein erstes Abenteuer wartet." : `${completedIds.length} von ${trips.length} Missionen abgeschlossen.`}{acceptedIds.length > 0 && ` ${acceptedIds.length} aktiv.`}</small></div><div className="log-category-grid">{logCounts.map(({ category, count }) => <div key={category}><CategoryIcon category={category} size={15} /><span>{category}</span><strong>{count}</strong></div>)}</div></div><div className="badges-panel"><div className="badges-heading"><div><p className="sq-eyebrow"><span className="sq-eyebrow-line" /> BADGE CABINET</p><h3>Deine kleinen<br /><em>Meilensteine.</em></h3></div><span className="badges-count"><strong>{unlockedBadgeCount}</strong>/{badgeMeta.length}<small>freigeschaltet</small></span></div><div className="badge-grid">{badgeMeta.map((badge) => <BadgeCard key={badge.id} badge={badge} completed={completedQuests} />)}</div></div></section>

    <section className="final-cta"><div className="final-cta-orb" /><p className="sq-eyebrow">NO PLANS? NO PROBLEM.</p><h2>Dein nächstes<br /><em>Abenteuer beginnt heute.</em></h2><button className="primary-sq-button" onClick={() => scrollTo("finder")}><Dice5 size={18} /> Start a Sidequest <ArrowRight size={17} /></button></section>
    <footer className="sq-footer"><a className="sq-logo" href="#top"><span className="sq-logo-mark">↗</span><span>Plan-a-Sidequest<span className="sq-logo-dot">↗</span></span></a><span>Weniger scrollen. Mehr erleben.</span><span>© 2026 SIDEQUEST / REAL-LIFE MODE</span></footer>

    {selectedQuest && <QuestModal quest={selectedQuest} status={statusOf(selectedQuest)} onAdvance={() => advanceQuest(selectedQuest)} onClose={() => setSelectedQuest(null)} />}
  </main>;
}

function FinderQuestion({ title, options, onAnswer, onBack }: { title: string; options: string[][]; onAnswer: (value: string) => void; onBack?: () => void }) {
  return <div className="finder-question"><div className="finder-question-head"><p className="sq-eyebrow"><span className="sq-eyebrow-line" /> QUESTION</p>{onBack && <button className="finder-back" onClick={onBack}>← Zurück</button>}</div><h3>{title}</h3><div className="finder-options">{options.map(([value, label, hint], index) => <button key={value} onClick={() => onAnswer(value)}><span>{String(index + 1).padStart(2, "0")}</span><strong>{label}</strong><small>{hint}</small><ChevronRight size={16} /></button>)}</div></div>;
}
