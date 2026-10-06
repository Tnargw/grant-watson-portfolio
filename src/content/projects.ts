import type { DiagramId } from '../components/Diagrams';

/** `live` marks the running thing, as opposed to the source. */
export type Link = { label: string; href: string; hint?: string; live?: boolean };

export type Project = {
  id: string;
  navName: string;
  /** Says what the thing is, not just who it was for. */
  name: string;
  context: string;
  period: string;
  summary: string;
  detail: string[];
  built: string[];
  /** The one problem per project worth being asked about. Always visible. */
  hardPart: {
    title: string;
    body: string;
    code?: { language: string; caption: string; source: string };
  };
  stack: string[];
  links: Link[];
  diagram?: DiagramId;
  scale: string;
};

export const projects: Project[] = [
  {
    id: 'scheduling-system',
    navName: 'Scheduling system',
    name: 'Employee Scheduling & Time-Tracking System',
    context: 'BYU–Idaho Rec Services · Software Engineer and Project Lead',
    period: 'Sept 2024 – July 2025',
    scale: 'Live in production · team of 30+ · three sub-teams',
    summary:
      'A scheduling, shift-swap, and time-clock app built to replace Sling, the commercial tool the department was paying for. It is live at Rec Services now, built out by later cohorts on the foundation my phase laid.',
    detail: [
      'Rec Services runs a lot of student employees across several campus facilities. Shifts, swaps, time-off, clock-ins, and payroll export all went through Sling, which the department rented and could not change. They wanted their own version that fit how they actually work and met the university security rules.',
      'I was the project lead. That meant doing the requirements work with the customer, deciding the architecture, and keeping a team of thirty-plus student developers moving across three sub-teams. The roster turned over every semester.',
      'This was never a one-semester deliverable. Each group of students hands it to the next, so what I was really responsible for was leaving it in a state the next team could pick up. A scoped backlog, an API they could build against, and a schema that would not need to be torn up.',
      'That is the part I am proudest of, because it held. Rec Services is off Sling and running on the system now. Later cohorts built it out after I handed over, on the schema, the API contract, and the six-feature MVP line I drew. The department owns the code and keeps it private, so there is nothing here to link to — what I can offer instead is the people who supervised it.',
    ],
    built: [
      'API features for login, shift management, and saving data, built against an OpenAPI spec so the frontend team did not have to read backend source to know what they were calling.',
      'Role levels for employee, coordinator, manager, and admin, with permissions checked per role.',
      'The database schema and migrations. It runs on MySQL locally and Supabase Postgres in production through a switcher, so thirty people were never sharing one database.',
      'The requirements doc, design doc, ER diagram, and a roadmap broken out by semester, written so the next group could start without me explaining it.',
      'How the team worked day to day. Branch per issue, protected main, review required before merge, weekly sprints. I reviewed pull requests for all three sub-teams.',
    ],
    hardPart: {
      title: 'Cutting twenty-plus requested features down to six',
      body: 'The requirements sessions turned up everything from GPS-verified clock-ins to Workday payroll integration to a group chat. All of it was reasonable, and none of it was going to happen in one semester with a team that was still figuring out who was doing what. I made everyone rank the list, then drew the MVP line under six features: login, account creation, roles, clock in and out, viewing your schedule, and scheduling shifts. The question I used was simple. Could Rec Services stop opening Sling to get through a normal day? Anything past that line went into a backlog tagged with the semester it was aimed at, so we did not lose it and nobody had to argue about it again halfway through a sprint. The next group started from that backlog.',
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
      'An online community platform for abuse survivors. It is live on Cloudflare and Supabase, and the permission rules live in the database instead of the frontend.',
    detail: [
      'I worked on this with one other engineer. Everything went through pull requests into a real pipeline. Any branch deploys to staging, main deploys to production, and there are two separate Supabase projects so a migration gets tried on staging before it touches real data.',
    ],
    built: [
      'Posts from end to end. Writing, editing, deleting, individual post pages, clicking through from the feed, and search.',
      'Comments and deleting comments, with the row-level security policies that keep you to your own.',
      'Collections and favorites, where whether you can touch an item depends on whether you own the collection it sits in.',
      'Seven of the project’s seventeen migrations. They get generated from schema files rather than written by hand. I reviewed my teammate’s.',
      'The seed data for local development, so a new person can clone the repo and get a working database with real-looking content in it.',
    ],
    hardPart: {
      title: 'Putting the permission checks in Postgres instead of React',
      body: 'The app talks to Supabase straight from the browser. That means any permission check I write in React is really just a suggestion. Someone can call the API with their own token and skip my UI completely. On a site holding this kind of content, hiding a button is not security. So every table has row-level security turned on, and the rules are written as policies that Postgres evaluates against auth.uid() on every query. Collections were the interesting one. Whether you can add a post to a collection is not a fact about that row, it is a fact about the collection it belongs to, so the policy has to look back up at the parent.',
      code: {
        language: 'sql',
        caption: 'collection_posts — ownership checked through the parent collection',
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
    links: [
      { label: 'Visit the site', href: 'https://trauma.repair', hint: 'trauma.repair', live: true },
    ],
    diagram: 'trauma',
  },
  {
    id: 'steamlocked',
    navName: 'SteamLocked',
    name: 'SteamLocked — Achievement Challenge App',
    context: 'Solo project',
    period: 'Aug – Sept 2026',
    scale: 'Solo · 145 tests · two deploy pipelines',
    summary:
      'Sign in with Steam and it deals you a random achievement you have not earned yet. That stays your only task until Steam confirms you actually got it.',
    detail: [
      'I built all of this one myself. The API, the sign-in, the frontend, the tests, and both deploy pipelines. The two problems I spent the most time on were not in my plan at all. They only showed up once real accounts with real game libraries hit it.',
    ],
    built: [
      'The whole API as a Cloudflare Worker. Profile, owned games, achievements with how rare each one is globally, and the endpoint that rolls you a task.',
      'Steam sign-in written from the spec. Steam does not offer OAuth, only OpenID 2.0, so I verify the identity with Steam directly and issue an HMAC-SHA256 token with WebCrypto. Return URLs get checked against an allowlist so the login flow cannot be turned into an open redirect.',
      'Difficulty tiers worked out from Steam’s global unlock percentages. Easy is 50% and up, insane is under 5%.',
      'Reworked caching and batching to fit inside Cloudflare’s cap of 50 subrequests per run, which counts cache reads too.',
      '145 tests across nine files covering the API and the frontend, and two path-filtered workflows so changing the frontend does not redeploy the API.',
    ],
    hardPart: {
      title: 'A bug with no error: the image that loaded fine and was blank',
      body: 'Some games showed up with empty cover art. Not broken images, empty ones. The usual header.jpg path is wrong for a lot of newer titles. Some of them 404, which I could handle, but others return a blank 1.4 KB placeholder with a 200. The browser fires load, not error, so none of my fallback code ever ran. There was nothing to catch. I stopped trusting that URL pattern and switched to the store API, which will actually tell you whether art exists. It needs no key and takes 200 app IDs per call, which helped the subrequest problem too. Games with no art now come back as null and the UI draws a tile out of the title’s initials. Now "no art" is a real state instead of something failing quietly.',
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
      // Live first. Someone who can click through and watch real Steam data
      // load is more convinced than someone who reads the source.
      {
        label: 'Visit the site',
        href: 'https://tnargw.github.io/SteamLocked/',
        hint: 'tnargw.github.io',
        live: true,
      },
      { label: 'Code', href: 'https://github.com/Tnargw/SteamLocked', hint: 'github.com/Tnargw' },
    ],
    diagram: 'steamlocked',
  },
  {
    id: 'automation-pipeline',
    navName: 'Automation pipeline',
    name: 'Owner Statement Automation Pipeline',
    context: 'Bedrock Investment Property · my own idea',
    period: '2026',
    scale: 'Solo · running on generated fixtures, not live accounts yet',
    summary:
      'A Python pipeline that reads a property statement PDF, posts each transaction to QuickBooks Online, and emails the owner a summary through Zoho Mail.',
    detail: [
      'This started as data entry at my current job. Open a PDF, retype the numbers into QuickBooks, send the owner an email. That is an ETL problem wearing a chore as a disguise, so I asked if I could build it properly instead.',
      'It runs end to end on generated sample statements right now. The QuickBooks and Zoho integrations are written against developer sandboxes and have not been pointed at the real company accounts yet.',
    ],
    built: [
      'The PDF parser. The header is two columns, and normal text extraction mixes them into nonsense, so it reads the (x, y) position of every word, groups words into visual rows, and splits each row at the middle of the page.',
      'Pydantic models for the data, so everything downstream works with real objects instead of loose strings.',
      'OAuth2 with token refresh for both QuickBooks Online and Zoho Mail.',
      'A pytest suite that generates sample PDFs and parses them back, so no real financial data is sitting in the repo.',
    ],
    hardPart: {
      title: 'Making it safe to run before it was safe to trust',
      body: 'This thing posts to a live accounting system and emails clients. You do not test that by running it and seeing what happens. So dry-run is the default. It parses a real PDF and prints exactly what it would have sent to QuickBooks and Zoho, with no credentials and no network call. The test fixtures are fake statements generated by a script in the repo, with made-up company names and amounts, which means the parser gets tested properly without anyone’s actual statements ending up in version control.',
    },
    stack: ['Python', 'pdfplumber', 'Pydantic', 'OAuth2', 'REST APIs', 'pytest'],
    links: [],
    diagram: 'pipeline',
  },
];

export const smallerProjects: { name: string; blurb: string; href?: string }[] = [
  {
    name: 'AlgorithmLib',
    blurb:
      'Coursework for CSE 381. Eleven algorithms implemented in C# against a provided 61-test NUnit specification: Dijkstra, Bellman-Ford, DAG shortest path, merge sort, quicksort, binary search, linear search, Huffman coding, convex hull, string matching, and RSA. The graph and priority queue types were given; the algorithms are mine. It is not public, because BYU-Idaho’s honor code prohibits posting completed assignment files, but I am happy to walk through any of them.',
  },
  {
    name: 'Concurrency coursework',
    blurb:
      'Threads, locks, and multiprocessing in Python, including a threaded server. The part that stuck with me was how much of concurrency is about not sharing state in the first place, rather than about locking it correctly once you do.',
  },
  {
    name: 'SpecGen',
    blurb:
      'Takes a feature description in plain English and turns it into Gherkin scenarios covering the happy path, edge cases, and error states. Most of the work is in the system prompt. It catches things the input never mentioned, like sending a generic confirmation for an unregistered password-reset email so the form cannot be used to find out who has an account.',
    href: 'https://github.com/Tnargw/specgen',
  },
  {
    name: 'Peer-to-peer Pong',
    blurb:
      'Two-player Pong in Python over TCP. It uses Python Banyan’s topic and payload system to keep both clients in sync in real time. I built it to learn networking, and a game was the most fun way to do that. Demo video is in the repo.',
    href: 'https://github.com/Tnargw/p2pGame',
  },
  {
    name: 'Snowfall data analysis',
    blurb:
      'Pulls historical snowfall from the Open-Meteo API, finds nearby cities with Geonames, and renders it as an interactive Folium heatmap you can open in a browser.',
    href: 'https://github.com/Tnargw/Snowfall-DataAnalysis',
  },
  {
    name: 'Storyium',
    blurb:
      'A book recommendation and reading tracker. It pulls subjects out of OpenLibrary for books you already like, asks Google Books for similar ones, and tracks how far through you are.',
    href: 'https://storyium.netlify.app',
  },
];
