import { achievements, guilds } from '../data/portfolio';

// A plain string index breaks on multi-code-unit emoji (⚔ and 🛡 are
// surrogate pairs) — an array keeps each crest intact.
const CRESTS = ['⚑', '⚔️', '🛡️', '✦'];

/**
 * Leadership and co-curricular roles, framed as guild memberships, plus
 * certifications as unlocked achievements — a distinct section from the
 * Quest Log (that one is paid work; this one runs alongside it).
 */
export default function Guilds() {
  return (
    <section className="section section--guilds" id="guilds">
      <div className="section__inner">
        <div className="section__head reveal">
          <span className="mono-label">Side quests</span>
          <h2>Guilds & achievements</h2>
          <p>Run alongside everything else — leadership, outreach, and the badges that came with it.</p>
        </div>

        <ul className="guild-list">
          {guilds.map((g, i) => (
            <li key={g.name} className="guild-card pixel-frame reveal">
              <span className="guild-card__crest" aria-hidden="true">
                {CRESTS[i % CRESTS.length]}
              </span>
              <div className="guild-card__body">
                <div className="guild-card__row">
                  <h3>{g.name}</h3>
                  <span className="guild-card__period">{g.period}</span>
                </div>
                <p className="guild-card__org">
                  {g.org} · {g.role}
                </p>
                <p className="guild-card__detail">{g.detail}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="achievements reveal">
          <h3 className="mono-label">Achievements unlocked</h3>
          <ul className="achievements__list">
            {achievements.map((a) => (
              <li key={a.title} className="achievement">
                <span className="achievement__badge" aria-hidden="true">
                  ★
                </span>
                <div className="achievement__body">
                  <span className="achievement__title">{a.title}</span>
                  <span className="achievement__meta">
                    {a.issuer} · {a.year}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
