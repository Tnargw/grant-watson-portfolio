export type DiagramId = 'recservices' | 'trauma' | 'steamlocked' | 'pipeline';

/*
 * Architecture diagrams, drawn by hand as inline SVG.
 *
 * Inline rather than an image because these have to work in both themes: every
 * fill and stroke is a CSS custom property, so a diagram re-colors with the
 * page instead of sitting in a light-mode rectangle on a dark one. They are
 * vertical because they live in a narrow column — a wide left-to-right diagram
 * would be unreadable at phone width.
 */

const W = 400;
const BOX_H = 44;
const RADIUS = 7;

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

function Box({ x = 40, y, w = 320, h = BOX_H, label, sub, tone = 1, dashed }: BoxProps) {
  const stroke = `var(--viz-${tone})`;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={RADIUS}
        fill="var(--viz-surface)"
        stroke={stroke}
        strokeWidth={1.25}
        strokeDasharray={dashed ? '4 3' : undefined}
        opacity={dashed ? 0.75 : 1}
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

function Arrow({ from, to, x = W / 2, label, tone = 1 }: ArrowProps) {
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
        opacity={0.8}
      />
      {label && (
        <text x={x + 9} y={(from + to) / 2 + 3} fontSize={9} fill="var(--text-muted)">
          {label}
        </text>
      )}
    </g>
  );
}

function Caption({ y, children }: { y: number; children: string }) {
  return (
    <text x={W / 2} y={y} textAnchor="middle" fontSize={9} fill="var(--text-muted)">
      {children}
    </text>
  );
}

function Label({ x, y, children, anchor = 'start', fill = 'var(--text-muted)' }: {
  x: number;
  y: number;
  children: string;
  anchor?: 'start' | 'end' | 'middle';
  fill?: string;
}) {
  return (
    <text x={x} y={y} fontSize={8.5} textAnchor={anchor} fill={fill}>
      {children}
    </text>
  );
}

function RecServicesDiagram() {
  return (
    <svg viewBox={`0 0 ${W} 342`} role="img" aria-labelledby="dg-rec">
      <title id="dg-rec">
        Rec Services architecture: a React progressive web app calls an Express API, which routes
        through a database switcher to MySQL in local development or Supabase Postgres in
        production, with Supabase handling authentication.
      </title>

      <Label x={40} y={12}>FRONTEND TEAM</Label>
      <Box y={20} label="React PWA client" sub="installable · push notifications" tone={2} />
      <Arrow from={64} to={102} label="HTTPS / JSON" tone={2} />

      <Label x={40} y={96}>BACKEND TEAM</Label>
      <Box y={102} label="Express API" sub="helmet · CORS · Joi · Winston" tone={1} />
      <Arrow from={146} to={160} tone={1} />
      <Box
        y={160}
        h={36}
        label="OpenAPI / Swagger contract"
        sub="what the frontend builds against"
        tone={1}
        dashed
      />
      {/* The API fans out to one of two engines, so the trunk splits rather
          than pointing at either box directly. */}
      <line x1={200} y1={196} x2={200} y2={242} stroke="var(--viz-1)" strokeWidth={1.25} opacity={0.6} />
      <text x={209} y={218} fontSize={9} fill="var(--text-muted)">
        Knex migrations
      </text>
      <line x1={116} y1={242} x2={284} y2={242} stroke="var(--viz-1)" strokeWidth={1.25} opacity={0.6} />

      <Label x={40} y={226}>DATABASE TEAM</Label>
      <Arrow from={242} to={256} x={116} tone={3} />
      <Arrow from={242} to={256} x={284} tone={4} />
      <Box y={256} x={40} w={152} label="MySQL" sub="local dev" tone={3} />
      <Box y={256} x={208} w={152} label="Supabase Postgres" sub="production + auth" tone={4} />

      <Caption y={324}>one switcher, one set of migrations, two engines —</Caption>
      <Caption y={337}>so thirty developers never share a database</Caption>
    </svg>
  );
}

function TraumaDiagram() {
  return (
    <svg viewBox={`0 0 ${W} 300`} role="img" aria-labelledby="dg-trauma">
      <title id="dg-trauma">
        trauma.repair architecture: the React single-page app queries Supabase directly, and every
        query passes through Postgres row-level security policies before reaching table data.
      </title>

      <Box y={14} label="React Router SPA" sub="Cloudflare Pages" tone={2} />
      <Arrow from={58} to={100} label="supabase-js + user JWT" tone={2} />

      <rect
        x={24}
        y={100}
        width={352}
        height={116}
        rx={9}
        fill="none"
        stroke="var(--border-strong)"
        strokeWidth={1}
        strokeDasharray="3 3"
      />
      <Label x={34} y={114}>POSTGRES</Label>

      <Box y={122} label="Row-level security" sub="policies evaluated against auth.uid()" tone={1} />
      <Arrow from={166} to={184} tone={1} />
      <Box y={184} h={24} label="posts · comments · collections · profiles" tone={4} />

      <Caption y={240}>The client cannot skip the check —</Caption>
      <Caption y={253}>it is not in the client.</Caption>

      <line x1={24} y1={272} x2={376} y2={272} stroke="var(--border)" strokeWidth={1} />
      <Label x={24} y={290}>any branch → staging</Label>
      <Label x={376} y={290} anchor="end">main → production</Label>
    </svg>
  );
}

function SteamLockedDiagram() {
  return (
    <svg viewBox={`0 0 ${W} 336`} role="img" aria-labelledby="dg-steam">
      <title id="dg-steam">
        SteamLocked architecture: a static frontend on GitHub Pages sends a bearer token to a
        Cloudflare Worker, which verifies Steam OpenID sign-in and calls the Steam Web API within a
        fifty subrequest budget.
      </title>

      <Box y={14} label="Static frontend" sub="GitHub Pages · no build step" tone={2} />
      <Arrow from={58} to={98} label="Authorization: Bearer" tone={2} />

      <Box y={98} label="Cloudflare Worker" sub="HMAC-SHA256 sessions · at the edge" tone={1} />
      <Label x={W - 2} y={112} anchor="end" fill="var(--viz-1)">50 subrequests</Label>
      <Label x={W - 2} y={123} anchor="end">per invocation</Label>

      <Arrow from={142} to={190} label="fetch + cf.cacheTtl" tone={1} />
      <Label x={209} y={174}>(sorted ids → cache hits)</Label>

      <Box y={190} x={40} w={152} label="Steam OpenID 2.0" sub="identity, verified" tone={3} />
      <Box y={190} x={208} w={152} label="Steam Web API" sub="games · achievements" tone={4} />

      <line
        x1={284}
        y1={234}
        x2={284}
        y2={254}
        stroke="var(--viz-4)"
        strokeWidth={1.25}
        opacity={0.5}
        strokeDasharray="3 3"
      />
      <Box
        y={254}
        h={38}
        label="IStoreBrowseService / GetItems"
        sub="200 app ids per call · authoritative cover art"
        tone={4}
        dashed
      />

      <Caption y={316}>two path-filtered pipelines — frontend and API</Caption>
      <Caption y={329}>deploy independently from one repository</Caption>
    </svg>
  );
}

function PipelineDiagram() {
  return (
    <svg viewBox={`0 0 ${W} 300`} role="img" aria-labelledby="dg-pipe">
      <title id="dg-pipe">
        Owner statement pipeline: a PDF is parsed by coordinate clustering into a typed statement
        model, which is posted to QuickBooks Online and emailed through Zoho Mail.
      </title>

      <Box y={14} label="Owner statement PDF" sub="two-column header · table ledger" tone={3} />
      <Arrow from={58} to={96} tone={3} />
      <Box y={96} label="Coordinate clustering parser" sub="pdfplumber · (x, y) → visual rows" tone={1} />
      <Arrow from={140} to={176} tone={1} />
      <Box y={176} h={32} label="OwnerStatement (Pydantic)" tone={1} />

      <line x1={200} y1={208} x2={200} y2={224} stroke="var(--viz-1)" strokeWidth={1.25} opacity={0.6} />
      <line x1={112} y1={224} x2={288} y2={224} stroke="var(--viz-1)" strokeWidth={1.25} opacity={0.6} />
      <line x1={112} y1={224} x2={112} y2={242} stroke="var(--viz-2)" strokeWidth={1.25} opacity={0.6} />
      <line x1={288} y1={224} x2={288} y2={242} stroke="var(--viz-4)" strokeWidth={1.25} opacity={0.6} />

      <Box y={242} x={36} w={152} h={40} label="QuickBooks Online" sub="OAuth2 · deposits" tone={2} />
      <Box y={242} x={212} w={152} h={40} label="Zoho Mail" sub="OAuth2 · owner email" tone={4} />
    </svg>
  );
}

const DIAGRAMS: Record<DiagramId, () => React.ReactElement> = {
  recservices: RecServicesDiagram,
  trauma: TraumaDiagram,
  steamlocked: SteamLockedDiagram,
  pipeline: PipelineDiagram,
};

const CAPTIONS: Record<DiagramId, string> = {
  recservices:
    'Three sub-teams, one contract. The OpenAPI spec let the frontend team build against a documented interface instead of reading backend source, and the database switcher meant nobody shared a database.',
  trauma:
    'Authorization lives in Postgres. The single-page app talks to Supabase directly, so a permission check written in React would be advisory — these are not.',
  steamlocked:
    'Every arrow leaving the Worker counts against a fifty-subrequest ceiling. That limit, not the product spec, is what shaped the caching and batching strategy.',
  pipeline:
    'One parse, two destinations. Dry-run is the default, so the whole flow can be demonstrated end to end without credentials or a network call.',
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
