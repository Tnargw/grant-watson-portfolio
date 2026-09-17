import type { Link } from './projects';

export const profile = {
  name: 'Grant Watson',
  role: 'Software Engineer',
  /**
   * The landing gets two plain sentences and nothing else. What a hiring
   * manager needs in the first ten seconds lives here; the rest is one scroll
   * away.
   */
  intro:
    'I build full-stack web apps and the APIs behind them. React and TypeScript on the front, Node and Postgres underneath, deployed through CI to Cloudflare and Supabase.',
  intro2:
    'I led a thirty-person team through a real client build, shipped features into a platform that is live today, and automated a workflow at my job that used to be done by hand.',
  seeking: 'Open to full-stack, backend, or frontend roles. Remote or relocation both work.',
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

/** The short version of the stack, for the landing. */
export const headlineStack = [
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'PostgreSQL',
  'Supabase',
  'Cloudflare Workers',
  'SQL',
];

/** Three facts, plainly stated. All of it is checkable further down. */
export const quickFacts: { label: string; value: string }[] = [
  { label: 'Degree', value: 'B.S. Computer Science, 4.0 GPA' },
  { label: 'Shipped', value: '4 projects end to end' },
  { label: 'Based in', value: 'Bowling Green, KY' },
];

export const skills: { group: string; items: { name: string; where: string }[] }[] = [
  {
    group: 'Languages',
    items: [
      { name: 'TypeScript', where: 'trauma.repair, this site' },
      { name: 'JavaScript', where: 'SteamLocked Worker, scheduling system API' },
      { name: 'Python', where: 'Automation pipeline, data analysis' },
      { name: 'SQL', where: 'RLS policies, schema design, migrations' },
      { name: 'C#', where: 'AlgorithmLib, .NET coursework' },
    ],
  },
  {
    group: 'Frontend',
    items: [
      { name: 'React 19', where: 'trauma.repair, this site' },
      { name: 'React Router', where: 'trauma.repair' },
      { name: 'Tailwind CSS', where: 'trauma.repair' },
      { name: 'Vite', where: 'Everything I build now' },
      { name: 'Accessibility', where: 'Keyboard nav, focus, WCAG AA contrast' },
    ],
  },
  {
    group: 'Backend & data',
    items: [
      { name: 'Node.js / Express', where: 'Scheduling system API' },
      { name: 'PostgreSQL', where: 'On Supabase, with row-level security' },
      { name: 'Supabase', where: 'Auth, Postgres, migrations, local Docker stack' },
      { name: 'Cloudflare Workers', where: 'SteamLocked API' },
      { name: 'REST API design', where: 'Documented with OpenAPI' },
      { name: 'OAuth2 / OpenID', where: 'QuickBooks, Zoho Mail, Steam sign-in' },
    ],
  },
  {
    group: 'Testing & delivery',
    items: [
      { name: 'Vitest', where: '145 tests across 9 files on SteamLocked' },
      { name: 'pytest', where: 'Generated-fixture tests on the pipeline' },
      { name: 'GitHub Actions', where: 'CI and path-filtered deploys' },
      { name: 'Git', where: 'Branch per issue, protected main, review required' },
    ],
  },
];

/** What I am like to work with, which is most of what a first-job screen is about. */
export const howIWork: { title: string; body: string }[] = [
  {
    title: 'I review code, and I want mine reviewed',
    body: 'On the scheduling system I reviewed pull requests for all three sub-teams, and I set up the rule that nothing merges without a review. On trauma.repair everything I shipped went through a PR. I would rather find out something is wrong in review than in production.',
  },
  {
    title: 'I write tests',
    body: 'SteamLocked has 145 of them across nine files, including one that exists only because a platform limit broke the app. The pipeline generates its own sample PDFs and parses them back. This site runs typecheck, lint, and the full suite in CI on every push.',
  },
  {
    title: 'I write things down',
    body: 'I documented the scheduling system API with OpenAPI so the frontend team could work from a spec instead of reading my code, and I wrote the requirements and design docs so the next group of students could take over without me walking them through it. That project outlives everyone on it, so the handoff was the job.',
  },
  {
    title: 'I can talk to the people who will use it',
    body: 'I ran the requirements sessions and the customer interview with Rec Services management myself. Thirty minutes, ten questions, all of them picked to settle the things that would block us from building. Their answers turned into the data model, including a decision about which personal details we were not going to store at all.',
  },
  {
    title: 'I look for work nobody assigned',
    body: 'The automation pipeline was not a ticket. It was a repetitive data-entry task I got handed, and I asked whether I could build the thing that does it instead.',
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
      'Noticed owner statements were being processed entirely by hand, asked to automate it, and built the Python pipeline described above. It runs end to end on generated fixtures and has not been cut over to the live accounts yet.',
      'Handle day-to-day data entry and financial records across QuickBooks Online and Zoho.',
    ],
  },
  {
    role: 'Software Engineer, Project Lead (Internship)',
    org: 'BYU–Idaho Rec Services',
    period: 'Sept 2024 – Jul 2025',
    location: 'Rexburg, ID · Remote',
    points: [
      'Led 30+ student developers building a scheduling and time-tracking system to replace a commercial product.',
      'Ran requirements sessions with department staff, scoped the MVP, designed the schema, built API features, and reviewed code across three sub-teams.',
    ],
  },
  {
    role: 'Assistant Office Manager, previously Installation Technician',
    org: 'Vivint Smart Home',
    period: '2020 – 2023, 2025 – Jun 2026',
    location: 'St. Louis, MO and multi-state',
    points: [
      'Managed 8+ installation technicians through 1,000+ completed jobs, and wrote the training program they went through.',
      'Responsible for around $3M in weekly inventory shipments.',
      'Certified in six states for alarm, smoke, and fire-safety installs. Worked 100+ sites and trained 10+ people before moving into management.',
    ],
  },
];
