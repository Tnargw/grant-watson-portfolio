# grant-watson-portfolio

My personal engineering site — four projects, each with the one problem worth
being asked about in an interview.

This is the version I'd send by default. There are two others in sibling
folders: `../grant-watson-site` goes deeper (three long-form case studies, six
collapsible decisions each), and `../grant-watson-simple` is plainer and
lighter. Same material, three registers.

React 19, TypeScript, Vite. No UI framework, no component library, hand-authored
CSS, and a test suite that runs in CI before anything deploys.

## Running it

```bash
npm install
npm run dev
```

| Script              | What it does                                  |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Vite dev server with HMR on :5173             |
| `npm run build`     | Typecheck, then production build into `dist/` |
| `npm run preview`   | Serve the built `dist/` locally               |
| `npm run typecheck` | `tsc -b --noEmit`                             |
| `npm run lint`      | ESLint over the TypeScript sources            |
| `npm test`          | Vitest suite (jsdom + Testing Library)        |

## How it is put together

Three pages, built as three real HTML documents rather than a single-page app
with a router.

```
index.html          →  src/main.tsx   →  src/pages/Home.tsx
work/index.html     →  src/work.tsx   →  src/pages/WorkPage.tsx
about/index.html    →  src/about.tsx  →  src/pages/AboutPage.tsx

src/
  content/
    profile.ts     Identity, quick facts, skills, how-I-work, education, jobs
    projects.ts    The four projects and the smaller ones
  components/
    Header.tsx     Page nav, marks the current document
    Sections.tsx   Every section, shared across pages. Presentation only
    Diagrams.tsx   Architecture diagrams, hand-drawn as inline SVG
    CodeBlock.tsx  A ~40-line highlighter, so no library ships for two excerpts
  hooks/useTheme.ts
  styles/          tokens.css (light and dark in full), global.css
```

| Page      | What is on it                                              |
| --------- | ---------------------------------------------------------- |
| `/`       | Who I am, availability, stack, one line per project, contact |
| `/work/`  | The four projects in full, plus the smaller ones            |
| `/about/` | Skills, how I work on a team, experience, education         |

### Decisions worth naming

**The home page is a summary, not the whole site.** It holds what a résumé
fits on its first screen: who I am, what I work with, what I have built as one
line each, and how to reach me. Anything needing more than a line lives on its
own page. Someone skimming should not scroll past six thousand words to find my
email, and someone interested should get the detail in one click. A test fails
if project bodies, the skills grid, or experience entries appear on the home
page.

**Three documents, not a router.** Each page is a real URL with its own title,
description and social card, so a search result for `/work/` opens the work
page rather than an empty shell that then fetches it. There is no SPA fallback
to configure on the host, and Vite splits the shared React bundle so navigating
between pages does not re-download it.

**The hard part is never collapsed.** Each project ends with one problem stated
in full — the constraint, what I chose, and why. The deeper version of this site
put six of these behind disclosure triangles per project, which meant most
readers saw none of them. One per project, always open, is the trade.

**Projects are named for what they are.** "Rec Services" means nothing to
someone outside that department; "Employee Scheduling & Time-Tracking System"
says what was built. A test enforces it.

**Content is typed data, and the tests check it.** `src/test/site.test.tsx`
asserts what a screenshot cannot: no duplicate ids behind the anchors, no
relative URL where an absolute one belongs, no skill claimed without naming
where it was used, no project without a substantial hard part, and that the
positioning copy leads on capability rather than on graduating.

**Themes are two complete declarations.** Light is not dark with a filter over
it. `:root[data-theme]` overrides the `prefers-color-scheme` block in both
directions, and an inline script in `index.html` applies the stored choice
before first paint so there is no flash.

**Diagrams are inline SVG, not images.** Every fill and stroke is a CSS custom
property, so a diagram re-colours with the page. Each carries a `<title>`
describing the architecture in prose for screen readers.

### Accessibility

Single `<h1>`, no heading-level skips, a skip link, visible focus rings, and
`rel="noopener"` on every external link. Every text/background pair in both
themes meets WCAG AA — verified across 36 pairs. No horizontal scroll at 375px;
the only element wider than the viewport is a code sample inside its own
`overflow-x: auto` container.

## Deploying

Connected to Cloudflare Pages through its GitHub integration: every push to
`main` is built and published, and every other branch gets its own preview URL.
Cloudflare runs the build itself, so there are no API tokens or repository
secrets to manage.

| Setting             | Value           |
| ------------------- | --------------- |
| Build command       | `npm run build` |
| Build output        | `dist`          |
| Node version        | 22              |

`.github/workflows/ci.yml` runs typecheck, lint, tests and a build on every
push and pull request, independently of the deploy.

Live at <https://grant-watson-portfolio.pages.dev>.

### Moving to a custom domain

Add it in the Pages project under **Custom domains**, then update the four
places the site's own address is written: the canonical link, `og:url` and
`og:image` in `index.html`, the `Sitemap:` line in `public/robots.txt`, and
`<loc>` in `public/sitemap.xml`. `src/test/site-urls.test.ts` fails if any of
them disagree, so a half-finished move is caught by the test suite.

### If you want deploys gated on tests

Cloudflare's integration publishes whether or not the tests pass. To block a
failing build from going live instead, deploy from GitHub Actions with
`cloudflare/wrangler-action` (`pages deploy dist --project-name=...`) after the
test step, add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as repository
secrets, and turn off the Git integration in the Pages project so the two do
not race.

`public/_headers` carries the security headers and the immutable cache policy
for Vite's fingerprinted assets.
