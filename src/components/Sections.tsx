import { education, howIWork, jobs, profile, skills, socials } from '../content/profile';
import { projects, smallerProjects } from '../content/projects';
import { CodeBlock } from './CodeBlock';
import { Diagram } from './Diagrams';

/** The one <h1> on a sub-page, so each document has exactly one. */
export function PageHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede: string;
}) {
  return (
    <header className="page-head">
      <div className="shell">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{lede}</p>
      </div>
    </header>
  );
}

export function Work() {
  return (
    <section className="section section--flush" id="work" aria-label="Projects">
      <div className="shell">
        {projects.map((project) => {
          /* The running thing goes next to the title. Source and anything
             else is reference material and stays in the sidebar. */
          const live = project.links.find((link) => link.live);
          const otherLinks = project.links.filter((link) => !link.live);

          return (
            <article className="project" id={project.id} key={project.id}>
              <header className="project__head">
                <p className="project__meta">
                  <strong>{project.context}</strong>
                  <span>{project.period}</span>
                </p>

                <h3>{project.name}</h3>
                <p className="project__summary">{project.summary}</p>

                {/* Rendered once, placed twice: beside the title on a wide
                    screen, below the summary once the header collapses to one
                    column. DOM order is what narrow screens follow. */}
                {live && (
                  <a
                    className="btn btn--primary project__live"
                    href={live.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {live.label}
                    <span className="btn__hint" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                )}

                <p className="project__scale">{project.scale}</p>
              </header>

              <div className="project__body">
                <div className="project__main">
                  {project.detail.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}

                  <div style={{ marginTop: '1.75rem' }}>
                    <h4 className="block-title">What I built</h4>
                    <ul className="did-list">
                      {project.built.map((item) => (
                        <li key={item.slice(0, 40)}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <aside className="project__aside">
                  {project.diagram && <Diagram id={project.diagram} />}

                  <div>
                    <h4 className="block-title">Stack</h4>
                    <ul className="tag-row">
                      {project.stack.map((tech) => (
                        <li className="tag" key={tech}>
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {otherLinks.length > 0 && (
                    <div className="btn-row">
                      {otherLinks.map((link) => (
                        <a
                          key={link.href}
                          className="btn"
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.label}
                          <span className="btn__hint">{link.hint}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </aside>
              </div>

              <div className="hard">
                <div className="hard__head">
                  <span className="hard__tag">The hard part</span>
                  <h4>{project.hardPart.title}</h4>
                </div>
                <div className="hard__body">
                  <p>{project.hardPart.body}</p>
                  {project.hardPart.code && (
                    <CodeBlock
                      language={project.hardPart.code.language}
                      caption={project.hardPart.code.caption}
                      source={project.hardPart.code.source}
                    />
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function SmallerWork() {
  return (
    <section className="section" id="other" aria-labelledby="other-h">
      <div className="shell">
        <div className="section-head">
          <p className="eyebrow">Also built</p>
          <h2 id="other-h">Smaller projects</h2>
        </div>

        <ul className="small-grid">
          {smallerProjects.map((item) => (
            <li key={item.name}>
              <span className="small-grid__name">
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    {item.name} ↗
                  </a>
                ) : (
                  item.name
                )}
              </span>
              <p>{item.blurb}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Skills() {
  return (
    <section className="section" id="skills" aria-labelledby="skills-h">
      <div className="shell">
        <div className="section-head">
          <p className="eyebrow">Stack</p>
          <h2 id="skills-h">What I work with</h2>
          <p>Every line says where I actually used it, so you can check it against the projects.</p>
        </div>

        <div className="skill-grid">
          {skills.map((group) => (
            <div className="skill-col" key={group.group}>
              <h3>{group.group}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item.name}>
                    <span className="skill-name">{item.name}</span>
                    <span className="skill-where">{item.where}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowIWork() {
  return (
    <section className="section" id="how-i-work" aria-labelledby="how-h">
      <div className="shell">
        <div className="section-head">
          <p className="eyebrow">On a team</p>
          <h2 id="how-h">How I work</h2>
          <p>The part a portfolio usually skips. What I am like to work alongside.</p>
        </div>

        <div className="practice-list">
          {howIWork.map((practice) => (
            <div className="practice" key={practice.title}>
              <h3>{practice.title}</h3>
              <p>{practice.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Background() {
  return (
    <section className="section" id="background" aria-labelledby="bg-h">
      <div className="shell">
        <div className="section-head">
          <p className="eyebrow">Background</p>
          <h2 id="bg-h">Experience and education</h2>
        </div>

        <div className="two-col">
          <div>
            {jobs.map((job) => (
              <div className="entry" key={`${job.org}-${job.role}`}>
                <div className="entry__head">
                  <h3>{job.role}</h3>
                  <span className="entry__when">{job.period}</span>
                </div>
                <p className="entry__org">
                  {job.org} · {job.location}
                </p>
                <ul className="did-list">
                  {job.points.map((point) => (
                    <li key={point.slice(0, 30)}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="edu-card">
            <div>
              <h3>{education.degree}</h3>
              <p className="edu-card__school">{education.school}</p>
              <p className="edu-card__when">{education.period}</p>
            </div>

            <ul className="did-list">
              {education.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div>
              <h4 className="block-title">Coursework</h4>
              <ul className="tag-row">
                {education.coursework.map((course) => (
                  <li className="tag" key={course}>
                    {course}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section className="section" id="contact" aria-labelledby="contact-h">
      <div className="shell">
        <div className="contact">
          <h2 id="contact-h">Get in touch</h2>
          <p>
            If anything here raised a question, I am happy to answer it. Email is the surest way to
            reach me and I answer everything.
          </p>

          <div className="btn-row">
            <a className="btn btn--primary" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <a className="btn" href={profile.resumeHref} download>
              Download résumé
            </a>
          </div>

          <ul className="contact__lines">
            <li>{profile.phone}</li>
            <li>{profile.location}, open to remote or relocation</li>
            {socials.map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label} — {link.hint}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <nav className="footer__links" aria-label="Elsewhere">
          {socials.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label}
            </a>
          ))}
          <a href={`mailto:${profile.email}`}>Email</a>
          <a href={profile.resumeHref} download>
            Résumé
          </a>
        </nav>
      </div>
    </footer>
  );
}
