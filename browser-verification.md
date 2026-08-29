# Browser-Verifikation

Am 29.08.2026 wurde die Live-Vorschau auf der Startseite geöffnet. Sichtbar und geladen waren: Hero mit Planungsfakten, Standort-/Budget-Planer, Filterleiste, drei Abenteuerkarten, grobe Start-Routen, Erklärbereich, Budget-Logik und Footer. Die Bildpfade für Hero, Karten und How-it-works-Bereich wurden in der Live-Vorschau ohne fehlende Asset-URL angezeigt.

Die interaktiven Elemente sind im Browser auffindbar: Standort-Input, Budget-Input, Stimmungsauswahl, Absenden, vier Filter, Sortierung, Merken-Buttons, drei „Plan öffnen“-Buttons und Navigation. Ein Klickversuch auf den Budget-Filter wurde ausgelöst; der Browser blieb auf der Abenteuer-Sektion, ohne Fehlerseite oder sichtbaren Laufzeitfehler.

## Interaktionscheck

Der Filter „Unter 30 €“ wurde per DOM-Interaktion ausgelöst und nach dem React-Update als aktiv erkannt. Die Trefferanzahl wechselte auf „01“, passend zum Spreewald-Plan mit 24 €.

Der Detail-Drawer wurde ebenfalls geöffnet. Der Titel „Spreewald: Kanäle & Kiefern“ sowie die drei Abschnitte „Grobe Route“, „Kosten-Split“ und „Packliste“ wurden im DOM gefunden. Ein erster Test mit Großschreibung war nur ein Testselektor-Fehler; der anschließende Test mit dem tatsächlichen Buttontext war erfolgreich.
