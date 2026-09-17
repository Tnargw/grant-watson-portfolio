import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../pages/Home';
import WorkPage from '../pages/WorkPage';
import AboutPage from '../pages/AboutPage';
import { projects, smallerProjects } from '../content/projects';
import {
  education,
  headlineStack,
  howIWork,
  jobs,
  profile,
  quickFacts,
  skills,
  socials,
} from '../content/profile';
import { PAGES } from '../components/Header';

describe('content', () => {
  it('gives every project a unique id, which the anchors rely on', () => {
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('points every external link at an absolute https or mailto URL', () => {
    const all = [
      ...socials,
      ...projects.flatMap((p) => p.links),
      ...smallerProjects.flatMap((p) => (p.href ? [{ href: p.href }] : [])),
    ];
    for (const link of all) {
      expect(link.href).toMatch(/^(https:\/\/|mailto:)/);
    }
  });

  it('uses root-absolute paths for public files, since pages live at depth', () => {
    // A page at /work/ would resolve "./grant.webp" to /work/grant.webp.
    expect(profile.resumeHref.startsWith('/')).toBe(true);
    expect(profile.photo.startsWith('/')).toBe(true);
  });

  it('gives every project a substantial hard part', () => {
    for (const project of projects) {
      expect(project.hardPart.title.length, project.navName).toBeGreaterThan(10);
      expect(project.hardPart.body.length, project.navName).toBeGreaterThan(200);
    }
  });

  it('describes every project with detail, concrete work, and a stack', () => {
    for (const project of projects) {
      expect(project.detail.length, `${project.navName} has no detail`).toBeGreaterThan(0);
      expect(project.built.length, `${project.navName} lists no work`).toBeGreaterThan(2);
      expect(project.stack.length).toBeGreaterThan(2);
    }
  });

  it('names projects by what they are, not only by the client', () => {
    const scheduling = projects.find((p) => p.id === 'scheduling-system');
    expect(scheduling?.name.toLowerCase()).toContain('scheduling');
  });

  /*
   * Claims most likely to drift back into something an interviewer could
   * catch. Each of these failed an earlier draft of this site.
   */
  describe('honesty guards', () => {
    it('does not claim the automation pipeline is running against live accounts', () => {
      const pipeline = projects.find((p) => p.id === 'automation-pipeline');
      const copy = [pipeline?.scale, ...(pipeline?.detail ?? [])].join(' ').toLowerCase();
      expect(copy).toMatch(/fixture/);
      expect(copy).toMatch(/sandbox/);
      expect(copy).toMatch(/not live accounts yet|have not been pointed at|not yet been cut over/);
      expect(copy).not.toMatch(/\bin use at\b|\bin production\b/);
    });

    it('does not claim the scheduling system already replaced Sling', () => {
      const scheduling = projects.find((p) => p.id === 'scheduling-system');
      const copy = [scheduling?.summary, ...(scheduling?.detail ?? [])].join(' ');
      expect(copy).not.toMatch(/\breplaced Sling\b/);
      expect(copy).toMatch(/built to replace/);
    });

    it('does not overstate how many migrations on trauma.repair were mine', () => {
      const trauma = projects.find((p) => p.id === 'trauma-repair');
      const line = trauma?.built.find((b) => b.toLowerCase().includes('migration'));
      expect(line).toMatch(/seven of/i);
    });

    it('links every smaller project except the coursework ones', () => {
      const unlinked = smallerProjects.filter((p) => !p.href).map((p) => p.name);
      expect(unlinked).toEqual(['AlgorithmLib', 'Concurrency coursework']);
    });

    it('claims no language I cannot show code for', () => {
      // Every .java file on this machine belongs to a vendored IDE.
      expect(skills.flatMap((g) => g.items.map((i) => i.name))).not.toContain('Java');
    });
  });

  it('cites a place of use for every claimed skill', () => {
    for (const group of skills) {
      for (const item of group.items) {
        expect(item.where.trim(), `${item.name} claims no evidence`).not.toBe('');
      }
    }
  });

  it('does not position me as a web developer only', () => {
    const groups = skills.map((g) => g.group.toLowerCase());
    expect(groups).not.toContain('frontend');
    expect(groups).toContain('computer science');

    for (const lang of ['Python', 'C#', 'SQL']) {
      expect(headlineStack, `${lang} should be on the home page`).toContain(lang);
    }
    expect(headlineStack.indexOf('React')).toBeGreaterThan(headlineStack.indexOf('Python'));
  });

  it('opens the way a portfolio does, with a name and a person behind it', () => {
    expect(profile.intro).toMatch(/^I’m Grant/);
    expect(profile.intro2).toMatch(/Outside of work/);
  });

  it('shows rather than claims the soft traits', () => {
    const copy = [profile.intro, profile.intro2, profile.seeking].join(' ').toLowerCase();
    for (const cliche of [
      'passionate',
      'self-starter',
      'team player',
      'hard worker',
      'detail-oriented',
      'fast learner',
      'lifelong learning',
    ]) {
      expect(copy, `"${cliche}" is filler`).not.toContain(cliche);
    }
    expect(profile.intro2).toMatch(/picking up something/);
  });

  it('keeps the home page to three quick facts', () => {
    expect(quickFacts).toHaveLength(3);
  });

  it('lists experience newest first', () => {
    expect(jobs[0].period).toContain('Present');
  });

  it('has something to say about working on a team', () => {
    expect(howIWork.length).toBeGreaterThan(3);
    for (const practice of howIWork) {
      expect(practice.body.length).toBeGreaterThan(80);
    }
  });

  it('keeps coursework on the education record', () => {
    expect(education.coursework.length).toBeGreaterThan(4);
  });
});

/* Things every page has to get right, checked on all three. */
describe.each([
  ['Home', Home, 'home'],
  ['Work', WorkPage, 'work'],
  ['About', AboutPage, 'about'],
] as const)('%s page', (_name, Page, id) => {
  it('has exactly one h1', () => {
    render(<Page />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('has a main landmark reachable by a skip link', () => {
    render(<Page />);
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main');
    expect(screen.getByRole('link', { name: /skip to content/i })).toHaveAttribute('href', '#main');
  });

  it('marks itself as the current page in the nav', () => {
    const { container } = render(<Page />);
    const current = container.querySelectorAll('.header__link[aria-current="page"]');
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveAttribute('href', PAGES.find((p) => p.id === id)!.href);
  });

  it('links to every other page, so no page is a dead end', () => {
    const { container } = render(<Page />);
    for (const page of PAGES) {
      expect(container.querySelector(`a[href="${page.href}"]`), page.label).not.toBeNull();
    }
  });

  it('offers a way to get in touch without leaving the page', () => {
    const { container } = render(<Page />);
    expect(container.querySelector(`a[href="mailto:${profile.email}"]`)).not.toBeNull();
  });

  it('opens external links safely', () => {
    const { container } = render(<Page />);
    const external = container.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]');
    expect(external.length).toBeGreaterThan(0);
    external.forEach((link) => expect(link.rel).toContain('noopener'));
  });

  it('toggles the theme', async () => {
    const user = userEvent.setup();
    render(<Page />);
    const before = document.documentElement.dataset.theme;
    await user.click(screen.getByRole('button', { name: /switch to .* theme/i }));
    expect(document.documentElement.dataset.theme).not.toBe(before);
  });
});

describe('Home page', () => {
  it('uses my name as its h1', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(profile.name);
  });

  it('stays a summary — no project bodies, no skills grid, no experience', () => {
    const { container } = render(<Home />);
    expect(container.querySelectorAll('.hard')).toHaveLength(0);
    expect(container.querySelectorAll('.skill-col')).toHaveLength(0);
    expect(container.querySelectorAll('.entry')).toHaveLength(0);
    expect(container.querySelectorAll('.diagram')).toHaveLength(0);
  });

  it('names every project once, each linking through to its detail', () => {
    const { container } = render(<Home />);
    const briefs = container.querySelectorAll('.brief');
    expect(briefs).toHaveLength(projects.length);
    projects.forEach((project, i) => {
      expect(briefs[i]).toHaveAttribute('href', `/work/#${project.id}`);
      expect(within(briefs[i] as HTMLElement).getByText(project.name)).toBeInTheDocument();
    });
  });

  it('states availability where a recruiter sees it first', () => {
    const { container } = render(<Home />);
    expect(container.querySelector('.landing__status')?.textContent).toMatch(
      /open to software engineering roles/i,
    );
  });

  it('offers the résumé for download', () => {
    render(<Home />);
    const links = screen.getAllByRole('link', { name: /résumé/i });
    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => expect(link).toHaveAttribute('download'));
  });
});

describe('Work page', () => {
  it('carries every project, anchored so the home page can link into it', () => {
    const { container } = render(<WorkPage />);
    for (const project of projects) {
      expect(container.querySelector(`#${project.id}`), project.navName).not.toBeNull();
    }
  });

  it('shows each hard part without needing a click', () => {
    const { container } = render(<WorkPage />);
    expect(container.querySelectorAll('details')).toHaveLength(0);
    expect(container.querySelectorAll('.hard__tag')).toHaveLength(projects.length);
    for (const project of projects) {
      expect(screen.getByText(project.hardPart.body)).toBeVisible();
    }
  });
});

describe('About page', () => {
  it('carries the skills, the practices, and the history', () => {
    const { container } = render(<AboutPage />);
    expect(container.querySelectorAll('.skill-col')).toHaveLength(skills.length);
    expect(container.querySelectorAll('.practice')).toHaveLength(howIWork.length);
    expect(container.querySelectorAll('.entry').length).toBeGreaterThanOrEqual(jobs.length);
  });
});
