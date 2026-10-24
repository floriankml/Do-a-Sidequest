/* Quest cover art: every sidequest gets its own self-hosted SVG illustration, so the cards never break on missing image hosts. */

import { useId, type ReactNode } from "react";

export type QuestScene =
  | "sunrise" | "hills" | "summit" | "river" | "train" | "bus" | "city" | "route" | "ticket" | "treasure" | "book"
  | "food" | "cafe" | "pot" | "market" | "picnic" | "hanger" | "bike" | "night" | "stars" | "campfire"
  | "tent" | "lake" | "camera" | "letter" | "bench" | "hourglass" | "message" | "zine" | "filmstrip" | "sound" | "stage"
  | "palette" | "easel" | "museum" | "gallery" | "brickwall" | "film" | "bingo" | "clock" | "juggle" | "heart";

type Palette = { sky: [string, string]; a: string; b: string; far: string; mid: string; near: string };
type Rand = () => number;
type Ctx = { p: Palette; r: Rand; uid: string };

const PAPER = "#efe9dc";
const MONO = "IBM Plex Mono, monospace";

const palettes: Record<string, Palette> = {
  sun: { sky: ["#2a1b3d", "#ff8a4c"], a: "#ffd166", b: "#ff716e", far: "#4a2f52", mid: "#2b1d36", near: "#120d18" },
  blue: { sky: ["#0b1a2e", "#2f6f9f"], a: "#5de4ff", b: "#c8ff3d", far: "#1d3a57", mid: "#11263b", near: "#08121d" },
  orange: { sky: ["#2b1610", "#c2562b"], a: "#ffb24c", b: "#ffe08a", far: "#57291a", mid: "#32180f", near: "#170b07" },
  violet: { sky: ["#1a1433", "#5a3f9e"], a: "#b7a2ff", b: "#ff8bc7", far: "#352a5e", mid: "#1f1a3d", near: "#0f0c1f" },
  pink: { sky: ["#2a1226", "#a8457f"], a: "#ff8bc7", b: "#ffd166", far: "#56244a", mid: "#33152d", near: "#180a16" },
  green: { sky: ["#0e2219", "#3f8a5a"], a: "#c8ff3d", b: "#5de4ff", far: "#214632", mid: "#132a1f", near: "#08140e" },
  red: { sky: ["#2a0f12", "#b23a3a"], a: "#ff716e", b: "#ffb24c", far: "#521e22", mid: "#2f1114", near: "#150708" },
  mint: { sky: ["#0c1f22", "#2f8f86"], a: "#c8ff3d", b: "#7af0d0", far: "#1d4441", mid: "#112a28", near: "#081413" },
  yellow: { sky: ["#241a08", "#b5872a"], a: "#ffd166", b: "#ff716e", far: "#4a3812", mid: "#2b200b", near: "#130e05" },
};

function hash(value: string) { let h = 2166136261; for (let i = 0; i < value.length; i++) { h ^= value.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function random(seed: number): Rand { let t = seed; return () => { t = (t + 0x6d2b79f5) | 0; let x = Math.imul(t ^ (t >>> 15), 1 | t); x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x; return ((x ^ (x >>> 14)) >>> 0) / 4294967296; }; }
const range = (r: Rand, min: number, max: number) => min + r() * (max - min);
const times = <T,>(count: number, fn: (index: number) => T) => Array.from({ length: count }, (_, index) => fn(index));

function ridge(r: Rand, y: number, amp: number, segments = 5) {
  const points = times(segments + 1, (i) => [(i * 400) / segments, y + (r() - 0.5) * amp]);
  let d = `M0 300 L0 ${points[0][1].toFixed(1)}`;
  for (let i = 0; i < segments; i++) { const [x0, y0] = points[i]; const [x1, y1] = points[i + 1]; const cx = (x0 + x1) / 2; d += ` C${cx} ${y0.toFixed(1)} ${cx} ${y1.toFixed(1)} ${x1} ${y1.toFixed(1)}`; }
  return `${d} L400 300 Z`;
}
const Ridge = ({ r, y, amp, fill, segments }: { r: Rand; y: number; amp: number; fill: string; segments?: number }) => <path d={ridge(r, y, amp, segments)} fill={fill} />;
const Stars = ({ r, count, maxY = 180, color = "#fff" }: { r: Rand; count: number; maxY?: number; color?: string }) => <g fill={color}>{times(count, (i) => <circle key={i} cx={range(r, 0, 400)} cy={range(r, 0, maxY)} r={range(r, 0.5, 1.7)} opacity={range(r, 0.3, 0.95)} />)}</g>;
const Dim = ({ amount = 0.55 }: { amount?: number }) => <rect width="400" height="300" fill="#05080c" opacity={amount} />;
const heartPath = (x: number, y: number, s: number) => `M${x} ${y + s * 0.9} C${x - s * 1.6} ${y - s * 0.1} ${x - s * 0.8} ${y - s * 1.2} ${x} ${y - s * 0.35} C${x + s * 0.8} ${y - s * 1.2} ${x + s * 1.6} ${y - s * 0.1} ${x} ${y + s * 0.9} Z`;

const scenes: Record<QuestScene, (ctx: Ctx) => ReactNode> = {
  sunrise: ({ p, r }) => { const sx = range(r, 150, 250); return <>
    <circle cx={sx} cy={205} r={95} fill={p.a} opacity={0.16} />
    <g stroke={p.a} strokeWidth={3} strokeLinecap="round" opacity={0.7}>{times(9, (i) => { const angle = Math.PI + (i + 0.5) * (Math.PI / 9); return <line key={i} x1={sx + Math.cos(angle) * 66} y1={205 + Math.sin(angle) * 66} x2={sx + Math.cos(angle) * 88} y2={205 + Math.sin(angle) * 88} />; })}</g>
    <circle cx={sx} cy={205} r={52} fill={p.a} />
    <Ridge r={r} y={205} amp={50} fill={p.far} /><Ridge r={r} y={232} amp={34} fill={p.mid} /><Ridge r={r} y={258} amp={22} fill={p.near} />
  </>; },
  hills: ({ p, r }) => { const peak = range(r, 70, 95); return <>
    <Stars r={r} count={14} maxY={110} />
    <Ridge r={r} y={185} amp={50} fill={p.far} />
    <path d={`M50 300 L200 ${peak} L350 300 Z`} fill={p.mid} /><path d={`M200 ${peak} L350 300 L240 300 Z`} fill={p.near} opacity={0.6} />
    <path d={`M200 280 L170 245 L225 215 L185 180 L215 150 L200 ${peak + 8}`} fill="none" stroke={p.a} strokeWidth={3} strokeDasharray="6 7" strokeLinecap="round" />
    <line x1={200} y1={peak} x2={200} y2={peak - 34} stroke={PAPER} strokeWidth={2.5} /><path d={`M200 ${peak - 34} L228 ${peak - 26} L200 ${peak - 18} Z`} fill={p.b} />
    <Ridge r={r} y={270} amp={18} fill={p.near} />
  </>; },
  summit: ({ p, r }) => <>
    <circle cx={range(r, 90, 130)} cy={80} r={26} fill={p.b} opacity={0.9} />
    <path d="M70 300 L205 78 L335 300 Z" fill={p.far} /><path d="M205 78 L335 300 L250 300 Z" fill={p.mid} />
    <path d="M205 78 L180 120 L195 112 L205 128 L218 110 L230 120 Z" fill={PAPER} opacity={0.85} />
    <g transform="translate(176 52)"><path d="M0 0 L28 6 L28 26 L0 20 Z" fill={PAPER} /><path d="M28 6 L56 0 L56 20 L28 26 Z" fill="#d9d1c0" /><line x1={34} y1={10} x2={50} y2={7} stroke={p.near} strokeWidth={1.5} /><line x1={34} y1={15} x2={48} y2={12} stroke={p.near} strokeWidth={1.5} /><line x1={6} y1={8} x2={22} y2={11} stroke={p.near} strokeWidth={1.5} /></g>
    <line x1={238} y1={40} x2={222} y2={70} stroke={p.a} strokeWidth={4} strokeLinecap="round" />
    {times(3, (i) => <ellipse key={i} cx={range(r, 40, 360)} cy={range(r, 170, 230)} rx={range(r, 40, 70)} ry={12} fill={PAPER} opacity={0.18} />)}
    <Ridge r={r} y={265} amp={20} fill={p.near} />
  </>,
  river: ({ p, r }) => <>
    <Ridge r={r} y={120} amp={40} fill={p.far} /><Ridge r={r} y={170} amp={30} fill={p.mid} />
    <path d="M175 300 C150 255 255 235 225 200 C200 170 160 165 190 140 C210 124 222 118 214 104 L222 104 C236 120 226 132 208 146 C186 166 222 176 246 200 C280 236 214 262 245 300 Z" fill={p.b} opacity={0.85} />
    <g stroke={PAPER} strokeWidth={2} strokeLinecap="round" opacity={0.5}><line x1={196} y1={262} x2={214} y2={258} /><line x1={218} y1={214} x2={232} y2={212} /><line x1={200} y1={158} x2={210} y2={154} /></g>
    <circle cx={218} cy={100} r={10} fill={p.a} /><circle cx={218} cy={100} r={22} fill="none" stroke={p.a} strokeWidth={2} strokeDasharray="3 5" />
    <g fill={p.near}>{times(6, (i) => { const x = i < 3 ? 40 + i * 34 : 260 + (i - 3) * 38; const h = range(r, 50, 90); return <path key={i} d={`M${x - 15} 300 L${x} ${300 - h} L${x + 15} 300 Z`} />; })}</g>
  </>,
  train: ({ p, r }) => <>
    <circle cx={range(r, 270, 320)} cy={85} r={24} fill={p.b} opacity={0.85} />
    <Ridge r={r} y={190} amp={45} fill={p.far} />
    <rect y={226} width={400} height={74} fill={p.near} />
    <g fill={p.far}>{times(23, (i) => <rect key={i} x={i * 18} y={234} width={8} height={10} />)}</g>
    <line x1={0} y1={235} x2={400} y2={235} stroke={p.mid} strokeWidth={3} /><line x1={0} y1={243} x2={400} y2={243} stroke={p.mid} strokeWidth={3} />
    <g transform="translate(95 168)">
      <path d="M0 6 Q0 0 8 0 L188 0 Q228 4 236 52 L236 58 L0 58 Z" fill={p.a} />
      <rect x={12} y={12} width={158} height={20} rx={3} fill={p.near} />{times(5, (i) => <rect key={i} x={16 + i * 31} y={15} width={25} height={14} rx={2} fill={p.b} opacity={0.55} />)}
      <path d="M188 10 Q214 14 222 40 L188 40 Z" fill={p.near} /><rect x={0} y={42} width={236} height={5} fill={p.near} opacity={0.4} />
      {[36, 70, 150, 186].map((x) => <circle key={x} cx={x} cy={62} r={8} fill={p.near} stroke={p.far} strokeWidth={3} />)}
    </g>
    <g stroke={p.b} strokeWidth={3} strokeLinecap="round" opacity={0.6}>{[182, 196, 210].map((y, i) => <line key={y} x1={30 + i * 12} y1={y} x2={80} y2={y} />)}</g>
  </>,
  bus: ({ p, r }) => <>
    <Stars r={r} count={10} maxY={100} />
    <Ridge r={r} y={140} amp={22} fill={p.far} />
    <path d="M182 140 L218 140 L340 300 L60 300 Z" fill={p.mid} />
    <path d="M200 145 L200 300" stroke={p.b} strokeWidth={4} strokeDasharray="12 14" />
    <rect x={186} y={118} width={30} height={22} rx={4} fill={p.a} /><rect x={189} y={122} width={24} height={7} fill={p.near} />
    {[0, 1, 2].map((i) => <circle key={i} cx={130 - i * 24} cy={250 - i * 34} r={7} fill={p.a} opacity={0.4 + i * 0.25} />)}
    <rect x={296} y={118} width={5} height={130} fill={PAPER} opacity={0.8} />
    <circle cx={298} cy={110} r={22} fill={p.a} /><circle cx={298} cy={110} r={17} fill="none" stroke={p.near} strokeWidth={2} />
    <text x={298} y={118} textAnchor="middle" fontSize={22} fontWeight={700} fill={p.near} fontFamily={MONO}>H</text>
    <rect x={260} y={150} width={36} height={46} fill={PAPER} opacity={0.15} />
  </>,
  city: ({ p, r }) => { let x = 40; const buildings: ReactNode[] = []; let i = 0;
    while (x < 360) { const w = range(r, 24, 44); const h = range(r, 60, 170); const fill = i % 2 ? p.mid : p.far; buildings.push(<g key={i}><rect x={x} y={250 - h} width={w} height={h} fill={fill} />{times(Math.floor(h / 16), (row) => times(Math.floor(w / 11), (col) => r() > 0.55 ? <rect key={`${row}-${col}`} x={x + 4 + col * 10} y={256 - h + row * 15} width={5} height={7} fill={r() > 0.3 ? p.a : p.b} opacity={range(r, 0.45, 0.95)} /> : null))}</g>); x += w + range(r, 2, 8); i++; }
    return <><Stars r={r} count={20} maxY={90} /><circle cx={range(r, 80, 320)} cy={60} r={20} fill={p.b} opacity={0.85} />{buildings}<rect y={248} width={400} height={52} fill={p.near} /></>; },
  route: ({ p, r }) => <>
    <Dim amount={0.35} />
    <g stroke={PAPER} opacity={0.08}>{times(10, (i) => <line key={`v${i}`} x1={i * 44} y1={0} x2={i * 44} y2={300} />)}{times(8, (i) => <line key={`h${i}`} x1={0} y1={i * 44} x2={400} y2={i * 44} />)}</g>
    <g stroke={p.far} strokeWidth={10} fill="none" strokeLinecap="round">{times(4, (i) => <path key={i} d={`M${range(r, -20, 120)} ${range(r, 0, 300)} L${range(r, 120, 280)} ${range(r, 0, 300)} L${range(r, 280, 420)} ${range(r, 0, 300)}`} />)}</g>
    <path d={`M90 250 C140 ${range(r, 150, 230)} 170 ${range(r, 120, 200)} 210 160 S 280 ${range(r, 80, 130)} 300 100`} fill="none" stroke={p.a} strokeWidth={4} strokeDasharray="2 10" strokeLinecap="round" />
    <circle cx={90} cy={250} r={9} fill={p.a} />
    <g stroke={p.b} strokeWidth={6} strokeLinecap="round"><line x1={286} y1={86} x2={314} y2={114} /><line x1={314} y1={86} x2={286} y2={114} /></g>
    <g transform="translate(318 206)"><circle r={24} fill="none" stroke={p.b} strokeWidth={4} /><text y={7} textAnchor="middle" fontSize={18} fontWeight={700} fill={p.b} fontFamily={MONO}>GPS</text><line x1={-17} y1={17} x2={17} y2={-17} stroke={p.b} strokeWidth={4} /></g>
  </>,
  ticket: ({ p, r, uid }) => <>
    <g stroke={p.a} strokeWidth={2} strokeDasharray="3 8" fill="none" opacity={0.35}>{times(3, (i) => <path key={i} d={`M0 ${range(r, 40, 260)} Q200 ${range(r, 0, 300)} 400 ${range(r, 40, 260)}`} />)}</g>
    <mask id={`${uid}-ticket`}><rect x={90} y={90} width={220} height={120} fill="#fff" /><circle cx={90} cy={150} r={16} fill="#000" /><circle cx={310} cy={150} r={16} fill="#000" /></mask>
    <g transform={`rotate(${range(r, -10, -4)} 200 150)`}>
      <rect x={90} y={90} width={220} height={120} rx={8} fill={p.a} mask={`url(#${uid}-ticket)`} />
      <line x1={240} y1={98} x2={240} y2={202} stroke={p.near} strokeWidth={2} strokeDasharray="5 6" />
      <text x={170} y={176} textAnchor="middle" fontSize={78} fontWeight={700} fill={p.near} fontFamily={MONO}>?</text>
      <text x={275} y={135} textAnchor="middle" fontSize={11} fontWeight={700} fill={p.near} fontFamily={MONO}>ZIEL</text>
      <text x={275} y={160} textAnchor="middle" fontSize={16} fontWeight={700} fill={p.near} fontFamily={MONO}>???</text>
    </g>
  </>,
  treasure: ({ p, r }) => <>
    <Stars r={r} count={12} maxY={100} color={p.b} />
    <Ridge r={r} y={215} amp={22} fill={p.mid} /><rect y={245} width={400} height={55} fill={p.near} />
    <g fill={p.far}><circle cx={110} cy={120} r={42} /><circle cx={80} cy={150} r={34} /><circle cx={140} cy={150} r={36} /></g><rect x={104} y={150} width={14} height={98} fill={p.near} />
    <path d={`M330 260 C300 ${range(r, 200, 230)} 260 170 220 196`} fill="none" stroke={p.a} strokeWidth={3} strokeDasharray="2 9" strokeLinecap="round" />
    <g transform="translate(150 196)"><rect width={84} height={52} rx={6} fill={p.a} /><rect y={-8} width={84} height={16} rx={5} fill={p.b} /><rect x={36} y={6} width={12} height={14} rx={2} fill={p.near} /><g stroke={p.near} strokeWidth={2} opacity={0.35}><line x1={10} y1={30} x2={74} y2={30} /><line x1={10} y1={40} x2={60} y2={40} /></g></g>
    <g transform="translate(250 92)"><path d="M0 34 C-22 8 -18 -20 0 -20 C18 -20 22 8 0 34 Z" fill={p.b} /><circle cy={-4} r={7} fill={p.near} /></g>
  </>,
  book: ({ p, r }) => <>
    <Stars r={r} count={16} maxY={120} color={p.b} />
    <path d="M200 120 C230 70 270 80 300 40" fill="none" stroke={p.a} strokeWidth={3} strokeDasharray="2 9" strokeLinecap="round" />
    {[[228, 88], [262, 70], [300, 40]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={11} fill={p.near} stroke={p.a} strokeWidth={3} /><text x={x} y={y + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill={p.a} fontFamily={MONO}>{i + 1}</text></g>)}
    <path d="M200 140 Q150 120 90 132 L90 236 Q150 224 200 244 Z" fill={PAPER} /><path d="M200 140 Q250 120 310 132 L310 236 Q250 224 200 244 Z" fill="#d9d1c0" />
    <g stroke={p.near} strokeWidth={2} opacity={0.45}>{times(5, (i) => <line key={`l${i}`} x1={108} y1={152 + i * 16} x2={184} y2={158 + i * 16} />)}{times(5, (i) => <line key={`r${i}`} x1={216} y1={158 + i * 16} x2={292} y2={152 + i * 16} />)}</g>
    <line x1={200} y1={140} x2={200} y2={244} stroke={p.near} strokeWidth={2} opacity={0.4} />
  </>,
  food: ({ p, r }) => <>
    <rect width={400} height={300} fill={p.near} opacity={0.55} />
    <g fill={p.far} opacity={0.4}>{times(6, (i) => <rect key={i} x={0} y={i * 52} width={400} height={2} />)}</g>
    <circle cx={200} cy={150} r={92} fill={p.far} /><circle cx={200} cy={150} r={72} fill={p.mid} stroke={PAPER} strokeOpacity={0.25} strokeWidth={2} />
    {times(5, (i) => { const angle = (i / 5) * Math.PI * 2 + r(); return <circle key={i} cx={200 + Math.cos(angle) * 34} cy={150 + Math.sin(angle) * 34} r={range(r, 14, 22)} fill={[p.a, p.b, PAPER][i % 3]} opacity={0.9} />; })}
    <g stroke={PAPER} strokeWidth={6} strokeLinecap="round"><line x1={300} y1={60} x2={250} y2={160} /><line x1={318} y1={68} x2={262} y2={166} /></g>
    {[[95, 235], [125, 250], [80, 262]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={15} fill={p.b} /><text x={x} y={y + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill={p.near} fontFamily={MONO}>€</text></g>)}
  </>,
  cafe: ({ p }) => <>
    <rect y={228} width={400} height={72} fill={p.near} />
    <ellipse cx={200} cy={232} rx={98} ry={14} fill={p.far} />
    <path d="M140 140 L260 140 L250 220 Q248 230 236 230 L164 230 Q152 230 150 220 Z" fill={p.a} />
    <path d="M258 158 Q296 158 290 186 Q286 206 252 204" fill="none" stroke={p.a} strokeWidth={9} />
    <ellipse cx={200} cy={141} rx={60} ry={8} fill={p.mid} />
    <g fill="none" stroke={PAPER} strokeWidth={4} strokeLinecap="round" opacity={0.6}>{[170, 200, 230].map((x) => <path key={x} d={`M${x} 125 q-10 -15 0 -30 q10 -15 0 -30`} />)}</g>
    <text x={310} y={110} fontSize={64} fontWeight={700} fill={p.b} fontFamily={MONO}>?</text>
  </>,
  pot: ({ p, r }) => <>
    <g transform="translate(200 120)"><circle r={78} fill="none" stroke={p.b} strokeWidth={2} opacity={0.4} /><ellipse rx={36} ry={78} fill="none" stroke={p.b} strokeWidth={2} opacity={0.3} /><line x1={-78} x2={78} stroke={p.b} strokeWidth={2} opacity={0.3} /><path d="M-70 -35 Q0 -20 70 -35 M-70 35 Q0 50 70 35" fill="none" stroke={p.b} strokeWidth={2} opacity={0.3} /></g>
    <rect y={240} width={400} height={60} fill={p.near} />
    <path d="M128 170 L272 170 L262 236 Q260 246 248 246 L152 246 Q140 246 138 236 Z" fill={p.a} />
    <rect x={112} y={176} width={22} height={10} rx={5} fill={p.a} /><rect x={266} y={176} width={22} height={10} rx={5} fill={p.a} />
    <ellipse cx={200} cy={168} rx={78} ry={10} fill={p.far} /><rect x={190} y={150} width={20} height={10} rx={4} fill={p.far} />
    <g fill="none" stroke={PAPER} strokeWidth={4} strokeLinecap="round" opacity={0.55}>{times(3, (i) => <path key={i} d={`M${170 + i * 30} 140 q${range(r, -12, -6)} -14 0 -28 q10 -14 0 -28`} />)}</g>
  </>,
  market: ({ p, r }) => <>
    <g>{times(10, (i) => <rect key={i} x={i * 40} y={30} width={40} height={52} fill={i % 2 ? p.a : PAPER} opacity={i % 2 ? 1 : 0.85} />)}</g>
    <g>{times(10, (i) => <circle key={i} cx={i * 40 + 20} cy={82} r={20} fill={i % 2 ? p.a : PAPER} opacity={i % 2 ? 1 : 0.85} />)}</g>
    <g stroke={PAPER} strokeWidth={1.5} opacity={0.5}>{[90, 200, 310].map((x) => <line key={x} x1={x} y1={100} x2={x} y2={124} />)}</g>
    {[90, 200, 310].map((x) => <circle key={x} cx={x} cy={130} r={7} fill={p.b} />)}
    <rect y={210} width={400} height={90} fill={p.near} />
    {times(4, (i) => <g key={i}><rect x={44 + i * 82} y={186} width={70} height={46} fill={p.far} stroke={p.mid} strokeWidth={3} />{times(5, (j) => <circle key={j} cx={54 + i * 82 + j * 12.5} cy={186 - range(r, 0, 6)} r={8} fill={[p.a, p.b, "#ff716e", "#c8ff3d"][(i + j) % 4]} />)}</g>)}
  </>,
  picnic: ({ p, r }) => <>
    <circle cx={range(r, 280, 330)} cy={70} r={28} fill={p.b} opacity={0.9} />
    <Ridge r={r} y={150} amp={20} fill={p.far} />
    <g fill={p.mid}>{times(3, (i) => <circle key={i} cx={58 + i * 22} cy={110 - (i % 2) * 18} r={28} />)}</g><rect x={78} y={120} width={8} height={40} fill={p.near} />
    <rect y={160} width={400} height={140} fill={p.mid} />
    {times(5, (row) => times(6, (col) => { const edge = (c: number, y: number) => 200 + (c - 3) * 30 * (1 + (y - 190) / 100); const y0 = 190 + row * 20; const y1 = y0 + 20; return <path key={`${row}-${col}`} d={`M${edge(col, y0)} ${y0} L${edge(col + 1, y0)} ${y0} L${edge(col + 1, y1)} ${y1} L${edge(col, y1)} ${y1} Z`} fill={(row + col) % 2 ? p.a : PAPER} opacity={(row + col) % 2 ? 0.85 : 0.7} />; }))}
    <g transform="translate(250 160)"><path d="M0 20 L60 20 L52 56 L8 56 Z" fill={p.b} /><path d="M8 20 Q30 -16 52 20" fill="none" stroke={p.b} strokeWidth={5} /></g>
  </>,
  hanger: ({ p }) => <>
    <line x1={40} y1={50} x2={360} y2={50} stroke={PAPER} strokeWidth={5} opacity={0.6} />
    <path d="M200 50 q0 -14 12 -14 q12 0 12 12 q0 10 -24 22 L120 112 L280 112 Z" fill="none" stroke={p.a} strokeWidth={5} strokeLinejoin="round" />
    <path d="M150 112 L250 112 L300 140 L282 172 L262 162 L262 250 L138 250 L138 162 L118 172 L100 140 Z" fill={p.b} />
    <path d="M180 112 Q200 132 220 112" fill="none" stroke={p.near} strokeWidth={3} opacity={0.5} />
    <line x1={262} y1={170} x2={300} y2={210} stroke={PAPER} strokeWidth={2} />
    <g transform="translate(286 204) rotate(18)"><rect width={50} height={30} rx={4} fill={p.a} /><circle cx={8} cy={15} r={3} fill={p.near} /><text x={30} y={20} textAnchor="middle" fontSize={13} fontWeight={700} fill={p.near} fontFamily={MONO}>5 €</text></g>
  </>,
  bike: ({ p, r }) => <>
    <circle cx={range(r, 80, 130)} cy={80} r={22} fill={p.b} opacity={0.8} />
    <Ridge r={r} y={190} amp={40} fill={p.far} /><Ridge r={r} y={238} amp={14} fill={p.near} />
    <path d={`M20 290 C120 ${range(r, 230, 270)} 280 ${range(r, 250, 290)} 390 245`} fill="none" stroke={p.b} strokeWidth={3} strokeDasharray="3 9" strokeLinecap="round" />
    <g fill="none" stroke={p.a} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={145} cy={196} r={40} /><circle cx={265} cy={196} r={40} />
      <path d="M145 196 L190 196 L240 140 L175 140 Z M190 196 L170 124 M240 140 L265 196 M232 118 L240 140" />
      <path d="M156 122 L184 122 M224 118 L248 112" />
    </g>
    <g stroke={p.a} strokeWidth={1.5} opacity={0.5}>{times(6, (i) => { const angle = (i / 6) * Math.PI; return <g key={i}><line x1={145 - Math.cos(angle) * 38} y1={196 - Math.sin(angle) * 38} x2={145 + Math.cos(angle) * 38} y2={196 + Math.sin(angle) * 38} /><line x1={265 - Math.cos(angle) * 38} y1={196 - Math.sin(angle) * 38} x2={265 + Math.cos(angle) * 38} y2={196 + Math.sin(angle) * 38} /></g>; })}</g>
  </>,
  night: ({ p, r, uid }) => <>
    <Dim amount={0.6} /><Stars r={r} count={70} maxY={200} />
    <mask id={`${uid}-moon`}><rect width={400} height={300} fill="#fff" /><circle cx={302} cy={66} r={24} fill="#000" /></mask>
    <circle cx={290} cy={74} r={28} fill={p.b} mask={`url(#${uid}-moon)`} />
    <Ridge r={r} y={230} amp={20} fill={p.mid} />
    <g fill={p.near}>{times(14, (i) => { const x = i * 30 + range(r, -8, 8); const h = range(r, 50, 110); return <path key={i} d={`M${x - 16} 250 L${x} ${250 - h} L${x + 16} 250 Z`} />; })}</g>
    <rect y={248} width={400} height={52} fill={p.near} />
    <path d="M200 300 C180 280 230 270 205 252" fill="none" stroke={p.a} strokeWidth={3} strokeDasharray="2 8" strokeLinecap="round" opacity={0.7} />
    <g fill={p.a}><circle cx={118} cy={228} r={2.2} /><circle cx={126} cy={228} r={2.2} /></g>
  </>,
  stars: ({ p, r }) => { const points = times(6, (i) => [90 + i * 42 + range(r, -10, 10), range(r, 50, 150)]); return <>
    <Dim amount={0.62} /><Stars r={r} count={90} maxY={240} />
    <polyline points={points.map(([x, y]) => `${x},${y}`).join(" ")} fill="none" stroke={p.a} strokeWidth={1.5} opacity={0.7} />
    {points.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3.5} fill={p.a} />)}
    <g transform={`translate(${range(r, 80, 120)} ${range(r, 190, 210)})`}><circle r={16} fill={p.b} /><ellipse rx={30} ry={7} fill="none" stroke={p.b} strokeWidth={2.5} transform="rotate(-18)" /></g>
    <Ridge r={r} y={262} amp={18} fill={p.near} />
  </>; },
  campfire: ({ p, r }) => <>
    <Dim amount={0.55} /><Stars r={r} count={30} maxY={130} />
    <circle cx={200} cy={210} r={120} fill={p.a} opacity={0.12} /><circle cx={200} cy={215} r={70} fill={p.b} opacity={0.12} />
    <rect y={240} width={400} height={60} fill={p.near} />
    <g fill={p.far}><rect x={140} y={232} width={120} height={16} rx={8} transform="rotate(14 200 240)" /><rect x={140} y={232} width={120} height={16} rx={8} transform="rotate(-14 200 240)" /></g>
    <path d="M200 120 C240 165 245 205 225 235 L175 235 C155 205 160 165 200 120 Z" fill={p.a} />
    <path d="M200 160 C222 188 226 212 212 235 L188 235 C174 212 178 188 200 160 Z" fill={p.b} />
    <path d="M200 196 C210 210 212 222 206 235 L194 235 C188 222 190 210 200 196 Z" fill={PAPER} />
    <g fill={p.b}>{times(10, (i) => <circle key={i} cx={range(r, 160, 240)} cy={range(r, 50, 120)} r={range(r, 1, 2.6)} />)}</g>
    <line x1={360} y1={170} x2={248} y2={150} stroke={PAPER} strokeWidth={3} opacity={0.7} /><ellipse cx={258} cy={152} rx={14} ry={7} fill="#e2c08d" transform="rotate(-10 258 152)" />
  </>,
  tent: ({ p, r }) => <>
    <Dim amount={0.5} /><Stars r={r} count={60} maxY={190} />
    <circle cx={range(r, 70, 120)} cy={70} r={20} fill={p.b} opacity={0.9} />
    <Ridge r={r} y={215} amp={28} fill={p.mid} />
    <rect y={240} width={400} height={60} fill={p.near} />
    <path d="M120 248 L200 120 L280 248 Z" fill={p.a} /><path d="M200 120 L280 248 L240 248 Z" fill={p.near} opacity={0.25} />
    <path d="M200 150 L176 248 L224 248 Z" fill={p.near} opacity={0.8} />
    <g stroke={PAPER} strokeWidth={1.5} opacity={0.4}><line x1={200} y1={120} x2={92} y2={250} /><line x1={200} y1={120} x2={308} y2={250} /></g>
    <circle cx={200} cy={234} r={22} fill={p.b} opacity={0.2} /><circle cx={200} cy={236} r={5} fill={p.b} />
  </>,
  lake: ({ p, r }) => <>
    <circle cx={200} cy={125} r={70} fill={p.a} opacity={0.15} /><circle cx={200} cy={125} r={34} fill={p.a} />
    <Ridge r={r} y={165} amp={18} fill={p.far} segments={4} />
    <rect y={170} width={400} height={130} fill={p.mid} />
    <g fill={p.a}>{times(7, (i) => <rect key={i} x={200 - (40 - i * 5)} y={180 + i * 12} width={(40 - i * 5) * 2} height={3} rx={1.5} opacity={0.6 - i * 0.07} />)}</g>
    <g stroke={PAPER} strokeWidth={2} opacity={0.18}>{times(8, (i) => { const x = range(r, 20, 380); const y = range(r, 190, 290); return <line key={i} x1={x} y1={y} x2={x + range(r, 15, 40)} y2={y} />; })}</g>
    <g stroke={p.near} strokeWidth={4} strokeLinecap="round">{times(7, (i) => <line key={i} x1={20 + i * 9} y1={300} x2={20 + i * 9 + range(r, -8, 8)} y2={range(r, 200, 240)} />)}{times(5, (i) => <line key={`r${i}`} x1={350 + i * 9} y1={300} x2={350 + i * 9 + range(r, -8, 8)} y2={range(r, 210, 250)} />)}</g>
  </>,
  camera: ({ p, r }) => <>
    {times(9, (i) => <circle key={i} cx={range(r, 20, 380)} cy={range(r, 20, 280)} r={range(r, 18, 52)} fill={[p.a, p.b, PAPER][i % 3]} opacity={range(r, 0.1, 0.28)} />)}
    <g stroke={PAPER} strokeWidth={1} opacity={0.2}><line x1={163} y1={60} x2={163} y2={240} /><line x1={237} y1={60} x2={237} y2={240} /><line x1={90} y1={120} x2={310} y2={120} /><line x1={90} y1={180} x2={310} y2={180} /></g>
    <g fill="none" stroke={p.a} strokeWidth={4} strokeLinecap="square"><path d="M100 98 L100 76 L122 76" /><path d="M278 76 L300 76 L300 98" /><path d="M100 202 L100 224 L122 224" /><path d="M278 224 L300 224 L300 202" /></g>
    <rect x={180} y={130} width={40} height={40} fill="none" stroke={p.a} strokeWidth={2} /><line x1={200} y1={140} x2={200} y2={160} stroke={p.a} strokeWidth={2} /><line x1={190} y1={150} x2={210} y2={150} stroke={p.a} strokeWidth={2} />
    <circle cx={116} cy={92} r={5} fill="#ff716e" /><text x={128} y={96} fontSize={11} fontWeight={700} fill={PAPER} fontFamily={MONO}>REC</text>
    <text x={290} y={216} textAnchor="end" fontSize={11} fontWeight={700} fill={PAPER} fontFamily={MONO}>{`${Math.floor(range(r, 3, 15))}/20`}</text>
  </>,
  letter: ({ p, r }) => <>
    <path d={`M40 260 C120 ${range(r, 180, 240)} 140 80 ${range(r, 300, 340)} 60`} fill="none" stroke={p.a} strokeWidth={2} strokeDasharray="4 8" opacity={0.6} />
    <path d="M330 56 L352 50 L340 70 Z" fill={p.a} />
    <g transform={`rotate(${range(r, -9, -3)} 200 155)`}>
      <rect x={110} y={95} width={180} height={120} rx={4} fill={PAPER} />
      <path d="M110 95 L200 160 L290 95" fill="none" stroke={p.near} strokeWidth={2.5} opacity={0.5} />
      <rect x={244} y={104} width={36} height={42} fill={p.a} stroke={PAPER} strokeWidth={3} strokeDasharray="3 2" />
      <circle cx={232} cy={140} r={20} fill="none" stroke={p.b} strokeWidth={2} /><circle cx={232} cy={140} r={13} fill="none" stroke={p.b} strokeWidth={1.5} />
      <g stroke={p.near} strokeWidth={2} opacity={0.35}><line x1={126} y1={182} x2={196} y2={182} /><line x1={126} y1={194} x2={180} y2={194} /></g>
    </g>
  </>,
  bench: ({ p, r }) => <>
    <circle cx={range(r, 250, 280)} cy={96} r={18} fill={p.b} opacity={0.8} />
    <Ridge r={r} y={200} amp={26} fill={p.far} /><rect y={238} width={400} height={62} fill={p.near} />
    <g fill={p.mid}><circle cx={90} cy={110} r={44} /><circle cx={60} cy={146} r={36} /><circle cx={124} cy={146} r={38} /></g><rect x={84} y={146} width={14} height={96} fill={p.near} />
    <rect x={318} y={110} width={6} height={130} fill={PAPER} opacity={0.5} /><circle cx={321} cy={104} r={10} fill={p.a} /><circle cx={321} cy={104} r={26} fill={p.a} opacity={0.15} />
    <g fill={p.a}><rect x={150} y={168} width={140} height={10} rx={3} /><rect x={150} y={184} width={140} height={10} rx={3} /><rect x={150} y={204} width={140} height={10} rx={3} /><rect x={160} y={214} width={8} height={30} /><rect x={272} y={214} width={8} height={30} /></g>
    <g transform="translate(232 186) rotate(-8)"><rect width={34} height={20} fill={PAPER} /><line x1={17} y1={0} x2={17} y2={20} stroke={p.near} strokeWidth={1.5} /></g>
    <g fill={p.b} fontFamily={MONO} fontWeight={700} fontSize={22}>{["?", "?", "?"].map((q, i) => <text key={i} x={180 + i * 32} y={140 - (i % 2) * 18}>{q}</text>)}</g>
  </>,
  hourglass: ({ p, r }) => <>
    <circle cx={200} cy={150} r={112} fill="none" stroke={p.a} strokeWidth={2} strokeDasharray="3 9" opacity={0.5} />
    <Stars r={r} count={24} maxY={300} color={p.b} />
    <rect x={146} y={52} width={108} height={12} rx={4} fill={p.a} /><rect x={146} y={236} width={108} height={12} rx={4} fill={p.a} />
    <path d="M158 64 L242 64 L242 72 Q242 118 208 150 Q242 182 242 228 L242 236 L158 236 L158 228 Q158 182 192 150 Q158 118 158 72 Z" fill={PAPER} opacity={0.18} stroke={PAPER} strokeOpacity={0.6} strokeWidth={3} />
    <path d="M170 92 L230 92 Q226 120 200 140 Q174 120 170 92 Z" fill={p.b} /><path d="M164 230 Q200 190 236 230 Z" fill={p.b} />
    <line x1={200} y1={140} x2={200} y2={210} stroke={p.b} strokeWidth={2} strokeDasharray="2 4" />
  </>,
  message: ({ p, r }) => <>
    <path d="M100 70 L290 70 Q310 70 310 90 L310 170 Q310 190 290 190 L170 190 L130 222 L138 190 L100 190 Q80 190 80 170 L80 90 Q80 70 100 70 Z" fill={p.a} />
    <path d={heartPath(195, 128, 26)} fill={p.near} />
    <path d="M240 210 L320 210 Q334 210 334 224 L334 254 Q334 268 320 268 L296 268 L278 284 L280 268 L240 268 Q226 268 226 254 L226 224 Q226 210 240 210 Z" fill={p.b} />
    {[258, 280, 302].map((x) => <circle key={x} cx={x} cy={239} r={5} fill={p.near} />)}
    <g fill={PAPER}>{times(5, (i) => { const x = range(r, 30, 370); const y = range(r, 80, 280); return <path key={i} d={`M${x} ${y - 7} L${x + 2} ${y - 2} L${x + 7} ${y} L${x + 2} ${y + 2} L${x} ${y + 7} L${x - 2} ${y + 2} L${x - 7} ${y} L${x - 2} ${y - 2} Z`} opacity={0.7} />; })}</g>
  </>,
  zine: ({ p, r }) => <>
    <rect x={130} y={68} width={130} height={170} fill={p.far} transform="rotate(-12 195 153)" />
    <rect x={136} y={64} width={130} height={170} fill={p.b} transform="rotate(5 200 150)" />
    <g transform="rotate(-3 200 150)">
      <rect x={135} y={66} width={130} height={170} fill={PAPER} />
      <rect x={148} y={80} width={104} height={18} fill={p.near} /><text x={200} y={93} textAnchor="middle" fontSize={11} fontWeight={700} fill={PAPER} fontFamily={MONO}>TINY ZINE</text>
      <circle cx={180} cy={135} r={22} fill="none" stroke={p.near} strokeWidth={3} /><path d={`M215 120 L${range(r, 236, 246)} 150 L205 150 Z`} fill={p.a} stroke={p.near} strokeWidth={2} />
      <g stroke={p.near} strokeWidth={2} opacity={0.4}>{times(4, (i) => <line key={i} x1={148} y1={180 + i * 12} x2={i % 2 ? 230 : 250} y2={180 + i * 12} />)}</g>
    </g>
  </>,
  filmstrip: ({ p, r }) => <>
    <g transform={`rotate(${range(r, -8, -4)} 200 150)`}>
      <rect x={-20} y={98} width={440} height={104} fill={p.near} />
      <g fill={PAPER} opacity={0.75}>{times(22, (i) => <g key={i}><rect x={-14 + i * 20} y={104} width={10} height={8} rx={1} /><rect x={-14 + i * 20} y={188} width={10} height={8} rx={1} /></g>)}</g>
      {times(5, (i) => { const x = 10 + i * 78; const shift = i * 12; return <g key={i}><rect x={x} y={118} width={68} height={64} fill={p.mid} /><circle cx={x + 14 + shift} cy={160 - (i % 2) * 10} r={10} fill={p.a} /><rect x={x + 40} y={160} width={18} height={12} fill={p.b} opacity={0.85} /></g>; })}
    </g>
    <text x={330} y={242} textAnchor="middle" fontSize={14} fontWeight={700} fill={p.a} fontFamily={MONO}>00:15</text>
    <circle cx={290} cy={238} r={5} fill="#ff716e" />
  </>,
  sound: ({ p, r }) => <>
    <g fill="none" strokeLinecap="round">{[40, 70, 100, 130, 160].map((radius, i) => <path key={radius} d={`M${110 + radius * 0.5} ${150 - radius} A${radius} ${radius} 0 0 1 ${110 + radius * 0.5} ${150 + radius}`} stroke={i % 2 ? p.b : p.a} strokeWidth={5} opacity={0.9 - i * 0.15} />)}</g>
    <circle cx={110} cy={150} r={14} fill={p.a} />
    <g fill={p.b}>{times(20, (i) => { const h = range(r, 8, 60); return <rect key={i} x={20 + i * 19} y={290 - h} width={10} height={h} rx={3} opacity={0.75} />; })}</g>
  </>,
  stage: ({ p, r }) => <>
    <Dim amount={0.55} />
    <path d="M110 0 L60 230 L180 230 Z" fill={p.a} opacity={0.2} /><path d="M290 0 L220 230 L340 230 Z" fill={p.b} opacity={0.2} />
    <rect y={220} width={400} height={20} fill={p.far} />
    <line x1={200} y1={220} x2={200} y2={150} stroke={PAPER} strokeWidth={4} /><rect x={192} y={128} width={16} height={26} rx={8} fill={PAPER} />
    <g fill={p.a} opacity={0.8}>{[[150, 80], [255, 60], [120, 140]].map(([x, y], i) => <g key={i}><ellipse cx={x} cy={y + 18} rx={8} ry={6} /><line x1={x + 7} y1={y + 18} x2={x + 7} y2={y - 6} stroke={p.a} strokeWidth={2.5} /></g>)}</g>
    <g fill={p.near}>{times(14, (i) => <circle key={i} cx={10 + i * 30} cy={range(r, 268, 280)} r={range(r, 14, 20)} />)}</g><rect y={280} width={400} height={20} fill={p.near} />
  </>,
  palette: ({ p }) => <>
    <g style={{ mixBlendMode: "screen" }}><circle cx={160} cy={125} r={66} fill={p.a} opacity={0.85} /><circle cx={242} cy={125} r={66} fill={p.b} opacity={0.85} /><circle cx={200} cy={190} r={66} fill="#5de4ff" opacity={0.7} /></g>
    <path d="M70 260 C130 230 180 285 240 255 S 330 240 350 250" fill="none" stroke={PAPER} strokeWidth={10} strokeLinecap="round" opacity={0.75} />
  </>,
  easel: ({ p, r }) => <>
    <g stroke={p.far} strokeWidth={7} strokeLinecap="round"><line x1={200} y1={40} x2={140} y2={270} /><line x1={200} y1={40} x2={260} y2={270} /><line x1={200} y1={40} x2={200} y2={270} /></g>
    <rect x={128} y={66} width={144} height={112} fill={PAPER} /><rect x={120} y={176} width={160} height={8} fill={p.far} />
    <circle cx={172} cy={112} r={24} fill={p.a} /><path d={`M140 160 Q180 ${range(r, 120, 140)} 210 150 T 262 120`} fill="none" stroke={p.b} strokeWidth={8} strokeLinecap="round" /><rect x={220} y={80} width={34} height={34} fill={p.near} opacity={0.7} />
    <g transform="translate(320 90)"><circle r={30} fill={p.near} stroke={p.a} strokeWidth={4} /><path d="M0 0 L0 -30 A30 30 0 1 1 -26 15 Z" fill={p.a} opacity={0.5} /><text y={6} textAnchor="middle" fontSize={15} fontWeight={700} fill={PAPER} fontFamily={MONO}>60</text></g>
  </>,
  museum: ({ p, r }) => <>
    <rect width={400} height={300} fill={p.far} opacity={0.55} /><rect y={236} width={400} height={64} fill={p.near} />
    {[[70, 80, 80, 104], [170, 64, 70, 70], [262, 90, 80, 96]].map(([x, y, w, h], i) => <g key={i}>
      <path d={`M${x + w / 2} 0 L${x - 10} ${y + h + 20} L${x + w + 10} ${y + h + 20} Z`} fill={PAPER} opacity={0.06} />
      <rect x={x} y={y} width={w} height={h} fill={p.mid} stroke={p.a} strokeWidth={6} />
      {i === 0 && <circle cx={x + w / 2} cy={y + h / 2} r={range(r, 18, 26)} fill={p.b} />}
      {i === 1 && <path d={`M${x + 12} ${y + h - 12} L${x + w / 2} ${y + 14} L${x + w - 12} ${y + h - 12} Z`} fill={p.a} />}
      {i === 2 && <rect x={x + 18} y={y + 20} width={w - 36} height={h - 40} fill={p.b} opacity={0.8} transform={`rotate(${range(r, -15, 15)} ${x + w / 2} ${y + h / 2})`} />}
      <rect x={x + w / 2 - 12} y={y + h + 12} width={24} height={8} fill={PAPER} opacity={0.7} />
    </g>)}
    <rect x={150} y={250} width={100} height={12} fill={p.mid} /><rect x={160} y={262} width={8} height={18} fill={p.mid} /><rect x={232} y={262} width={8} height={18} fill={p.mid} />
    <g transform="translate(362 200)"><circle r={18} fill="none" stroke={p.b} strokeWidth={3} /><line x1={0} y1={0} x2={0} y2={-11} stroke={p.b} strokeWidth={3} /><line x1={0} y1={0} x2={8} y2={4} stroke={p.b} strokeWidth={3} /></g>
  </>,
  gallery: ({ p, r }) => <>
    <rect width={400} height={300} fill={p.near} opacity={0.45} />
    <path d="M200 0 L110 250 L290 250 Z" fill={PAPER} opacity={0.08} />
    <rect x={120} y={50} width={160} height={120} fill={p.mid} stroke={p.a} strokeWidth={8} />
    <circle cx={range(r, 180, 220)} cy={110} r={34} fill={p.b} opacity={0.9} /><path d="M128 162 Q170 120 210 150 T 272 140 L272 162 Z" fill={p.a} opacity={0.75} />
    <rect y={250} width={400} height={50} fill={p.near} />
    <g fill={p.near}><circle cx={200} cy={210} r={18} /><path d="M164 262 Q164 230 200 230 Q236 230 236 262 Z" /></g>
    <text x={330} y={215} textAnchor="middle" fontSize={14} fontWeight={700} fill={p.a} fontFamily={MONO}>10:00</text>
  </>,
  brickwall: ({ p, r }) => <>
    <g fill={p.mid} stroke={p.near} strokeWidth={2}>{times(12, (row) => times(9, (col) => <rect key={`${row}-${col}`} x={col * 50 - (row % 2) * 25} y={row * 26} width={50} height={26} opacity={range(r, 0.6, 1)} />))}</g>
    <rect x={130} y={58} width={140} height={150} fill={p.near} opacity={0.5} stroke={p.a} strokeWidth={7} />
    <path d="M200 86 L232 186 L168 186 Z" fill={p.b} /><path d="M184 136 L216 136 L222 156 L178 156 Z" fill={PAPER} /><rect x={158} y={186} width={84} height={10} fill={p.b} />
    <rect x={162} y={222} width={76} height={34} fill={PAPER} /><g stroke={p.near} strokeWidth={2} opacity={0.5}><line x1={170} y1={232} x2={228} y2={232} /><line x1={170} y1={241} x2={214} y2={241} /><line x1={170} y1={249} x2={220} y2={249} /></g>
  </>,
  film: ({ p, r }) => <>
    <Dim amount={0.5} />
    <path d="M200 300 L92 58 L308 58 Z" fill={PAPER} opacity={0.07} />
    <rect x={92} y={48} width={216} height={118} fill={p.a} opacity={0.92} /><rect x={92} y={48} width={216} height={118} fill="none" stroke={PAPER} strokeWidth={3} opacity={0.4} />
    <path d="M185 82 L230 107 L185 132 Z" fill={p.near} />
    <g fill={p.near}>{times(2, (row) => times(9, (col) => <rect key={`${row}-${col}`} x={30 + col * 40 + row * 18} y={212 + row * 34} width={32} height={26} rx={7} />))}</g>
    <g transform={`translate(${range(r, 300, 330)} 214)`}><circle r={28} fill={p.b} /><circle r={21} fill="none" stroke={p.near} strokeWidth={2} /><text y={7} textAnchor="middle" fontSize={20} fontWeight={700} fill={p.near} fontFamily={MONO}>¢</text></g>
  </>,
  bingo: ({ p, r }) => { const marks = times(9, () => r() > 0.45); return <>
    <g transform={`rotate(${range(r, -6, 6)} 200 150)`}>
      <rect x={110} y={52} width={180} height={196} rx={6} fill={PAPER} /><rect x={110} y={52} width={180} height={30} rx={6} fill={p.a} />
      <text x={200} y={73} textAnchor="middle" fontSize={14} fontWeight={700} fill={p.near} fontFamily={MONO}>B I N G O</text>
      <g stroke={p.near} strokeWidth={2} opacity={0.25}><line x1={170} y1={88} x2={170} y2={242} /><line x1={230} y1={88} x2={230} y2={242} /><line x1={116} y1={140} x2={284} y2={140} /><line x1={116} y1={192} x2={284} y2={192} /></g>
      {marks.map((on, i) => { const cx = 140 + (i % 3) * 60; const cy = 114 + Math.floor(i / 3) * 52; return on ? <path key={i} d={heartPath(cx, cy, 13)} fill={p.b} /> : <circle key={i} cx={cx} cy={cy} r={5} fill={p.near} opacity={0.2} />; })}
    </g>
  </>; },
  clock: ({ p, r }) => <>
    <circle cx={200} cy={270} r={110} fill={p.b} opacity={0.25} />
    <Ridge r={r} y={255} amp={20} fill={p.near} />
    <path d="M140 98 A26 26 0 0 1 176 70 Z" fill={p.a} /><path d="M260 98 A26 26 0 0 0 224 70 Z" fill={p.a} /><rect x={196} y={66} width={8} height={14} fill={p.a} />
    <g stroke={p.a} strokeWidth={8} strokeLinecap="round"><line x1={160} y1={200} x2={146} y2={222} /><line x1={240} y1={200} x2={254} y2={222} /></g>
    <circle cx={200} cy={145} r={66} fill={p.a} /><circle cx={200} cy={145} r={54} fill={PAPER} />
    <g fill={p.near}>{times(12, (i) => { const angle = (i / 12) * Math.PI * 2; return <circle key={i} cx={200 + Math.sin(angle) * 44} cy={145 - Math.cos(angle) * 44} r={2.5} />; })}</g>
    <g stroke={p.near} strokeWidth={5} strokeLinecap="round"><line x1={200} y1={145} x2={200 + Math.sin((5 / 12) * Math.PI * 2) * 28} y2={145 - Math.cos((5 / 12) * Math.PI * 2) * 28} /><line x1={200} y1={145} x2={200} y2={104} strokeWidth={3} /></g>
    <text x={200} y={282} textAnchor="middle" fontSize={14} fontWeight={700} fill={p.a} fontFamily={MONO}>05:00</text>
  </>,
  juggle: ({ p, r }) => <>
    <path d="M120 230 C120 40 280 40 280 230" fill="none" stroke={p.a} strokeWidth={3} strokeDasharray="5 9" opacity={0.6} />
    <path d="M150 230 C160 110 240 110 250 230" fill="none" stroke={p.b} strokeWidth={3} strokeDasharray="5 9" opacity={0.5} />
    <circle cx={200} cy={84} r={20} fill={p.a} /><circle cx={137} cy={145} r={18} fill={p.b} /><circle cx={243} cy={150} r={18} fill={PAPER} />
    <g fill="none" stroke={PAPER} strokeWidth={6} strokeLinecap="round" opacity={0.85}><path d="M100 236 Q120 262 145 238" /><path d="M255 238 Q280 262 300 236" /></g>
    <g stroke={p.a} strokeWidth={2} strokeLinecap="round" opacity={0.6}>{times(4, (i) => <line key={i} x1={range(r, 30, 90)} y1={60 + i * 50} x2={range(r, 310, 370)} y2={60 + i * 50} opacity={0.2} />)}</g>
  </>,
  heart: ({ p, r }) => <>
    <circle cx={200} cy={140} r={110} fill={p.a} opacity={0.08} />
    <path d={heartPath(200, 128, 62)} fill={p.a} />
    <g fill="none" stroke={p.b} strokeWidth={8} strokeLinecap="round"><path d="M90 250 Q140 200 200 228" /><path d="M310 250 Q260 200 200 228" /></g>
    <g stroke={PAPER} strokeWidth={4} strokeLinecap="round">{times(6, (i) => { const x = range(r, 40, 360); const y = range(r, 30, 200); return x > 120 && x < 280 && y > 60 ? null : <g key={i}><line x1={x - 8} y1={y} x2={x + 8} y2={y} /><line x1={x} y1={y - 8} x2={x} y2={y + 8} /></g>; })}</g>
  </>,
};

export default function QuestArt({ scene, seed, accent, className = "", label }: { scene: QuestScene; seed: string; accent: string; className?: string; label?: string }) {
  const uid = useId().replace(/:/g, "");
  const p = palettes[accent] ?? palettes.blue;
  const r = random(hash(seed));
  return (
    <svg className={`quest-art ${className}`} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={p.sky[0]} /><stop offset="1" stopColor={p.sky[1]} /></linearGradient>
        <pattern id={`${uid}-dots`} width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.8" fill="#fff" opacity="0.09" /></pattern>
      </defs>
      <rect width="400" height="300" fill={`url(#${uid}-sky)`} />
      {scenes[scene]({ p, r, uid })}
      <rect width="400" height="300" fill={`url(#${uid}-dots)`} />
    </svg>
  );
}
