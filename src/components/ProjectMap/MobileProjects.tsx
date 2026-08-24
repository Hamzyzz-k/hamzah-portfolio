import { projects } from '../../data/portfolio';
import GhGlyph from '../GhGlyph';
import { districtById } from './worldData';

/**
 * Narrow-screen fallback for the map.
 *
 * The map needs room to pan; on a phone it would be a postage stamp. Same
 * content, same dialogue lines, laid out as cards — nothing is lost but the
 * walking.
 */
export default function MobileProjects() {
  return (
    <ol className="mproj">
      {projects.map((p, i) => (
        <li key={p.id} className="mproj__item pixel-frame reveal">
          <header className="mproj__head">
            <span className="mproj__num">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h3>{p.title}</h3>
              <span className="mproj__where">
                {districtById[p.location]?.label ?? 'SOMEWHERE'} · {p.year}
              </span>
            </div>
          </header>

          <p className="mproj__say">&ldquo;{p.dialogue[0]}&rdquo;</p>
          <p>{p.blurb}</p>

          <div className="chip-row">
            {p.stack.map((s) => (
              <span key={s} className="chip">
                {s}
              </span>
            ))}
          </div>

          <div className="mproj__links">
            {p.github && (
              <a className="gh-link" href={p.github} target="_blank" rel="noreferrer">
                <GhGlyph />
                <span>Repo</span>
              </a>
            )}
            {p.links.map((l) => (
              <a key={l.label} className="pixel-btn pixel-btn--sm" href={l.href}>
                {l.label}
              </a>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}
