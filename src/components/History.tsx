import { history } from '../data/portfolio';

/**
 * Education as an ancient record — a weathered scroll rather than another
 * card grid, so school/PUC/university reads as a different kind of section
 * from the Quest Log further down.
 */
export default function History() {
  return (
    <section className="section section--history" id="history">
      <div className="section__inner">
        <div className="section__head reveal">
          <span className="mono-label">A record, recovered</span>
          <h2>The Old Chronicle</h2>
          <p>Carved before the projects. Read top to bottom, like everything old.</p>
        </div>

        <div className="scroll reveal">
          <div className="scroll__cap scroll__cap--top" aria-hidden="true" />
          <ol className="scroll__body">
            {history.map((h, i) => (
              <li key={h.year} className={`scroll__entry ${h.status}`}>
                <span className="scroll__seal">{i + 1}</span>
                <div className="scroll__text">
                  <div className="scroll__row">
                    <h3>{h.title}</h3>
                    <span className="scroll__year">{h.year}</span>
                  </div>
                  <p className="scroll__place">{h.place}</p>
                  <p className="scroll__detail">{h.detail}</p>
                  <span className="scroll__grade">
                    {h.status === 'current' ? 'IN PROGRESS' : 'ACHIEVED'} — {h.grade}
                  </span>
                </div>
              </li>
            ))}
          </ol>
          <div className="scroll__cap scroll__cap--bottom" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
