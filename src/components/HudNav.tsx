import { useEffect, useState } from 'react';

import { companion } from '../companion/store';
import { hudQuips } from '../data/lines';
import { profile, sections } from '../data/portfolio';
import { useMusic } from '../hooks/useMusic';
import { useSound } from '../hooks/useSound';
import type { Theme } from '../hooks/useTheme';

interface Props {
  theme: Theme;
  onToggleTheme: () => void;
}

/**
 * Fixed game HUD: name plate, section jumps, day/night, mute. The page's scroll
 * position runs along the bottom edge as an XP bar.
 */
export default function HudNav({ theme, onToggleTheme }: Props) {
  const { enabled, toggle, play } = useSound();
  const { enabled: musicOn, toggle: toggleMusic } = useMusic();
  const [pct, setPct] = useState(0);
  const [active, setActive] = useState(sections[0].id);
  const [quip, setQuip] = useState(hudQuips[0]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      setPct(max > 0 ? (window.scrollY / max) * 100 : 0);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const id = window.setInterval(
      () => setQuip(hudQuips[Math.floor(Math.random() * hudQuips.length)]),
      9000,
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <header className="hud">
      <a className="hud__brand" href="#hero">
        <span className="hud__brand-name">{profile.name}</span>
        <span className="hud__brand-quip">{quip}</span>
      </a>

      <button
        type="button"
        className="hud__burger pixel-btn pixel-btn--ghost"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? 'CLOSE' : 'MENU'}
      </button>

      <nav className={`hud__nav ${open ? 'is-open' : ''}`} aria-label="Sections">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={active === s.id ? 'is-active' : ''}
            onClick={() => {
              play('select');
              setOpen(false);
              // A hash jump can land well under the fast-scroll speed
              // threshold, so the arrival reaction is forced rather than
              // inferred from scroll velocity.
              companion.triggerArrival();
            }}
            onMouseEnter={() => play('hover')}
          >
            {s.label}
          </a>
        ))}
      </nav>

      <div className="hud__tools">
        <span className="hud__tip-wrap">
          <button
            type="button"
            className="hud__icon"
            onClick={() => {
              play('toggle');
              onToggleTheme();
            }}
            aria-label={theme === 'night' ? 'Switch to day' : 'Switch to night'}
          >
            {theme === 'night' ? '☼' : '☾'}
          </button>
          <span className="hud__tip" role="status">
            {theme === 'night' ? 'click for day >>' : 'click for night >>'}
          </span>
        </span>
        <button
          type="button"
          className={`hud__icon ${musicOn ? 'is-on' : ''}`}
          onClick={toggleMusic}
          aria-pressed={musicOn}
          aria-label={musicOn ? 'Turn off music' : 'Turn on music'}
          title={musicOn ? 'Music on' : 'Music off'}
        >
          ♪
        </button>
        <button
          type="button"
          className={`hud__icon ${enabled ? 'is-on' : ''}`}
          onClick={toggle}
          aria-pressed={enabled}
          aria-label={enabled ? 'Mute sound effects' : 'Enable sound effects'}
          title={enabled ? 'SFX on' : 'SFX off'}
        >
          {enabled ? '♫' : '✕'}
        </button>
      </div>

      <span className="hud__xp" style={{ width: `${pct}%` }} aria-hidden="true" />
    </header>
  );
}
