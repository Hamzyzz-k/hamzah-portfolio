import { quests } from '../data/portfolio';

/** Experience and education as a quest log. */
export default function QuestLog() {
  return (
    <section className="section section--quests" id="quests">
      <div className="section__inner">
        <div className="section__head reveal">
          <span className="mono-label">Stage 06</span>
          <h2>Quest log</h2>
          <p>Where the hours actually went.</p>
        </div>

        <ol className="quests">
          {quests.map((q) => (
            <li key={q.title} className="quests__item reveal">
              <span className={`quests__marker quests__marker--${q.status}`} aria-hidden="true" />
              <article className="quests__card pixel-frame">
                <header>
                  <h3>{q.title}</h3>
                  <span className={`stamp stamp--${q.status}`}>
                    {q.status === 'complete' ? 'COMPLETE' : 'IN PROGRESS'}
                  </span>
                </header>
                <p className="quests__org">
                  {q.org} · {q.period}
                </p>
                <p>{q.detail}</p>
                <div className="chip-row">
                  {q.rewards.map((r) => (
                    <span key={r} className="chip chip--reward">
                      + {r}
                    </span>
                  ))}
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
