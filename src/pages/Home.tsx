import { Header } from '../components/Header';
import { Contact, Footer } from '../components/Sections';
import { headlineStack, profile, quickFacts, socials } from '../content/profile';
import { projects } from '../content/projects';
import { useTheme } from '../hooks/useTheme';

/**
 * The front page, kept to what a résumé fits on its first screen: who I am,
 * what I work with, what I have built, and how to reach me. Every project and
 * every section that needs more than a line lives on its own page, one click
 * away, because someone skimming should not have to scroll past six thousand
 * words to find my email.
 */
export default function Home() {
  const { theme, toggle } = useTheme();

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Header current="home" theme={theme} onToggleTheme={toggle} />

      <main id="main">
        <section className="landing" id="top">
          <div className="landing__grid" aria-hidden="true" />

          <div className="shell">
            <div className="landing__inner">
              <div>
                <p className="landing__status">
                  <span className="landing__dot" aria-hidden="true" />
                  Open to software engineering roles
                </p>

                <h1>{profile.name}</h1>

                <p className="landing__intro">{profile.intro}</p>
                <p className="landing__intro landing__intro--sub">{profile.intro2}</p>
                <p className="landing__seeking">{profile.seeking}</p>

                <div className="btn-row landing__actions">
                  <a className="btn btn--primary" href="/work/">
                    See my work
                  </a>
                  <a className="btn" href={profile.resumeHref} download>
                    Résumé
                  </a>
                  <a className="btn" href={`mailto:${profile.email}`}>
                    Email
                  </a>
                  {socials.map((link) => (
                    <a
                      key={link.label}
                      className="btn btn--ghost"
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              <img
                className="landing__portrait"
                src={profile.photo}
                alt={profile.name}
                width="176"
                height="176"
                loading="eager"
                decoding="async"
              />
            </div>

            <div className="landing__facts">
              <dl>
                {quickFacts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>

              <ul className="tag-row landing__stack" aria-label="Main technologies">
                {headlineStack.map((tech) => (
                  <li className="tag" key={tech}>
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* One line per project. The details are a click away, not a scroll. */}
        <section className="section" id="work-summary" aria-labelledby="ws-h">
          <div className="shell">
            <div className="section-head">
              <p className="eyebrow">Selected work</p>
              <h2 id="ws-h">What I have built</h2>
            </div>

            <ul className="brief-list">
              {projects.map((project) => (
                <li key={project.id}>
                  <a className="brief" href={`/work/#${project.id}`}>
                    <span className="brief__name">{project.name}</span>
                    <span className="brief__summary">{project.summary}</span>
                    <span className="brief__meta">
                      {project.context} · {project.period}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="btn-row" style={{ marginTop: '1.75rem' }}>
              <a className="btn" href="/work/">
                Read the details
              </a>
              <a className="btn btn--ghost" href="/about/">
                Skills, experience and how I work
              </a>
            </div>
          </div>
        </section>

        <Contact />
      </main>

      <Footer />
    </>
  );
}
