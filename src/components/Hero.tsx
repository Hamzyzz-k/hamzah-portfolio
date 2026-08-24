import { useMemo } from 'react';

import { profile } from '../data/portfolio';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { Theme } from '../hooks/useTheme';
import { useTypewriter } from '../hooks/useTypewriter';
import { PALETTE, moonSprite, sunSprite } from '../sprites/poses';
import PixelSprite from './PixelSprite';

/** Deterministic star field, so it does not reshuffle on every render. */
function useStars(count: number) {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const a = Math.sin(i * 12.9898) * 43758.5453;
        const b = Math.sin(i * 78.233) * 12345.6789;
        return {
          left: `${(a - Math.floor(a)) * 100}%`,
          top: `${(b - Math.floor(b)) * 62}%`,
          delay: `${((a - Math.floor(a)) * 4).toFixed(2)}s`,
          size: i % 7 === 0 ? 4 : 2,
        };
      }),
    [count],
  );
}

/** Fixed skyline: deterministic heights beat a gradient you have to guess at. */
const buildings = Array.from({ length: 26 }, (_, i) => {
  const n = Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.9));
  return {
    w: 24 + Math.round(n * 30),
    h: 26 + Math.round(n * 68),
    lit: i % 3 === 0 ? 1 : 0.45,
  };
});

export default function Hero({ theme }: { theme: Theme }) {
  const reduced = useReducedMotion();
  const { text, done } = useTypewriter([profile.tagline], true, 32);
  const stars = useStars(70);

  return (
    <section className="hero" id="hero">
      <div className="hero__sky" aria-hidden="true">
        {stars.map((s, i) => (
          <span
            key={i}
            className="hero__star"
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              animationDelay: s.delay,
            }}
          />
        ))}
        <span className="hero__orb">
          <PixelSprite
            grid={theme === 'night' ? moonSprite : sunSprite}
            palette={PALETTE}
            scale={7}
          />
        </span>
        <span className="hero__cloud hero__cloud--1" />
        <span className="hero__cloud hero__cloud--2" />
        <span className="hero__cloud hero__cloud--3" />
        <span className="hero__skyline">
          {buildings.map((b, i) => (
            <span
              key={i}
              className="hero__building"
              style={{ height: b.h, width: b.w, '--lit': b.lit } as React.CSSProperties}
            />
          ))}
        </span>
        <span className="hero__hill hero__hill--far" />
        <span className="hero__hill hero__hill--near" />
      </div>

      <div className="hero__inner">
        <div className="hero__portrait pixel-frame">
          <img
            src="/sprites/avatar-64.png"
            width={64}
            height={64}
            alt={`Pixel portrait of ${profile.name}`}
          />
          <span className="hero__portrait-tag">P1</span>
        </div>

        <div className="hero__copy">
          <span className="mono-label">{profile.klass}</span>
          <h1>{profile.name}</h1>
          <p className="hero__title">{profile.title}</p>
          <p className="hero__tagline">
            {text}
            {!done && <span className="dialogue__caret" />}
          </p>

          <div className="hero__meta">
            <span className="chip">📍 {profile.location}</span>
            <span className="chip">{profile.handle}</span>
          </div>

          <div className="hero__cta">
            <a className="pixel-btn" href="#projects">
              Start the run
            </a>
            <a className="pixel-btn pixel-btn--ghost" href="#contact">
              Say hello
            </a>
          </div>
        </div>
      </div>

      {!reduced && (
        <a className="hero__scroll" href="#about" aria-label="Scroll down">
          <span>SCROLL</span>
          <span className="hero__scroll-arrow" />
        </a>
      )}
    </section>
  );
}
