import { useEffect, useRef, useState } from 'react';

import { companion } from '../companion/store';
import { hoverGithub, hoverLinkedin, hoverPhone, pick, pickRizz } from '../data/lines';
import { phoneDisplay, profile, socials } from '../data/portfolio';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useSound } from '../hooks/useSound';
import {
  PALETTE,
  codeCycle,
  linkedinCycle,
  phoneCycle,
  rizzCycle,
} from '../sprites/poses';
import CopyButton from './CopyButton';
import DialogueBox from './DialogueBox';
import GhGlyph from './GhGlyph';
import PixelSprite from './PixelSprite';

const MAILTO = socials.find((s) => s.id === 'email')?.href ?? 'mailto:you@example.com';

/** Strips the protocol/trailing slash so the URL reads like a handle, not a link. */
function displayUrl(href: string | undefined): string {
  if (!href) return '';
  return href.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

type Reaction = 'phone' | 'github' | 'linkedin' | null;

const REACTION_CYCLE = {
  phone: phoneCycle,
  github: codeCycle,
  linkedin: linkedinCycle,
} as const;

const REACTION_LINES = {
  phone: hoverPhone,
  github: hoverGithub,
  linkedin: hoverLinkedin,
} as const;

const TACKINESS_LABEL: Record<1 | 2 | 3, string> = {
  1: 'MILD',
  2: 'MEDIUM',
  3: 'MAXIMUM',
};

/**
 * Contact, with the character in full rizz mode: shades, chain, finger guns,
 * one terrible line at a time. Hovering a link pulls him out of it — he takes
 * a call, opens the laptop, or straightens his tie, and says something about
 * it.
 *
 * The global companion is hidden while this section is on screen so there is
 * only ever one of him.
 */
export default function Contact() {
  const reduced = useReducedMotion();
  const { play } = useSound();
  const sectionRef = useRef<HTMLElement>(null);

  const [frame, setFrame] = useState(0);
  const [tackiness, setTackiness] = useState<1 | 2 | 3>(2);
  const [line, setLine] = useState(() => pickRizz(2));
  const [reaction, setReaction] = useState<Reaction>(null);
  const [reactionLine, setReactionLine] = useState('');
  const [phoneShown, setPhoneShown] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  /* Only one character on screen at a time. */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => companion.setHidden(e.isIntersecting),
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      companion.setHidden(false);
    };
  }, []);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setFrame((f) => f + 1), 240);
    return () => window.clearInterval(id);
  }, [reduced]);

  useEffect(() => {
    if (reduced || reaction) return;
    const id = window.setInterval(() => setLine((l) => pickRizz(tackiness, l)), 6200);
    return () => window.clearInterval(id);
  }, [reduced, reaction, tackiness]);

  // Changing the slider swaps the line in immediately, at the new tier.
  const onTackiness = (level: 1 | 2 | 3) => {
    setTackiness(level);
    setLine((l) => pickRizz(level, l));
    play('hover');
  };

  const startReaction = (kind: Exclude<Reaction, null>) => {
    setReaction(kind);
    setReactionLine(pick(REACTION_LINES[kind]));
    if (kind === 'phone') setPhoneShown(true);
    play('hover');
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    play('select');

    const plain = `${form.message}\n\n— ${form.name}\n${form.email}`;
    const subject = encodeURIComponent(`Hello from ${form.name || 'someone on your site'}`);
    const body = encodeURIComponent(plain);

    // mailto: only does anything if the browser has a default mail app
    // registered — with none set, the assignment below is a silent no-op.
    // Copying the message is the fallback: it works regardless, so the
    // message is never just lost because nothing opened.
    navigator.clipboard?.writeText(plain).catch(() => {});
    setSent(true);
    window.location.href = `${MAILTO}?subject=${subject}&body=${body}`;
  };

  const cycle = reaction ? REACTION_CYCLE[reaction] : rizzCycle;
  const grid = cycle[frame % cycle.length];
  const spoken = reaction ? reactionLine : line;

  const social = (id: string) => socials.find((s) => s.id === id);

  return (
    <section className="section section--contact" id="contact" ref={sectionRef}>
      <div className="section__inner">
        <div className="section__head reveal">
          <span className="mono-label">Final stage</span>
          <h2>Say something back</h2>
          <p>He has been practising this part all the way down the page.</p>
        </div>

        <div className="rizz">
          <div className="rizz__stage pixel-frame scanlines">
            <div className="rizz__floor" aria-hidden="true" />
            {!reduced && !reaction && (
              <div className="fx fx--hearts" aria-hidden="true">
                {Array.from({ length: 7 }, (_, i) => (
                  <span key={i} style={{ '--i': i } as React.CSSProperties}>
                    ♥
                  </span>
                ))}
              </div>
            )}

            <div className="rizz__actor-wrap">
              <div className="rizz__actor">
                <PixelSprite
                  grid={grid}
                  palette={PALETTE}
                  scale={6}
                  alt={`${profile.name}, mid pick-up line`}
                />
              </div>
            </div>

            {/* The box sits below him in the flow, so it can never cover him. */}
            <div className="rizz__talk">
              <DialogueBox speaker="HAMZAH ✧" lines={[spoken]} key={spoken} speed={22} />
              <button
                type="button"
                className="pixel-btn pixel-btn--sm rizz__more"
                onClick={() => {
                  play('open');
                  setReaction(null);
                  setLine((l) => pickRizz(tackiness, l));
                }}
              >
                ▸ another one
              </button>
            </div>

            <div className="rizz__meter">
              <div className="rizz__meter-head">
                <span className="mono-label">Rizz meter</span>
                <span className="rizz__meter-level">{TACKINESS_LABEL[tackiness]}</span>
              </div>
              <input
                type="range"
                className="rizz__slider"
                min={1}
                max={3}
                step={1}
                value={tackiness}
                onChange={(e) => onTackiness(Number(e.target.value) as 1 | 2 | 3)}
                aria-label="Adjust how tacky the lines get"
              />
              <div className="rizz__meter-scale">
                <span>mild</span>
                <span>medium</span>
                <span>maximum</span>
              </div>
            </div>
          </div>

          <div className="rizz__side">
            <ul className="reach">
              <li className="reach__item">
                <a
                  className="reach__row"
                  href={social('github')?.href}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => startReaction('github')}
                  onFocus={() => startReaction('github')}
                  onMouseLeave={() => setReaction(null)}
                  onBlur={() => setReaction(null)}
                >
                  <span className="reach__icon">
                    <GhGlyph size={18} />
                  </span>
                  <span className="reach__body">
                    <span className="reach__label">GitHub</span>
                    <span className="reach__value">{displayUrl(social('github')?.href)}</span>
                  </span>
                </a>
                <CopyButton value={social('github')?.href ?? ''} label="GitHub URL" />
              </li>

              <li className="reach__item">
                <a
                  className="reach__row"
                  href={social('linkedin')?.href}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => startReaction('linkedin')}
                  onFocus={() => startReaction('linkedin')}
                  onMouseLeave={() => setReaction(null)}
                  onBlur={() => setReaction(null)}
                >
                  <span className="reach__icon reach__icon--text">in</span>
                  <span className="reach__body">
                    <span className="reach__label">LinkedIn</span>
                    <span className="reach__value">{displayUrl(social('linkedin')?.href)}</span>
                  </span>
                </a>
                <CopyButton value={social('linkedin')?.href ?? ''} label="LinkedIn URL" />
              </li>

              <li className="reach__item">
                <a
                  className="reach__row"
                  href={social('phone')?.href}
                  onMouseEnter={() => startReaction('phone')}
                  onFocus={() => startReaction('phone')}
                  onMouseLeave={() => setReaction(null)}
                  onBlur={() => setReaction(null)}
                >
                  <span className="reach__icon reach__icon--text">☎</span>
                  <span className="reach__body">
                    <span className="reach__label">Phone</span>
                    <span className={`reach__value ${phoneShown ? 'is-shown' : ''}`}>
                      {phoneShown ? phoneDisplay : 'hover to pick up'}
                    </span>
                  </span>
                </a>
                <CopyButton value={phoneDisplay} label="phone number" />
              </li>

              <li className="reach__item">
                <a className="reach__row" href={MAILTO}>
                  <span className="reach__icon reach__icon--text">@</span>
                  <span className="reach__body">
                    <span className="reach__label">Email</span>
                    <span className="reach__value">{MAILTO.replace('mailto:', '')}</span>
                  </span>
                </a>
                <CopyButton value={MAILTO.replace('mailto:', '')} label="email address" />
              </li>
            </ul>

            <form className="rizz__form pixel-frame" onSubmit={submit}>
              <h3 className="mono-label">Your move</h3>

              <label>
                <span>Name</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="who is this"
                  required
                />
              </label>

              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="where do I reply"
                  required
                />
              </label>

              <label>
                <span>Message</span>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="say anything, I have low standards for inbound"
                  required
                />
              </label>

              <button className="pixel-btn" type="submit">
                ▶ Send it
              </button>
              <p className="rizz__note">
                {sent ? (
                  <>
                    Message copied to your clipboard, and your mail app should have opened with it
                    ready to send. If nothing opened —{' '}
                    <a href={MAILTO}>your browser has no default mail app registered</a> — just
                    paste it into an email to {MAILTO.replace('mailto:', '')}.
                  </>
                ) : (
                  <>
                    Tries to open your mail app with this filled in. No mail app set as default?
                    The message gets copied to your clipboard as a fallback either way — nothing is
                    stored here.
                  </>
                )}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
