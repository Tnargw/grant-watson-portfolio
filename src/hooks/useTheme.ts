import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'gw-portfolio-theme';

/**
 * Reads the stored preference, falling back to the OS.
 *
 * `localStorage` can throw outright — private windows, blocked site data — so
 * every access is guarded and the site simply follows the OS if it fails.
 */
function readStored(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

function systemTheme(): Theme {
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

/**
 * Prefers, in order: the viewer's stored choice, whatever already painted the
 * page, then the OS.
 *
 * The middle case matters. The inline script in `index.html` stamps the root
 * element before first paint to avoid a flash; reading that back means React
 * adopts the theme already on screen instead of briefly disagreeing with it.
 * It also means a host that stamps its own theme is respected on arrival.
 */
function initialTheme(): Theme {
  const stored = readStored();
  if (stored) return stored;

  const stamped = document.documentElement.dataset.theme;
  if (stamped === 'light' || stamped === 'dark') return stamped;

  return systemTheme();
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  /** True until the viewer picks a theme; while true we keep tracking the OS. */
  const [followsSystem, setFollowsSystem] = useState(() => readStored() === null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (!followsSystem) return;
    const query = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (event: MediaQueryListEvent) => setTheme(event.matches ? 'light' : 'dark');
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [followsSystem]);

  const toggle = useCallback(() => {
    setFollowsSystem(false);
    setTheme((current) => {
      const next: Theme = current === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // A viewer who cannot persist the choice still gets it for this visit.
      }
      return next;
    });
  }, []);

  return { theme, toggle };
}
