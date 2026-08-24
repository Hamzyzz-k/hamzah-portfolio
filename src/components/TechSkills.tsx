import { useState } from 'react';

import { techSkills } from '../data/portfolio';
import { useSound } from '../hooks/useSound';

/** Inventory grid — item slots with a detail card for whatever is selected. */
export default function TechSkills() {
  const [active, setActive] = useState(0);
  const { play } = useSound();
  const skill = techSkills[active];

  return (
    <section className="section section--skills grid-bg" id="skills">
      <div className="section__inner">
        <div className="section__head reveal">
          <span className="mono-label">Stage 03</span>
          <h2>Inventory</h2>
          <p>Everything currently in the bag. Hover or tap a slot.</p>
        </div>

        <div className="inv reveal">
          <ul className="inv__grid" role="listbox" aria-label="Tech skills">
            {techSkills.map((s, i) => (
              <li key={s.name}>
                <button
                  type="button"
                  role="option"
                  aria-selected={i === active}
                  className={`inv__slot ${i === active ? 'is-active' : ''}`}
                  onMouseEnter={() => {
                    setActive(i);
                    play('hover');
                  }}
                  onFocus={() => setActive(i)}
                  onClick={() => {
                    setActive(i);
                    play('select');
                  }}
                >
                  <span className="inv__glyph">{s.glyph}</span>
                  <span className="inv__lvl">{Math.round(s.level / 10)}</span>
                  <span className="sr-only">{s.name}</span>
                </button>
              </li>
            ))}
          </ul>

          <aside className="inv__detail pixel-frame" aria-live="polite">
            <span className="inv__detail-glyph">{skill.glyph}</span>
            <h3>{skill.name}</h3>
            <p>{skill.note}</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
