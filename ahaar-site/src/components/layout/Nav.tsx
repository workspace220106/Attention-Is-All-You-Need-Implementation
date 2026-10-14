import { useEffect, useState } from 'react';
import { IconMoon, IconSun } from '../ui/icons';
import { copy } from '../../content/copy';

export function Nav() {
  const [hidden, setHidden] = useState(false);
  const [dark, setDark] = useState<boolean>(() =>
    typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark',
  );

  // Hide on scroll down, show on scroll up.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < 6) return;
      setHidden(y > lastY && y > 80);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? 'dark' : 'light';
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-transform duration-700 ease-soft ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div className="mx-auto max-w-[1360px] px-6 md:px-10 h-16 flex items-center justify-between">
        <a href="#top" className="font-display text-xl tracking-[0.18em] text-ink">
          {copy.brand}
        </a>
        <nav aria-label="Primary" className="hidden md:flex items-center gap-8 text-[0.9rem] text-muted">
          {copy.nav.map((n, i) => (
            <a key={n} href={`#sec-${i + 1}`} className="hover:text-ink transition-colors duration-500 ease-soft">
              {n}
            </a>
          ))}
        </nav>
        <button
          onClick={toggleTheme}
          aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
          className="w-10 h-10 rounded-full border border-ink/15 flex items-center justify-center text-ink hover:bg-surface transition-colors duration-500 ease-soft"
        >
          {dark ? <IconSun width="18" height="18" /> : <IconMoon width="18" height="18" />}
        </button>
      </div>
    </header>
  );
}
