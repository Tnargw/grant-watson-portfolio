import { useEffect, useState } from 'react';

/**
 * Highlights the nav link for whichever section currently owns the viewport.
 *
 * Uses one IntersectionObserver over all sections rather than a scroll
 * listener: the browser does the maths off the main thread, and there is no
 * per-frame work to throttle. The top margin matches the sticky header so a
 * section counts as active only once it clears it.
 */
export function useScrollSpy(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        }

        // Of everything on screen, the one showing the most wins.
        let best: string | null = null;
        let bestRatio = 0;
        for (const [id, ratio] of visible) {
          if (ratio >= bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        }
        if (best) setActive(best);
      },
      { rootMargin: '-72px 0px -55% 0px', threshold: [0, 0.15, 0.4, 0.75, 1] },
    );

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
