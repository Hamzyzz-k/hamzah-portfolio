import { profile } from '../data/portfolio';

/**
 * Ground strip closing out the page. No sprite of its own — the one character
 * on the page is already walking past here via the companion.
 */
export default function Footer() {
  return (
    <footer className="foot">
      <div className="foot__ground" aria-hidden="true" />
      <div className="foot__text">
        <p>{profile.name} — built with React, a canvas, and far too many individual pixels.</p>
      </div>
    </footer>
  );
}
