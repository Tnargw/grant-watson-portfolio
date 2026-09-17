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

```
src/
  content/
    profile.ts     Identity, proof points, skills, how-I-work, education, jobs
    projects.ts    The four projects and the smaller ones
  components/
    Sections.tsx   Every page section — presentation only, no copy
    Header.tsx     Sticky nav with scroll-spy
    Diagrams.tsx   Architecture diagrams, hand-drawn as inline SVG
    CodeBlock.tsx  A ~40-line highlighter, so no library ships for two excerpts
  hooks/
    useTheme.ts    Stored preference, falling back to the OS
    useScrollSpy.ts One IntersectionObserver, no scroll listener
  styles/
    tokens.css     Light and dark, each declared in full
    global.css     Everything else
```

Content and presentation are separated on purpose: the copy is the product on a
site like this, and it should be editable without touching JSX.

### Decisions worth naming

**Ordered for how a hiring manager actually reads.** Stack sits directly under
the hero, before the projects, because a recruiter or engineering manager scans
for stack match before they read anything. Then the work, then a section on how
I operate on a team, then background. The degree is a supporting fact near the
bottom, not the opening line.

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

Pushes to `main` build and publish to Cloudflare Pages via
`.github/workflows/deploy.yml`, behind the same typecheck/test/build gate as CI.

One-time setup:

1. Create a Cloudflare Pages project named `grant-watson-portfolio`.
2. Add repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
3. Update the canonical URL, `og:url`, and `og:image` in `index.html` to the
   real domain.

All three versions use different `localStorage` theme keys, so hosting more than
one does not make them fight over a single setting.
