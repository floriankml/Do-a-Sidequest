# Plan-a-Sidequest — Designideen

## Drei mögliche Richtungen

### Ansatz 1: Trail Notes
**Very Brief Intro:** Eine editoriale Outdoor-Ästhetik zwischen Wanderjournal, analogen Karten und Community-Notizen. Warm, pragmatisch und neugierig statt nach Hochglanz-Reiseprospekt.

**Probability:** 0.07

### Ansatz 2: Campfire Bulletin
**Very Brief Intro:** Eine plakative, leicht rohe Poster-Sprache mit kräftigen Flächen, handgesetzten Labels und dem Gefühl eines schwarzen Bretts im Jugendtreff. Direkt, sozial und energiegeladen.

**Probability:** 0.03

### Ansatz 3: Alpine Utility
**Very Brief Intro:** Eine präzise, technische Oberfläche mit modularen Routenbausteinen, Datensätzen und einer sachlichen Bergrettungs-Anmutung. Effizient, klar und fokussiert auf Planung.

**Probability:** 0.08

## Gewählter Ansatz: Trail Notes

### Design Movement
**Contemporary editorial outdoor design** mit Anleihen aus Schweizer Reiseplakaten, analogen Field Notes und moderner Magazin-Typografie. Das Produkt soll wie ein gutes, weitergereichtes Notizbuch wirken: nützlich, eigenständig und voller kleiner Spuren echter Unternehmungen.

### Core Principles
1. **Niedrige Schwelle sichtbar machen:** Kosten, Anfahrt, Ausrüstung und Dauer stehen auf den ersten Blick; jedes Abenteuer wirkt machbar.
2. **Asymmetrische Redaktion statt App-Standardlayout:** Große Bildfläche, versetzte Informationsblöcke, seitliche Notizen und klare Ankerpunkte erzeugen das Gefühl einer kuratierten Seite.
3. **Materialität ohne Kitsch:** Papierartige Flächen, feine Linien, gestempelte Tags und subtile Körnung geben Tiefe; keine generischen Karten- oder Neonmotive.
4. **Praktisch vor performativ:** Die Sprache ist konkret, die Interaktionen direkt, der Inhalt hilft beim Losgehen statt beim Scrollen.

### Color Philosophy
Die Basis ist warmes Off-White wie recyceltes Papier, kombiniert mit tiefem Kieferngrün für Orientierung und Vertrauen. Saffron-Gelb ist die eigene Signalfarbe: Es markiert günstige Optionen, CTA-Momente und kleine Entdeckungen wie ein Textmarker im Notizbuch. Ein gedämpftes Ziegelrot dient sparsam für Hinweise, nicht für Alarm. Die Farben sollen nach spätem Sonnenlicht, Wald und gewetzter Ausrüstung fühlen – bodenständig, freundlich und nicht luxuriös.

### Layout Paradigm
Eine **editoriale Split-Canvas-Struktur**: Der Hero arbeitet mit einem breiten Foto und einem leicht versetzten Inhaltsblock. Darunter liegen Planungsfilter links in einer schmalen, sticky wirkenden Spalte und Abenteuerkarten in einer variablen, nicht streng symmetrischen Reihe. Detailinformationen öffnen sich als seitlicher „Field Note“-Drawer oder wechseln in eine klare Routenansicht. Abstände und horizontale Linien ersetzen starre Kartenraster.

### Signature Elements
- Ein **Saffron-Topografiepfeil** als Markenmotiv, wiederholt in Tags, Buttons und Abschnittstrennern.
- Kleine **Field-Note-Metadaten** wie „ab Berlin“, „1 Nacht“, „ÖPNV-tauglich“ in monospaced Mini-Labels.
- **Handgezeichnete Routenlinien** und Punktmarker, die die Informationsblöcke verbinden.

### Interaction Philosophy
Jede Interaktion soll wie ein kurzes Umblättern oder Markieren funktionieren: schnell, greifbar und reversibel. Filter verändern die Abenteuerliste sofort. „Plan öffnen“ führt direkt zu Kosten, Route und Packliste. Sekundäre Links werden als „weiterlesen“ oder „Route ansehen“ konkret benannt, nicht als abstrakte Icons versteckt.

### Animation
Einmalige Bereiche erscheinen mit leichtem Versatz und 30–60ms Staffelung; keine langen Einblendungen. Hover-Zustände verschieben Bildausschnitte minimal nach oben und färben nur die Saffron-Details. Buttons reagieren mit einem kurzen Press-Scale von 0.97. Kartenlinien dürfen beim Öffnen entlang der Route „gezeichnet“ wirken, aber nur über opacity/transform und unter 250ms. `prefers-reduced-motion` deaktiviert alle nicht essenziellen Bewegungen.

### Typography System
**Headlines:** Fraunces, 700/800, mit charakteristischen Serifen für den Magazin-Ton.

**UI, Fließtext und Labels:** DM Sans für die lesbare, junge Alltagssprache.

**Utility Labels:** IBM Plex Mono, 500/600, uppercase mit leichtem Tracking für Kosten, Dauer und Verkehrsmittel.

Hierarchie: große Headline maximal zweizeilig, Intro-Text 18–20px, Karten-Headline 28–32px, Metadaten 11–12px. Keine All-Caps für längere Sätze.

### Brand Essence
**Plan-a-Sidequest macht spontane Wochenendabenteuer für junge Menschen mit kleinem Budget konkret planbar – mit echten Kosten, klaren Routen und Ausrüstung, die man schon fast besitzt.**

Persönlichkeit: **neugierig, pragmatisch, unprätentiös**.

### Brand Voice
Headlines klingen wie ein guter Tipp von jemandem, der schon dort war: direkt, leicht trocken, nie werblich. CTAs sagen, was danach passiert. Microcopy nimmt Unsicherheit weg und nennt Zahlen.

Beispielzeilen:
- „Raus aus dem Feed. Rein in den Wald.“
- „Zeig mir, was unter 45 € drin ist.“

### Wordmark & Logo
Der Wordmark „Plan-a-Sidequest“ steht in einer kräftigen Fraunces-Kursivvariante, wobei der Bindestrich als kleiner saffronfarbener Richtungs-Pfeil gesetzt wird. Das eigenständige Mark ist ein kompakter, topografischer Pfad, der in einen vierzackigen Wegmarker übergeht. Das Symbol funktioniert ohne Text als Favicon und neben dem Wordmark im Header.

### Signature Brand Color
**Sidequest Saffron — #E6A632.** Ein warmes, leicht erdiges Gelb, das wie ein markierter Wegpunkt wirkt und die Marke auf Papier, Foto und Oberfläche wiedererkennbar macht.

## Content- und Funktionsrahmen

Die erste Seite zeigt einen klaren Einstieg mit Standortfeld, Budget und gewünschter Stimmung. Voreingestellt ist Berlin, damit direkt ein konkreter Kontext sichtbar wird; Nutzer können den Standort ersetzen. Die ersten drei Beispieltrips sind bewusst unterschiedlich: ein günstiger Wald-Loop, ein See-Wochenende und eine aussichtsreiche Mittelgebirgsroute.

Jede Abenteuerkarte zeigt geschätzte Gesamtkosten pro Person, Anreiseart, Dauer, Schwierigkeitsgrad und ein echtes Vorschaubild. Der Detailbereich enthält eine grobe Tagesroute, Kostensplit, Packliste und verlinkte nächste Schritte. Da die Website frontend-only ist, sind die Inhalte als kuratierte Beispielpläne umgesetzt; der Planer filtert und sortiert diese direkt im Browser.
