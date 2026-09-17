import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { projects, smallerProjects } from '../content/projects';
import { education, howIWork, jobs, profile, quickFacts, skills, socials } from '../content/profile';
import { SECTIONS } from '../components/Header';

describe('content', () => {
  it('gives every project a unique id, which the nav anchors rely on', () => {
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

  it('keeps the résumé and photo site-relative so they work off the domain root', () => {
    expect(profile.resumeHref.startsWith('./')).toBe(true);
    expect(profile.photo.startsWith('./')).toBe(true);
  });

  it('gives every project a substantial hard part — that is the point of the page', () => {
    for (const project of projects) {
      expect(project.hardPart.title.length, `${project.navName}`).toBeGreaterThan(10);
      expect(project.hardPart.body.length, `${project.navName}`).toBeGreaterThan(200);
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
    // "Rec Services" means nothing to an outside reader; the title has to say
    // what was built.
    const scheduling = projects.find((p) => p.id === 'scheduling-system');
    expect(scheduling?.name.toLowerCase()).toContain('scheduling');
  });

  /*
   * These guard the claims most likely to drift back into something an
   * interviewer could catch. Each one failed an earlier draft of this site.
   */
  describe('honesty guards', () => {
    it('does not claim the automation pipeline is running against live accounts', () => {
      const pipeline = projects.find((p) => p.id === 'automation-pipeline');
      const copy = [pipeline?.scale, ...(pipeline?.detail ?? [])].join(' ').toLowerCase();
      // It runs on generated fixtures against developer sandboxes, and the
      // copy has to say so rather than implying a live rollout.
      expect(copy).toMatch(/fixture/);
      expect(copy).toMatch(/sandbox/);
      expect(copy).toMatch(/not live accounts yet|have not been pointed at|not yet been cut over/);
      expect(copy).not.toMatch(/\bin use at\b|\bin production\b/);
    });

    it('does not claim the scheduling system already replaced Sling', () => {
      const scheduling = projects.find((p) => p.id === 'scheduling-system');
      const copy = [scheduling?.summary, ...(scheduling?.detail ?? [])].join(' ');
      // "built to replace" states the goal; "replaced" would state an outcome
      // that did not happen during my time on it.
      expect(copy).not.toMatch(/\breplaced Sling\b/);
      expect(copy).toMatch(/built to replace/);
    });

    it('does not overstate how many migrations on trauma.repair were mine', () => {
      const trauma = projects.find((p) => p.id === 'trauma-repair');
      const migrationLine = trauma?.built.find((b) => b.toLowerCase().includes('migration'));
      expect(migrationLine).toBeDefined();
      expect(migrationLine).toMatch(/seven of/i);
    });

    it('links every smaller project except the one that is coursework', () => {
      const unlinked = smallerProjects.filter((p) => !p.href);
      expect(unlinked.map((p) => p.name)).toEqual(['AlgorithmLib']);
    });

    it('keeps the smaller-project list to work worth showing', () => {
      // A tutorial-tier clone drags the average down on a page whose other
      // entries are a production platform and an edge API.
      expect(smallerProjects.map((p) => p.name)).not.toContain('Hoppy Frog');
      expect(smallerProjects.length).toBeLessThanOrEqual(5);
    });
  });

  it('cites a place of use for every claimed skill', () => {
    for (const group of skills) {
      for (const item of group.items) {
        expect(item.where.trim(), `${item.name} claims no evidence`).not.toBe('');
      }
    }
  });

  it('leads on capability rather than on the degree', () => {
    expect(profile.intro.toLowerCase()).not.toContain('degree');
    expect(profile.intro.toLowerCase()).not.toContain('graduat');
  });

  it('keeps the landing to three quick facts', () => {
    expect(quickFacts).toHaveLength(3);
  });

  it('lists experience newest first', () => {
    expect(jobs[0].period).toContain('Present');
  });

  it('keeps a nav entry for every section it advertises', () => {
    expect(SECTIONS.length).toBeGreaterThan(2);
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

describe('App', () => {
  it('renders one h1 and a main landmark reachable by the skip link', () => {
    render(<App />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main');
    expect(screen.getByRole('link', { name: /skip to content/i })).toHaveAttribute('href', '#main');
  });

  it('renders a section for every project, anchored by its id', () => {
    const { container } = render(<App />);
    for (const project of projects) {
      expect(container.querySelector(`#${project.id}`), `${project.navName}`).not.toBeNull();
    }
  });

  it('renders every nav target', () => {
    const { container } = render(<App />);
    for (const section of SECTIONS) {
      expect(container.querySelector(`#${section.id}`), section.id).not.toBeNull();
    }
  });

  it('shows the hard part without needing a click', () => {
    const { container } = render(<App />);
    // No <details>: the most interview-relevant content must not be collapsed.
    expect(container.querySelectorAll('details')).toHaveLength(0);
    // Matched on the element, not on the phrase — the phrase also occurs in
    // ordinary prose on the page.
    expect(container.querySelectorAll('.hard__tag')).toHaveLength(projects.length);

    for (const project of projects) {
      expect(screen.getByText(project.hardPart.title), project.navName).toBeVisible();
      expect(screen.getByText(project.hardPart.body)).toBeVisible();
    }
  });

  it('states availability where a recruiter sees it first', () => {
    render(<App />);
    expect(screen.getByText(/open to software engineering roles/i)).toBeInTheDocument();
  });

  it('keeps the landing short — no projects or skills grid above the fold', () => {
    const { container } = render(<App />);
    const landing = container.querySelector('#top');
    expect(landing).not.toBeNull();
    // The landing is a summary. The moment it starts carrying project bodies
    // or the full skills grid, it has stopped being a landing.
    expect(landing!.querySelectorAll('.project')).toHaveLength(0);
    expect(landing!.querySelectorAll('.skill-col')).toHaveLength(0);
    expect(landing!.querySelectorAll('.hard')).toHaveLength(0);
    expect(landing!.querySelectorAll('p').length).toBeLessThanOrEqual(6);
    // And it points onward.
    expect(container.querySelector('.scroll-cue')).not.toBeNull();
  });

  it('offers the résumé for download', () => {
    render(<App />);
    const links = screen.getAllByRole('link', { name: /résumé/i });
    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => expect(link).toHaveAttribute('download'));
  });

  it('opens every external link safely', () => {
    const { container } = render(<App />);
    const external = container.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]');
    expect(external.length).toBeGreaterThan(0);
    external.forEach((link) => expect(link.rel).toContain('noopener'));
  });

  it('toggles the theme', async () => {
    const user = userEvent.setup();
    render(<App />);
    const before = document.documentElement.dataset.theme;
    await user.click(screen.getByRole('button', { name: /switch to .* theme/i }));
    expect(document.documentElement.dataset.theme).not.toBe(before);
  });
});
