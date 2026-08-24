import { useEffect, useRef, useState } from 'react';

import { profile } from '../data/portfolio';

/** RPG stat card. Bars fill once, the first time the card is on screen. */
export default function CharacterSheet() {
  const ref = useRef<HTMLDivElement>(null);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setFilled(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="section section--about" id="about">
      <div className="section__inner">
        <div className="section__head reveal">
          <span className="mono-label">Stage 02</span>
          <h2>Character sheet</h2>
          <p>The stats are made up. The habits behind them are not.</p>
        </div>

        <div className="sheet" ref={ref}>
          <article className="sheet__card pixel-frame reveal">
            <header className="sheet__card-head">
              <img src="/sprites/avatar-64.png" width={64} height={64} alt="" />
              <div>
                <h3>{profile.name}</h3>
                <span className="mono-label">{profile.klass}</span>
                <p className="sheet__where">{profile.location}</p>
              </div>
            </header>

            <ul className="sheet__stats">
              {profile.stats.map((s) => (
                <li key={s.label}>
                  <span className="sheet__stat-label">{s.label}</span>
                  <span className="bar">
                    <span
                      className="bar__fill"
                      style={{
                        width: filled ? `${s.value}%` : 0,
                        background: s.color,
                      }}
                    />
                  </span>
                  <span className="sheet__stat-num">{s.value}</span>
                </li>
              ))}
            </ul>
          </article>

          <div className="sheet__side">
            <article className="sheet__bio pixel-frame pixel-frame--inset reveal">
              {profile.bio.map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
              <a className="pixel-btn" href={profile.resumeHref} download="Hamzah_K_Resume.pdf">
                ▼ Résumé drop
              </a>
            </article>

            <article className="sheet__gear pixel-frame reveal">
              <h4 className="mono-label">Equipped</h4>
              <dl>
                {profile.equipped.map((e) => (
                  <div key={e.slot}>
                    <dt>{e.slot}</dt>
                    <dd>{e.item}</dd>
                  </div>
                ))}
              </dl>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
