import { useState } from 'react';

import { hobbies } from '../data/portfolio';
import { useSound } from '../hooks/useSound';

/** A row of arcade cabinets. Clicking one flips it to the description. */
export default function Hobbies() {
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const { play } = useSound();

  const toggle = (i: number) => {
    play('select');
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <section className="section section--hobbies" id="hobbies">
      <div className="section__inner">
        <div className="section__head reveal">
          <span className="mono-label">Stage 07</span>
          <h2>The arcade</h2>
          <p>What happens when the editor is closed. Click a cabinet.</p>
        </div>

        <ul className="arcade">
          {hobbies.map((h, i) => (
            <li key={h.name} className="reveal">
              <button
                type="button"
                className={`cab ${flipped.has(i) ? 'is-flipped' : ''}`}
                onClick={() => toggle(i)}
                onMouseEnter={() => play('hover')}
                aria-expanded={flipped.has(i)}
              >
                <span className="cab__inner">
                  <span className="cab__face cab__face--front">
                    <span className="cab__screen">
                      <span className="cab__glyph">{h.glyph}</span>
                      <span className="cab__scan" />
                    </span>
                    <span className="cab__panel">
                      <span className="cab__stick" />
                      <span className="cab__btn" />
                      <span className="cab__btn cab__btn--2" />
                    </span>
                    <span className="cab__name">{h.name}</span>
                  </span>
                  <span className="cab__face cab__face--back">
                    <span className="cab__back-title">{h.name}</span>
                    <span className="cab__back-text">{h.detail}</span>
                    <span className="cab__back-hint">click to close</span>
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
