/* ---------------------------------------------------------------------------
   One character, shared by the whole page.

   The companion walks down the side of the page as you scroll, and when the
   map section takes over it publishes an anchor here so the same sprite walks
   the route instead. Nothing else on the page owns a character — that is what
   keeps it feeling like one person rather than several copies.
--------------------------------------------------------------------------- */

export type Pose =
  | 'walk'
  | 'idle'
  | 'dance'
  | 'code'
  | 'swim'
  | 'tired'
  | 'wipe'
  | 'phone'
  | 'linkedin'
  | 'github';

export type Facing = 'front' | 'back' | 'side';

export interface MapAnchor {
  /** Viewport coordinates, in CSS pixels. */
  x: number;
  y: number;
  facing: Facing;
  flip: boolean;
  scale: number;
  /** True while the route is crossing open water. */
  swimming: boolean;
  /** Index of the project he is parked at, or null while travelling. */
  stop: number | null;
}

export interface CompanionState {
  /** Set by the map while it is on screen; null means the page drives him. */
  anchor: MapAnchor | null;
  /** A temporary pose triggered by hovering a link. Scrolling clears it. */
  action: { pose: Pose; line: string } | null;
  /** Hidden during the boot screen and wherever he would be in the way. */
  hidden: boolean;
  /**
   * Bumped whenever a nav jump should force a tired/wipe reaction, regardless
   * of how fast the actual scroll turned out to be — a hash jump can land
   * instantly, well under the natural fast-scroll speed threshold.
   */
  arrival: number;
}

const state: CompanionState = { anchor: null, action: null, hidden: false, arrival: 0 };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((fn) => fn());
}

export const companion = {
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  getSnapshot(): CompanionState {
    return state;
  },

  setAnchor(anchor: MapAnchor | null) {
    // Reference equality is enough here: the map builds a fresh object each
    // frame it is active, and passes null exactly once on the way out.
    if (state.anchor === null && anchor === null) return;
    state.anchor = anchor;
    emit();
  },

  /** Start a hover reaction. Ignored while the map is driving. */
  setAction(pose: Pose, line: string) {
    if (state.action?.pose === pose && state.action.line === line) return;
    state.action = { pose, line };
    emit();
  },

  clearAction(pose?: Pose) {
    if (!state.action) return;
    if (pose && state.action.pose !== pose) return;
    state.action = null;
    emit();
  },

  setHidden(hidden: boolean) {
    if (state.hidden === hidden) return;
    state.hidden = hidden;
    emit();
  },

  /** Call after teleporting the page (a nav-bar jump) to force the arrival reaction. */
  triggerArrival() {
    state.arrival += 1;
    emit();
  },
};
