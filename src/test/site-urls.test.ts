import { describe, expect, it } from 'vitest';
// Read through Vite's own pipeline rather than node:fs, so this stays inside
// the app's TypeScript config instead of pulling Node types into it.
import home from '../../index.html?raw';
import work from '../../work/index.html?raw';
import about from '../../about/index.html?raw';
import robots from '../../public/robots.txt?raw';
import sitemap from '../../public/sitemap.xml?raw';

/**
 * The site's own address is written in six places Vite does not rewrite: the
 * canonical link, og:url, og:image and the JSON-LD block in index.html, the
 * Sitemap line in robots.txt, and <loc> in sitemap.xml.
 *
 * Moving to a real domain means editing all of them. Missing one leaves a
 * canonical URL pointing at somewhere that does not exist, which is worse for
 * search ranking than having no canonical at all. These fail if the set ever
 * disagrees with itself.
 */

const publicFiles = Object.keys(import.meta.glob('../../public/*'));
const pages = { '/': home, '/work/': work, '/about/': about };

/** Hosts that belong to other people and are not self-references. */
const EXTERNAL =
  /fonts\.(googleapis|gstatic)\.com|schema\.org|github\.com|linkedin\.com|trauma\.repair|workers\.dev|netlify\.app|cdnjs|sitemaps\.org|w3\.org/;

function selfOrigins(text: string): string[] {
  const found = text.matchAll(/https:\/\/[a-z0-9.-]+\.[a-z]{2,}(?=[/"'\s<]|$)/gi);
  return [...found].map((m) => m[0]).filter((u) => !EXTERNAL.test(u));
}

describe('site URLs', () => {
  it('gives every page its own title, description, and canonical', () => {
    const titles = new Set<string>();
    for (const [path, html] of Object.entries(pages)) {
      expect(html, `${path} has no title`).toMatch(/<title>[^<]+<\/title>/);
      titles.add(html.match(/<title>([^<]+)<\/title>/)![1]);
      expect(html, `${path} has no description`).toMatch(/<meta name="description" content="[^"]+"/);
      // The canonical has to name this page, not the home page.
      expect(html, `${path} canonical is wrong`).toContain(
        `<link rel="canonical" href="https://grant-watson-portfolio.pages.dev${path}"`,
      );
      expect(html).toContain(`<meta property="og:url" content="https://grant-watson-portfolio.pages.dev${path}"`);
    }
    // Duplicate titles across pages are a real SEO problem.
    expect(titles.size).toBe(Object.keys(pages).length);
  });

  it('declares an og:image and a sitemap', () => {
    expect(home).toMatch(/<meta property="og:image" content="https:\/\/[^"]+\/og\.png"/);
    expect(robots).toMatch(/^Sitemap: https:\/\/\S+\/sitemap\.xml$/m);
  });

  it('lists every page in the sitemap', () => {
    for (const path of Object.keys(pages)) {
      expect(sitemap, `${path} missing from sitemap`).toContain(
        `<loc>https://grant-watson-portfolio.pages.dev${path}</loc>`,
      );
    }
  });

  it('uses one and only one origin across the HTML, robots.txt, and sitemap', () => {
    const origins = [...Object.values(pages).flatMap(selfOrigins), ...selfOrigins(robots), ...selfOrigins(sitemap)];
    expect(origins.length, 'expected self-referencing URLs').toBeGreaterThan(3);
    const distinct = [...new Set(origins)];
    expect(distinct.length, `origins disagree: ${distinct.join(', ')}`).toBe(1);
  });

  it('points robots.txt at the same origin the sitemap declares', () => {
    const declared = robots.match(/^Sitemap: (\S+)$/m)?.[1];
    expect(declared).toBeDefined();
    const origin = new URL(declared!).origin;
    expect(sitemap).toContain(`<loc>${origin}/</loc>`);
  });

  it('ships the og:image and the résumé the page links to', () => {
    expect(publicFiles.some((p) => p.endsWith('/og.png'))).toBe(true);
    expect(publicFiles.some((p) => p.endsWith('/Grant-Watson-Resume.pdf'))).toBe(true);
    expect(publicFiles.some((p) => p.endsWith('/favicon.svg'))).toBe(true);
  });
});
