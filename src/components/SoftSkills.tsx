import { useEffect, useRef, useState } from 'react';

import { interests, softSkills } from '../data/portfolio';

/** Status-effect panel: the soft skills as buffs, plus a tag cloud of interests. */
export default function SoftSkills() {
  const ref = useRef<HTMLUListElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="section section--traits" id="traits">
      <div className="section__inner">
        <div className="section__head reveal">
          <span className="mono-label">Stage 04</span>
          <h2>Active buffs</h2>
          <p>The parts that do not fit in a tech stack list.</p>
        </div>

        <ul className="buffs" ref={ref}>
          {softSkills.map((s, i) => (
            <li key={s.name} className="buffs__item pixel-frame reveal">
              <span className="buffs__rune" aria-hidden="true">
                {'✦✧✶✷✸✹'[i % 6]}
              </span>
              <div className="buffs__body">
                <h3>{s.name}</h3>
                <p>{s.effect}</p>
                <span className="bar">
                  <span
                    className="bar__fill"
                    style={{
                      width: on ? `${s.level}%` : 0,
                      transitionDelay: `${i * 90}ms`,
                    }}
                  />
                </span>
              </div>
              <span className="buffs__lvl">{s.level}</span>
            </li>
          ))}
        </ul>

        <div className="traits__interests reveal">
          <h4 className="mono-label">Currently curious about</h4>
          <div className="chip-row">
            {interests.map((t) => (
              <span key={t} className="chip chip--lg">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
