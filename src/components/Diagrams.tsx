export type DiagramId = 'recservices' | 'trauma' | 'steamlocked' | 'pipeline';

/*
 * Architecture diagrams, drawn by hand as inline SVG.
 *
 * Inline rather than images so they re-color with the page: every fill and
 * stroke is a CSS custom property, and a light-mode reader does not get a dark
 * rectangle sitting in the middle of the page. They run top to bottom because
 * they live in a narrow column, and a wide left-to-right diagram is unreadable
 * at phone width.
 *
 * One rule holds all four together: the drawing shows structure only. Boxes,
 * arrows, and short edge labels. Explanation goes in the caption underneath,
 * where it can be a real sentence. Free-floating notes inside a diagram never
 * have anywhere to point, and they end up crowding the thing they describe.
 */

const W = 400;
const BOX_H = 44;
const RADIUS = 7;

/** Boxes sit right of a gutter so swimlane labels have somewhere to live. */
const GUTTER = 90;
const BOX_W = W - GUTTER - 40;
const MID = GUTTER + BOX_W / 2;

type Tone = 1 | 2 | 3 | 4;

type BoxProps = {
  x?: number;
  y: number;
  w?: number;
  h?: number;
  label: string;
  sub?: string;
  tone?: Tone;
  dashed?: boolean;
};

function Box({ x = GUTTER, y, w = BOX_W, h = BOX_H, label, sub, tone = 1, dashed }: BoxProps) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={RADIUS}
        fill="var(--viz-surface)"
        stroke={`var(--viz-${tone})`}
        strokeWidth={1.25}
        strokeDasharray={dashed ? '4 3' : undefined}
        opacity={dashed ? 0.8 : 1}
      />
      <text
        x={x + w / 2}
        y={sub ? y + h / 2 - 3 : y + h / 2 + 4}
        textAnchor="middle"
        fontSize={11.5}
        fontWeight={600}
        fill="var(--text)"
      >
        {label}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 11}
          textAnchor="middle"
          fontSize={9}
          fill="var(--text-muted)"
        >
          {sub}
        </text>
      )}
    </g>
  );
}

type ArrowProps = { from: number; to: number; x?: number; label?: string; tone?: Tone };

function Arrow({ from, to, x = MID, label, tone = 1 }: ArrowProps) {
  return (
    <g>
      <line
        x1={x}
        y1={from}
        x2={x}
        y2={to - 6}
        stroke={`var(--viz-${tone})`}
        strokeWidth={1.25}
        opacity={0.6}
      />
      <path
        d={`M ${x - 4} ${to - 7} L ${x} ${to - 1} L ${x + 4} ${to - 7} Z`}
        fill={`var(--viz-${tone})`}
        opacity={0.85}
      />
      {label && (
        <text x={x + 10} y={(from + to) / 2 + 3.5} fontSize={9} fill="var(--text-muted)">
          {label}
        </text>
      )}
    </g>
  );
}

/** A swimlane label in the gutter, vertically centred on the row it names. */
function Lane({ y, children }: { y: number; children: string }) {
  return (
    <text x={6} y={y + 3.5} fontSize={8.5} fill="var(--text-muted)" letterSpacing="0.06em">
      {children}
    </text>
  );
}

function RecServicesDiagram() {
  return (
    <svg viewBox={`0 0 ${W} 292`} role="img" aria-labelledby="dg-rec">
      <title id="dg-rec">
        Rec Services architecture. A React progressive web app calls an Express API, which routes
        through a database switcher to MySQL in local development or Supabase Postgres in
        production. Each tier was owned by a different sub-team.
      </title>

      <Lane y={38}>FRONTEND</Lane>
      <Box y={16} label="React PWA client" sub="installable · push notifications" tone={2} />
      <Arrow from={60} to={100} label="HTTPS / JSON" tone={2} />

      <Lane y={122}>BACKEND</Lane>
      <Box y={100} label="Express API" sub="helmet · CORS · Joi · Winston" tone={1} />
      <Arrow from={144} to={158} tone={1} />
      <Box
        y={158}
        h={36}
        label="OpenAPI contract"
        sub="what the frontend builds against"
        tone={1}
        dashed
      />

      {/* One trunk splitting into two engines, rather than an arrow into each. */}
      <line x1={MID} y1={194} x2={MID} y2={220} stroke="var(--viz-1)" strokeWidth={1.25} opacity={0.6} />
      <text x={MID + 10} y={211} fontSize={9} fill="var(--text-muted)">
        Knex
      </text>
      <line x1={155} y1={220} x2={295} y2={220} stroke="var(--viz-1)" strokeWidth={1.25} opacity={0.6} />
      <Arrow from={220} to={236} x={155} tone={3} />
      <Arrow from={220} to={236} x={295} tone={4} />

      <Lane y={258}>DATABASE</Lane>
      <Box y={236} x={90} w={130} label="MySQL" sub="local dev" tone={3} />
      <Box y={236} x={230} w={130} label="Supabase" sub="production + auth" tone={4} />
    </svg>
  );
}

function TraumaDiagram() {
  return (
    <svg viewBox={`0 0 ${W} 232`} role="img" aria-labelledby="dg-trauma">
      <title id="dg-trauma">
        trauma.repair architecture. The React single-page app queries Supabase directly, and every
        query passes through Postgres row-level security policies before it reaches table data.
      </title>

      <Lane y={38}>CLIENT</Lane>
      <Box y={16} label="React Router SPA" sub="Cloudflare Pages" tone={2} />
      <Arrow from={60} to={104} label="supabase-js + user JWT" tone={2} />

      <Lane y={160}>POSTGRES</Lane>
      <rect
        x={GUTTER - 10}
        y={104}
        width={BOX_W + 20}
        height={112}
        rx={9}
        fill="none"
        stroke="var(--border-strong)"
        strokeWidth={1}
        strokeDasharray="3 3"
      />

      <Box y={118} label="Row-level security" sub="checked against auth.uid()" tone={1} />
      <Arrow from={162} to={180} tone={1} />
      <Box y={180} h={24} label="posts · comments · collections" tone={4} />
    </svg>
  );
}

function SteamLockedDiagram() {
  return (
    <svg viewBox={`0 0 ${W} 248`} role="img" aria-labelledby="dg-steam">
      <title id="dg-steam">
        SteamLocked architecture. A static frontend on GitHub Pages sends a bearer token to a
        Cloudflare Worker, which verifies Steam OpenID sign-in and calls the Steam Web API.
      </title>

      <Lane y={38}>CLIENT</Lane>
      <Box y={16} label="Static frontend" sub="GitHub Pages · no build step" tone={2} />
      <Arrow from={60} to={104} label="Authorization: Bearer" tone={2} />

      <Lane y={126}>EDGE</Lane>
      <Box y={104} label="Cloudflare Worker" sub="HMAC-SHA256 sessions" tone={1} />
      <Arrow from={148} to={192} label="fetch + cf.cacheTtl" tone={1} />

      <Lane y={214}>STEAM</Lane>
      <Box y={192} x={90} w={130} label="OpenID 2.0" sub="identity" tone={3} />
      <Box y={192} x={230} w={130} label="Web API" sub="games · achievements" tone={4} />
    </svg>
  );
}

function PipelineDiagram() {
  return (
    <svg viewBox={`0 0 ${W} 288`} role="img" aria-labelledby="dg-pipe">
      <title id="dg-pipe">
        Owner statement pipeline. A PDF is parsed by coordinate clustering into a typed statement
        model, which is then posted to QuickBooks Online and emailed through Zoho Mail.
      </title>

      <Lane y={38}>INPUT</Lane>
      <Box y={16} label="Owner statement PDF" sub="two-column header · ledger" tone={3} />
      <Arrow from={60} to={100} tone={3} />

      <Lane y={122}>PARSE</Lane>
      <Box y={100} label="Coordinate clustering" sub="pdfplumber · (x, y) → rows" tone={1} />
      <Arrow from={144} to={176} tone={1} />
      <Box y={176} h={32} label="OwnerStatement (Pydantic)" tone={1} />

      <line x1={MID} y1={208} x2={MID} y2={228} stroke="var(--viz-1)" strokeWidth={1.25} opacity={0.6} />
      <line x1={155} y1={228} x2={295} y2={228} stroke="var(--viz-1)" strokeWidth={1.25} opacity={0.6} />
      <Arrow from={228} to={244} x={155} tone={2} />
      <Arrow from={228} to={244} x={295} tone={4} />

      <Lane y={266}>OUTPUT</Lane>
      <Box y={244} x={90} w={130} label="QuickBooks" sub="OAuth2 · deposits" tone={2} />
      <Box y={244} x={230} w={130} label="Zoho Mail" sub="OAuth2 · summary" tone={4} />
    </svg>
  );
}

const DIAGRAMS: Record<DiagramId, () => React.ReactElement> = {
  recservices: RecServicesDiagram,
  trauma: TraumaDiagram,
  steamlocked: SteamLockedDiagram,
  pipeline: PipelineDiagram,
};

/* The caption carries what the drawing deliberately leaves out. */
const CAPTIONS: Record<DiagramId, string> = {
  recservices:
    'Three sub-teams, one contract. The OpenAPI spec let the frontend team build against a documented interface instead of reading backend source, and the database switcher meant thirty developers were never sharing one database.',
  trauma:
    'Every query passes the policies before it reaches a table, so a permission check skipped in the browser changes nothing. Any branch deploys to staging, main deploys to production, against two separate Supabase projects.',
  steamlocked:
    'Every outbound call from the Worker counts against a ceiling of fifty per invocation, and Cloudflare counts cache reads too. That limit is what shaped the caching and batching, including sorting app IDs so a library always produces the same URLs and actually hits the edge cache.',
  pipeline:
    'One parse, two destinations. Dry-run is the default, so the whole flow can be demonstrated end to end on a generated statement with no credentials and no network call.',
};

export function Diagram({ id }: { id: DiagramId }) {
  const Svg = DIAGRAMS[id];
  return (
    <figure className="diagram">
      <Svg />
      <figcaption>{CAPTIONS[id]}</figcaption>
    </figure>
  );
}
