import { useEffect, useMemo, useRef, useState } from 'react';

import { companion } from '../../companion/store';
import { codingLines } from '../../data/lines';
import { projects } from '../../data/portfolio';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import type { Theme } from '../../hooks/useTheme';
import { useWorldPalette } from '../../hooks/useWorldPalette';
import { PALETTE, autoSprite } from '../../sprites/poses';
import DialogueBox from '../DialogueBox';
import GhGlyph from '../GhGlyph';
import PixelSprite from '../PixelSprite';
import MobileProjects from './MobileProjects';
import { paintWorld } from './drawWorld';
import { facingFor, progressNearest, sampleRoute, smoothPath } from './pathData';
import { buildSegments, rawForStop, sampleSegments } from './routeMapping';
import {
  MAP_H,
  MAP_SCALE,
  MAP_W,
  districtById,
  districts,
  lake,
  routePoints,
  trafficRoutes,
} from './worldData';

const WORLD_W = MAP_W * MAP_SCALE;
const WORLD_H = MAP_H * MAP_SCALE;
const SECTION_VH = 860;

const ROUTE_D = smoothPath(routePoints);

const scalePath = (pts: readonly (readonly [number, number])[]) =>
  smoothPath(pts.map(([x, y]) => [x * MAP_SCALE, y * MAP_SCALE]) as [number, number][]);

/**
 * Whether to show the simple card list instead of the walkable map.
 *
 * The map itself is width-independent — the camera's zoom floor keeps every
 * element the same on-screen size no matter how narrow the stage gets, it
 * just pans further to compensate — so portrait phones get the real
 * walkable map too. The one case with no fix but more room is a phone
 * rotated to landscape: short enough that the sticky stage has almost
 * nothing to work with under the section heading. Gate that on a coarse
 * (touch) pointer so a desktop user with a short browser window still gets
 * the interactive map, since they can just resize it.
 */
function computeNarrow(): boolean {
  if (typeof window === 'undefined') return false;
  const coarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  return coarsePointer && window.innerHeight < 500;
}

interface Props {
  theme: Theme;
}

export default function ProjectMap({ theme }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  const reduced = useReducedMotion();
  const palette = useWorldPalette(theme);
  const progress = useScrollProgress(sectionRef, { ease: reduced ? 1 : 0.13 });

  const [narrow, setNarrow] = useState(computeNarrow);
  const [stageSize, setStageSize] = useState({ w: 900, h: 640 });
  const [stops, setStops] = useState<number[]>([]);

  /* ---------------------------------------------------------------- layout */

  useEffect(() => {
    const onResize = () => setNarrow(computeNarrow());
    // 'resize' alone misses a phone rotating with no width change to the
    // outer window in some browsers; 'orientationchange' catches that.
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setStageSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [narrow]);

  /* ------------------------------------------------------------ map canvas */

  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host || narrow) return;
    const canvas = paintWorld(palette, theme === 'night');
    canvas.className = 'map__canvas';
    canvas.style.width = `${WORLD_W}px`;
    canvas.style.height = `${WORLD_H}px`;
    host.replaceChildren(canvas);
  }, [palette, theme, narrow]);

  /* ------------------------------------------------------- project stops */

  useEffect(() => {
    const path = pathRef.current;
    if (!path || narrow) return;
    setStops(
      projects.map((p) => {
        const d = districtById[p.location];
        return d ? progressNearest(path, d.at) : 0.5;
      }),
    );
  }, [narrow]);

  const segments = useMemo(() => buildSegments(stops), [stops]);
  const sample = useMemo(() => sampleSegments(segments, progress), [segments, progress]);

  const [pos, setPos] = useState({ x: routePoints[0][0], y: routePoints[0][1], dx: 0, dy: 1 });

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    setPos(sampleRoute(path, sample.route));
  }, [sample.route]);

  const atStop = sample.stop;
  const activeProject = atStop === null ? null : projects[atStop];

  // Geometric, not progress-range based: he is "swimming" whenever his actual
  // map position falls inside the lake's ellipse, however the route curve
  // happens to cross it. Robust against any path-authoring drift.
  const swimming =
    ((pos.x - lake.at[0]) / lake.rx) ** 2 + ((pos.y - lake.at[1]) / lake.ry) ** 2 < 1;

  /* --------------------------------------------------------------- camera */

  const zoom = Math.min(1.6, Math.max(0.55, stageSize.w / WORLD_W));
  const charX = pos.x * MAP_SCALE * zoom;
  const charY = pos.y * MAP_SCALE * zoom;
  const scaledW = WORLD_W * zoom;
  const scaledH = WORLD_H * zoom;

  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
  const camX =
    scaledW <= stageSize.w
      ? (stageSize.w - scaledW) / 2
      : clamp(stageSize.w / 2 - charX, stageSize.w - scaledW, 0);
  const camY =
    scaledH <= stageSize.h
      ? (stageSize.h - scaledH) / 2
      : clamp(stageSize.h * 0.44 - charY, stageSize.h - scaledH, 0);

  const { facing, flip } = facingFor(pos.dx, pos.dy);

  /* ----------------------------------------- hand the character to the map */

  // Read via a ref inside the rAF loop below rather than as effect deps —
  // these change on nearly every scroll frame, and putting them in the deps
  // array tore the effect down and rebuilt it just as often. Each teardown's
  // cleanup called `companion.setAnchor(null)` synchronously, which snapped
  // the companion back toward its off-map resting spot at the left edge for
  // a frame before the next publish restored it, reading as a constant pull
  // to the left while scrolling.
  const latest = useRef({ camX, camY, charX, charY, facing, flip, zoom, swimming, atStop });
  latest.current = { camX, camY, charX, charY, facing, flip, zoom, swimming, atStop };

  useEffect(() => {
    if (narrow) return;
    const stage = stageRef.current;
    if (!stage) return;

    let raf = 0;
    const publish = () => {
      const rect = stage.getBoundingClientRect();
      // Only drive him while the sticky stage is genuinely on screen; outside
      // that range the page takes him back to the edge on its own.
      const onScreen = rect.top < window.innerHeight * 0.7 && rect.bottom > 140;
      if (!onScreen) {
        companion.setAnchor(null);
      } else {
        const l = latest.current;
        companion.setAnchor({
          x: rect.left + l.camX + l.charX,
          y: rect.top + l.camY + l.charY,
          facing: l.facing,
          flip: l.flip,
          scale: Math.max(2, Math.round(3 * l.zoom)),
          swimming: l.swimming,
          stop: l.atStop,
        });
      }
      raf = requestAnimationFrame(publish);
    };

    raf = requestAnimationFrame(publish);
    return () => {
      cancelAnimationFrame(raf);
      companion.setAnchor(null);
    };
  }, [narrow]);

  const jumpToStop = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: el.offsetTop + rawForStop(segments, i) * travel,
      behavior: reduced ? 'auto' : 'smooth',
    });
  };

  const here =
    activeProject?.location ??
    districts.reduce(
      (best, d) => {
        const dist = (d.at[0] - pos.x) ** 2 + (d.at[1] - pos.y) ** 2;
        return dist < best.d ? { id: d.id, d: dist } : best;
      },
      { id: districts[0].id, d: Infinity },
    ).id;

  if (narrow) {
    return (
      <section className="section" id="projects" ref={sectionRef}>
        <div className="section__inner">
          <div className="section__head reveal">
            <span className="mono-label">Stage 05</span>
            <h2>The long way round</h2>
            <p>
              Six projects, spread across a made-up city. On a wider screen the map opens up and
              you can walk it yourself.
            </p>
          </div>
          <MobileProjects />
        </div>
      </section>
    );
  }

  return (
    <section
      className="section section--map"
      id="projects"
      ref={sectionRef}
      style={{ height: `${SECTION_VH}vh` }}
    >
      <div className="map__sticky">
        <div className="map__head">
          <span className="mono-label">Stage 05 — Projects</span>
          <h2>The long way round</h2>
        </div>

        <div className="map__stage pixel-frame scanlines" ref={stageRef}>
          <div
            className="map__camera"
            style={{
              width: WORLD_W,
              height: WORLD_H,
              transform: `translate3d(${camX}px, ${camY}px, 0) scale(${zoom})`,
            }}
          >
            <div
              className="map__layer"
              style={{ width: WORLD_W, height: WORLD_H }}
              ref={canvasHostRef}
            />

            <svg
              className="map__route"
              width={WORLD_W}
              height={WORLD_H}
              viewBox={`0 0 ${MAP_W} ${MAP_H}`}
              aria-hidden="true"
            >
              <path className="map__route-casing" d={ROUTE_D} />
              <path className="map__route-line" d={ROUTE_D} ref={pathRef} />
            </svg>

            {!reduced &&
              trafficRoutes.map((route, i) => (
                <span
                  key={i}
                  className="map__auto"
                  style={
                    {
                      offsetPath: `path('${scalePath(route)}')`,
                      animationDuration: `${26 + i * 7}s`,
                      animationDelay: `${i * -6}s`,
                    } as React.CSSProperties
                  }
                >
                  <PixelSprite grid={autoSprite} palette={PALETTE} scale={2} />
                </span>
              ))}

            <span
              className="map__water-label"
              style={{ left: lake.at[0] * MAP_SCALE, top: lake.at[1] * MAP_SCALE }}
            >
              THE CROSSING
            </span>

            {districts.map((d) => (
              <span
                key={d.id}
                className={`map__locality map__locality--${d.labelSide ?? 'right'} ${
                  here === d.id ? 'is-here' : ''
                }`}
                style={{ left: d.at[0] * MAP_SCALE, top: d.at[1] * MAP_SCALE }}
              >
                {d.label}
              </span>
            ))}

            {projects.map((p, i) => {
              const d = districtById[p.location];
              if (!d) return null;
              return (
                <button
                  key={p.id}
                  type="button"
                  className={`map__pin ${atStop === i ? 'is-active' : ''}`}
                  style={{ left: d.at[0] * MAP_SCALE, top: d.at[1] * MAP_SCALE }}
                  onClick={() => jumpToStop(i)}
                >
                  <span className="map__pin-head">{i + 1}</span>
                  <span className="map__pin-label">{p.sign}</span>
                </button>
              );
            })}
          </div>

          <div className="map__hud">
            <span className="map__hud-loc">
              <span className="map__hud-dot" />
              {districtById[here]?.label ?? 'SOMEWHERE'}
            </span>
            <span className="map__hud-state">
              {swimming ? 'SWIMMING' : atStop !== null ? 'WORKING' : 'ON THE ROAD'}
            </span>
          </div>

          <div className="map__rail" aria-hidden="true">
            {projects.map((p, i) => (
              <span key={p.id} className={`map__rail-dot ${atStop === i ? 'is-active' : ''}`} />
            ))}
            <span className="map__rail-fill" style={{ height: `${sample.route * 100}%` }} />
          </div>

          <div className={`map__talk ${activeProject ? 'is-open' : ''}`}>
            {activeProject && (
              <DialogueBox
                speaker={`${activeProject.title} · ${activeProject.year}`}
                lines={activeProject.dialogue}
                active
                key={activeProject.id}
              >
                <p className="dialogue__blurb">{activeProject.blurb}</p>
                <div className="dialogue__row">
                  <span className="chip-row">
                    {activeProject.stack.map((s) => (
                      <span key={s} className="chip">
                        {s}
                      </span>
                    ))}
                  </span>
                  <span className="dialogue__links">
                    {activeProject.github && (
                      <a
                        className="gh-link"
                        href={activeProject.github}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <GhGlyph />
                        <span>Repo</span>
                      </a>
                    )}
                    {activeProject.links.map((l) => (
                      <a key={l.label} className="pixel-btn pixel-btn--sm" href={l.href}>
                        {l.label}
                      </a>
                    ))}
                  </span>
                </div>
                <span className="dialogue__typing">
                  {codingLines[(atStop ?? 0) % codingLines.length]}
                </span>
              </DialogueBox>
            )}
          </div>
        </div>

        <p className="map__hint">
          Keep scrolling to walk. Stop anywhere for a dance. Click a pin to jump.
        </p>
      </div>
    </section>
  );
}
