import type { DiagramId } from '../components/Diagrams';

export type Link = { label: string; href: string; hint?: string };

export type Project = {
  id: string;
  /** Short name for nav — says what the thing is, not who it was for. */
  navName: string;
  /** Full title, legible to someone who has never heard of the client. */
  name: string;
  /** Who it was for and in what capacity. */
  context: string;
  period: string;
  /** One sentence a reader takes in without stopping. */
  summary: string;
  /** Two short paragraphs of framing, no more. */
  detail: string[];
  /** Concrete things built. Scannable. */
  built: string[];
  /**
   * The one problem per project worth being asked about in an interview.
   * Always visible — collapsing it hides the most interesting thing on the page.
   */
  hardPart: {
    title: string;
    body: string;
    code?: { language: string; caption: string; source: string };
  };
  stack: string[];
  links: Link[];
  diagram?: DiagramId;
  /** Team size / ownership, shown as a single line. */
  scale: string;
};

export const projects: Project[] = [
  {
    id: 'scheduling-system',
    navName: 'Scheduling system',
    name: 'Employee Scheduling & Time-Tracking System',
    context: 'BYU–Idaho Rec Services · Software Engineer and Project Lead',
    period: 'Sept 2024 – July 2025',
    scale: 'Team of 30+ across frontend, backend, and database',
    summary:
      'A full-stack scheduling, shift-swap, and time-clock system built to replace Sling, the commercial SaaS the department was paying for.',
    detail: [
      'Rec Services runs a large student workforce across multiple campus facilities — shifts, swaps, time-off, clock-ins, and payroll export all went through software the department rented and could not change. They wanted a system they owned, that fit their own rules and met university security standards.',
      'I led it: the requirements work with the customer, the architecture, and a team of more than thirty student developers split across three sub-teams, with the roster turning over between semesters.',
      'It is a continuing program rather than a one-semester deliverable — each cohort hands it to the next, and the department still runs Sling while it is built out. So the thing I was actually accountable for was leaving it in a state the next team could build on: a scoped backlog, a documented API, and a schema that would not need tearing up.',
    ],
    built: [
      'API features for authentication, shift management, and data persistence, against a documented OpenAPI contract so the frontend team could build without reading backend source.',
      'A role hierarchy — employee, coordinator, manager, administrator — with permissions enforced per role.',
      'The database schema and migration set, running MySQL locally and Supabase Postgres in production through a switcher, so thirty developers never shared one database.',
      'The requirements and design documents, ER diagram, and semester-by-semester roadmap, written so the next cohort could pick the project up without me.',
      'The team process: branch per issue, protected main, required peer review before merge, weekly sprints. I reviewed pull requests across all three sub-teams.',
    ],
    hardPart: {
      title: 'Cutting twenty-plus requested features down to six',
      body: 'Elicitation surfaced everything from GPS-verified clock-ins to Workday payroll integration to in-app group chat. All of it reasonable; none of it achievable in one semester by a team that was still forming. I forced a ranked priority list and drew the MVP line under six features — auth, account creation, role-based access control, clock in/out, schedule viewing, and shift scheduling — using one test: could Rec Services stop using Sling for their daily workflow? Everything past that line went into a documented backlog tagged with the semester it was targeted for, so nothing was lost and nobody relitigated it mid-sprint. That backlog is what the next cohort started from.',
    },
    stack: [
      'React',
      'Node.js',
      'Express',
      'PostgreSQL',
      'Supabase',
      'MySQL',
      'Knex',
      'OpenAPI',
      'GitHub Actions',
    ],
    links: [],
    diagram: 'recservices',
  },
  {
    id: 'trauma-repair',
    navName: 'Community platform',
    name: 'trauma.repair — Community Platform',
    context: 'Two-engineer team · Software Engineer',
    period: 'Oct – Nov 2025',
    scale: 'Live in production · two-engineer team · posts, comments, collections',
    summary:
      'An online community platform supporting abuse survivors, live in production on Cloudflare and Supabase, with authorization enforced by the database rather than the client.',
    detail: [
      'I worked on this as one of two engineers, shipping features through pull requests into a real deployment pipeline: every branch to staging, main to production, with two separate Supabase instances so a migration never reaches production untested.',
    ],
    built: [
      'Posts end to end — creating, editing, deleting, individual post pages, click-through from the feed, and text search.',
      'Comments, including deletion, with the row-level security policies that scope them to their author.',
      'Collections and favorites, where ownership is resolved through the parent collection rather than the row itself.',
      'Seven of the project’s seventeen schema migrations, generated declaratively from schema files rather than hand-written, and reviewed my teammate’s alongside the code that needed them.',
      'The local seed data set, so any engineer can bring up a working stack with realistic content from nothing.',
    ],
    hardPart: {
      title: 'Putting authorization in Postgres instead of in React',
      body: 'The app talks to Supabase directly from the browser, which means any permission check written in React is advisory — someone can call the API with their own token and skip the UI entirely. For a platform holding this kind of content, "the frontend hides it" is not a security model. So every table has row-level security enabled and access is expressed as policies evaluated against auth.uid() inside the database. Collections were the interesting case: permission on a collection item is a property of its parent collection, not of the row, so the policy runs a nested EXISTS back to the collections table.',
      code: {
        language: 'sql',
        caption: 'collection_posts — ownership resolved through the parent collection',
        source: `create policy "Users can add posts to their own collections"
  on "public"."collection_posts"
  as permissive for insert to authenticated
  with check (
    exists (
      select 1 from public.collections c
      where c.id = collection_posts.collection_id
        and c.auth_id = (select auth.uid())
    )
  );`,
      },
    },
    stack: [
      'React 19',
      'TypeScript',
      'React Router 7',
      'Tailwind CSS',
      'Supabase',
      'PostgreSQL',
      'Row-Level Security',
      'Cloudflare Pages',
    ],
    links: [{ label: 'Visit the site', href: 'https://trauma.repair', hint: 'trauma.repair' }],
    diagram: 'trauma',
  },
  {
    id: 'steamlocked',
    navName: 'SteamLocked',
    name: 'SteamLocked — Achievement Challenge App',
    context: 'Solo — design, build, test, deploy',
    period: 'Aug – Sept 2026',
    scale: 'Solo · 145 tests · two independent deploy pipelines',
    summary:
      'Sign in with Steam and get dealt a random achievement you have not earned. It stays your only task until Steam itself confirms the unlock — verified against Steam’s data, not a checkbox.',
    detail: [
      'I built every part of this one: the API on a Cloudflare Worker, sign-in, the frontend, the tests, and both deploy pipelines. It is the project where there was nobody to hand the hard parts to.',
    ],
    built: [
      'The whole HTTP API as a Cloudflare Worker — profile, owned games, per-game achievements with global rarity, and the roll endpoint.',
      'Steam sign-in implemented from the spec over OpenID 2.0, since Steam offers no OAuth, issuing HMAC-SHA256 session tokens via WebCrypto. Return URLs are allowlisted so the flow cannot become an open redirect.',
      'A difficulty system derived from Steam’s global unlock percentages — easy at 50% and above, down to insane below 5%.',
      'Reworked caching and batching to fit inside Cloudflare’s 50-subrequest-per-invocation cap, which counts cache reads as well as fetches.',
      '145 tests across nine Vitest suites covering the API and frontend, and two path-filtered GitHub Actions workflows so a frontend change never redeploys the API.',
    ],
    hardPart: {
      title: 'A bug with no error: the image that loaded successfully and was blank',
      body: 'Some games rendered with empty cover art — not broken images, empty ones. The usual header.jpg path is wrong for a number of newer titles: some 404 cleanly, but others (Battlefield 6 among them) return a blank 1.4 KB placeholder with a 200. The browser fires load, not error, so every fallback I had was unreachable. There was nothing to catch. I stopped trusting the legacy URL pattern and moved to the store API, which reports authoritatively whether art exists, needs no key, and takes 200 app IDs per call — which also helped the subrequest budget. Games with genuinely no art now resolve to null and the UI draws a tile from the title’s initials. "No art" became a state the code models instead of a silent rendering failure.',
    },
    stack: [
      'JavaScript',
      'Cloudflare Workers',
      'WebCrypto',
      'OpenID 2.0',
      'Steam Web API',
      'Vitest',
      'GitHub Actions',
    ],
    links: [
      { label: 'Code', href: 'https://github.com/Tnargw/SteamLocked', hint: 'github.com/Tnargw' },
    ],
    diagram: 'steamlocked',
  },
  {
    id: 'automation-pipeline',
    navName: 'Automation pipeline',
    name: 'Owner Statement Automation Pipeline',
    context: 'Bedrock Investment Property · built on my own initiative',
    period: '2026',
    scale: 'Solo · validated against generated fixtures, pending rollout',
    summary:
      'A Python pipeline that reads a property statement PDF, posts each transaction to QuickBooks Online, and emails the owner a summary through Zoho Mail — replacing a workflow done entirely by hand.',
    detail: [
      'This started as a data-entry task at my current job: open a PDF, retype the numbers into QuickBooks, email the client. I recognized it as an ETL problem and proposed building it properly instead. It runs end to end against generated sample statements today; the integrations are implemented against QuickBooks and Zoho developer sandboxes and have not yet been cut over to live company accounts.',
    ],
    built: [
      'A PDF parser that handles a two-column header by reading every word’s (x, y) position, clustering words into visual rows, and splitting each row at the page midpoint.',
      'Pydantic models for the domain, so the rest of the pipeline works with typed objects rather than loose strings.',
      'OAuth2 authorization-code flows with token refresh against two third-party APIs — QuickBooks Online and Zoho Mail.',
      'A pytest suite that round-trips generated fixture PDFs, so no real financial data lives in the repository.',
    ],
    hardPart: {
      title: 'Making it safe to run before it was safe to trust',
      body: 'A script that posts to a live accounting system and emails clients is not something you test by running it. Dry-run is the default: it parses a real PDF and prints exactly what it would have sent to QuickBooks and Zoho, without credentials or a network call. The test fixtures are synthetic PDFs generated by a script in the repo, with fabricated company names and amounts, so the parser is tested end to end without anyone’s real statements sitting in version control.',
    },
    stack: ['Python', 'pdfplumber', 'Pydantic', 'OAuth2', 'REST APIs', 'pytest'],
    links: [],
    diagram: 'pipeline',
  },
];

/** Smaller work — listed, not given a section each. */
export const smallerProjects: { name: string; blurb: string; href?: string }[] = [
  {
    name: 'SpecGen',
    blurb:
      'Turns a plain-English feature description into structured Gherkin scenarios covering happy path, edge cases, and error states, using the Claude API. The engineering is in the system prompt — it reliably catches things the input did not specify, like returning a generic confirmation on an unregistered password-reset email to prevent account enumeration.',
    href: 'https://github.com/Tnargw/specgen',
  },
  {
    name: 'AlgorithmLib',
    blurb:
      'Thirteen algorithms implemented from scratch in C# against 61 unit tests — Dijkstra, Bellman-Ford, DAG shortest path, a binary heap priority queue, merge sort, quicksort, binary search, Huffman coding, convex hull, string matching, and RSA. The honest answer to "can you write this without a library?"',
  },
  {
    name: 'Storyium',
    blurb:
      'Book discovery and reading tracker: extracts subjects from OpenLibrary, queries Google Books for recommendations, and tracks progress. Live, with an animated canvas UI.',
    href: 'https://storyium.netlify.app',
  },
  {
    name: 'Peer-to-peer Pong',
    blurb:
      'Two-player Pong in Python over TCP, using Python Banyan’s topic/payload backplane to sync game state between both clients in real time. Demo video in the repo.',
    href: 'https://github.com/Tnargw/p2pGame',
  },
  {
    name: 'Snowfall data analysis',
    blurb:
      'Pulls historical snowfall from the Open-Meteo API, resolves nearby cities through Geonames, and renders interactive Folium heatmaps as standalone HTML.',
    href: 'https://github.com/Tnargw/Snowfall-DataAnalysis',
  },
];
