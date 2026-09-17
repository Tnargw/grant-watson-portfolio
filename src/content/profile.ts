import type { Link } from './projects';

export const profile = {
  name: 'Grant Watson',
  role: 'Software Engineer',
  /** Capability first. The degree is a supporting fact, not the headline. */
  positioning:
    'I build and ship full-stack web applications — React and TypeScript on the front, Node and Postgres behind it, deployed through CI to Cloudflare and Supabase.',
  secondary:
    'I have led a thirty-person build for a real client, shipped features into a production platform alongside another engineer, and designed and built an end-to-end automation for a manual business workflow on my own initiative.',
  seeking:
    'Looking for a software engineering role — full-stack, backend, or frontend. Open to remote or relocation.',
  location: 'Bowling Green, KY',
  email: 'tnargw@gmail.com',
  phone: '(859) 488-1103',
  resumeHref: './Grant-Watson-Resume.pdf',
  photo: './grant.webp',
} as const;

export const socials: Link[] = [
  { label: 'GitHub', href: 'https://github.com/Tnargw', hint: 'Tnargw' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/grant-watson-/', hint: 'grant-watson-' },
];

/**
 * Every one of these is checkable against the work below. Nothing here is a
 * percentage I cannot show the working for.
 */
export const proofPoints: { value: string; label: string }[] = [
  { value: '30+', label: 'engineers led on a two-semester client build' },
  { value: '4', label: 'projects built end to end, across web, API, and data' },
  { value: '145', label: 'tests written across SteamLocked’s API and frontend' },
  { value: '4.0', label: 'GPA, B.S. Computer Science' },
];

/**
 * Placed high on the page on purpose: a hiring manager or recruiter scans for
 * stack match before they read anything. Each row still names where it was
 * used, so it is checkable rather than a keyword list.
 */
export const skills: { group: string; items: { name: string; where: string }[] }[] = [
  {
    group: 'Languages',
    items: [
      { name: 'TypeScript', where: 'trauma.repair, this site' },
      { name: 'JavaScript', where: 'SteamLocked Worker, scheduling system API' },
      { name: 'Python', where: 'Automation pipeline, data analysis' },
      { name: 'SQL', where: 'Postgres RLS policies, schema design, migrations' },
      { name: 'C#', where: 'AlgorithmLib, .NET coursework' },
    ],
  },
  {
    group: 'Frontend',
    items: [
      { name: 'React 19', where: 'trauma.repair, this site' },
      { name: 'React Router', where: 'trauma.repair SPA' },
      { name: 'Tailwind CSS', where: 'trauma.repair' },
      { name: 'Vite', where: 'Every current project' },
      { name: 'Accessibility', where: 'Keyboard nav, focus management, WCAG AA contrast' },
    ],
  },
  {
    group: 'Backend & data',
    items: [
      { name: 'Node.js / Express', where: 'Scheduling system API' },
      { name: 'PostgreSQL', where: 'Supabase-hosted, with row-level security' },
      { name: 'Supabase', where: 'Auth, Postgres, migrations, local Docker stack' },
      { name: 'Cloudflare Workers', where: 'SteamLocked API at the edge' },
      { name: 'REST API design', where: 'Documented with OpenAPI / Swagger' },
      { name: 'OAuth2 / OpenID', where: 'QuickBooks, Zoho Mail, Steam sign-in' },
    ],
  },
  {
    group: 'Testing & delivery',
    items: [
      { name: 'Vitest', where: '145 tests across 9 suites on SteamLocked' },
      { name: 'pytest', where: 'Fixture round-trips on the automation pipeline' },
      { name: 'GitHub Actions', where: 'CI gates and path-filtered deploys' },
      { name: 'Git', where: 'Branch-per-issue, protected main, required review' },
    ],
  },
];

/**
 * The section that answers "will this person function on my team", which is
 * most of what an early-career screen is actually testing for.
 */
export const howIWork: { title: string; body: string }[] = [
  {
    title: 'I review code and expect mine reviewed',
    body: 'On the scheduling system I reviewed pull requests across frontend, backend, and database sub-teams, and set up the process that required review before merge — branch per issue, protected main. On trauma.repair every change I shipped went through a PR.',
  },
  {
    title: 'I write tests, and I gate deploys on them',
    body: '145 tests across nine Vitest suites on SteamLocked’s API and frontend, including one that specifically covers the platform limit that broke it. The automation pipeline’s pytest suite round-trips generated fixture PDFs. My algorithms library carries 61 unit tests. This site runs typecheck, lint, and the full test suite in CI before a deploy is allowed to proceed.',
  },
  {
    title: 'I work from a written contract, not from guesswork',
    body: 'I documented the scheduling system’s API with OpenAPI so the frontend team could build against a specification instead of reading backend source, and wrote the requirements and design documents so the next semester of students could continue the project without me.',
  },
  {
    title: 'I can talk to the people who will use it',
    body: 'I ran the requirements elicitation and the customer interview with Rec Services management directly — thirty minutes, ten questions, scoped to resolve the ambiguities that would block implementation. The answers became the data model, including an explicit decision about what personal data not to store.',
  },
  {
    title: 'I look for the work nobody assigned',
    body: 'The automation pipeline was not a ticket. It was a manual data-entry task I was given, recognized as an ETL problem, and proposed rebuilding — then built.',
  },
];

export const education = {
  degree: 'B.S. Computer Science',
  school: 'Brigham Young University–Idaho',
  period: 'Graduated July 2025',
  highlights: ['4.0 GPA, academic scholarship', 'Web Frontend Development certificate'],
  coursework: [
    'Algorithms and Complexity',
    'Data Structures',
    'Discrete Mathematics',
    'Database Design',
    'Parallelism and Concurrency',
    'Massively Parallel Computation',
    'Functional Programming Patterns',
    '.NET Development',
    'Cybersecurity',
  ],
};

export const jobs: {
  role: string;
  org: string;
  period: string;
  location: string;
  points: string[];
}[] = [
  {
    role: 'Data Operations & Process Automation',
    org: 'Bedrock Investment Property',
    period: 'Jun 2026 – Present',
    location: 'Remote',
    points: [
      'Identified a fully manual owner-statement workflow, proposed automating it, and built the Python pipeline described above — validated end to end against generated fixtures, pending a production rollout.',
      'Handle day-to-day data entry and financial record processing across QuickBooks Online and Zoho.',
    ],
  },
  {
    role: 'Software Engineer, Project Lead (Internship)',
    org: 'BYU–Idaho Rec Services',
    period: 'Sept 2024 – Jul 2025',
    location: 'Rexburg, ID · Remote',
    points: [
      'Led 30+ student developers building a scheduling and time-tracking system to replace a commercial SaaS product.',
      'Ran requirements elicitation with department stakeholders, scoped the MVP, designed the schema, built API features, and reviewed code across three sub-teams.',
    ],
  },
  {
    role: 'Assistant Office Manager, previously Installation Technician',
    org: 'Vivint Smart Home',
    period: '2020 – 2023, 2025 – Jun 2026',
    location: 'St. Louis, MO and multi-state',
    points: [
      'Managed 8+ installation technicians through 1,000+ completed jobs, and built the training program they went through.',
      'Accountable for roughly $3M in weekly inventory shipments.',
      'Certified across six states for alarm, smoke, and fire-safety installation; worked 100+ sites and trained 10+ employees before moving into management.',
    ],
  },
];
