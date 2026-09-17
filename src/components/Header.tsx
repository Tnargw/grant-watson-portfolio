import { useEffect, useState } from 'react';
import { profile } from '../content/profile';

export const PAGES = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'work', label: 'Work', href: '/work/' },
  { id: 'about', label: 'About', href: '/about/' },
] as const;

export type PageId = (typeof PAGES)[number]['id'];

type Props = {
  current: PageId;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
};

export function Header({ current, theme, onToggleTheme }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="header" data-scrolled={scrolled}>
      <div className="shell header__inner">
        <a className="header__mark" href="/">
          {profile.name}
          <span>SWE</span>
        </a>

        <nav className="header__nav" aria-label="Pages">
          {PAGES.map((page) => (
            <a
              key={page.id}
              className="header__link"
              href={page.href}
              /* aria-current="page" is the correct value for navigation
                 between documents, unlike the "true" used for in-page anchors. */
              aria-current={current === page.id ? 'page' : undefined}
            >
              {page.label}
            </a>
          ))}
        </nav>

        <div className="header__tools">
          <button
            type="button"
            className="icon-btn"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          <a className="btn btn--primary" href={profile.resumeHref} download>
            Résumé
          </a>
        </div>
      </div>
    </header>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 14.2A8.2 8.2 0 1 1 9.8 4a6.6 6.6 0 0 0 10.2 10.2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
