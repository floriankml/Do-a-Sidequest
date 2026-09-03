## Cloudflare Pages

Für Cloudflare Pages bitte den Build als statische Client-App ausführen:

| Einstellung            | Wert                        |
| ---------------------- | --------------------------- |
| Framework preset       | Vite                        |
| Build command          | `pnpm run build:cloudflare` |
| Build output directory | `dist`                      |
| Root directory         | leer lassen bzw. `/`        |
| Node.js                | 22 oder höher               |
| Package manager        | pnpm                        |

Der normale `pnpm build` bleibt für die verwaltete Manus-Umgebung erhalten. Der separate Cloudflare-Befehl überspringt den nicht benötigten Express-Server-Bundle und erzeugt ausschließlich den Pages-Output in `dist`. Die Datei `client/public/_redirects` sorgt dafür, dass clientseitige Routen wie `/packliste` auf Cloudflare Pages funktionieren.
