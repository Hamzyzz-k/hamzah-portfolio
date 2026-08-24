/* ===========================================================================
   ALL THE CHARACTER'S DIALOGUE, IN ONE PLACE, FOR YOU TO REVIEW.

   Nothing here is load-bearing — every line is flavour text. Delete anything
   you do not like, rewrite anything that does not sound like you, and add your
   own. The site picks randomly from each list, so the more lines in a list,
   the longer it takes before a visitor sees a repeat.

   Lists in this file:
     danceLines      said while dancing, when you stop scrolling mid-road
     walkLines        occasional chatter while he is actively walking the map
     codingLines     the little status line while he is at the laptop
     swimLines       said while swimming across the lake on the map
     tiredLines      said when you scroll too fast and he runs out of breath
     restLines       said as he catches his breath afterwards
     greetLines      said on the way down the page, between sections
     rizzLines       the contact section. shameless on purpose
     hoverPhone      when you hover the phone number
     hoverGithub     when you hover the GitHub link
     hoverLinkedin   when you hover the LinkedIn link
     hudQuips        the small rotating line under your name in the top bar
     bootLines       the fake boot sequence on first load
     codeConfetti    characters that fly out of the laptop. not sentences
=========================================================================== */

/** Dancing — when the user stops scrolling on open road. */
export const danceLines = [
  'Stopped scrolling? Cool. This is just my walking style.',
  'No music playing. Never needed any.',
  'Do not scroll. I am peaking right now.',
  'I have exactly one move and you are seeing all of it.',
  'My knees will bill me for this later.',
  'Somewhere a recruiter is watching this. Worth it.',
  'This is my cardio. Do not tell my doctor.',
  'I choreographed this in the shower.',
  'Please clap.',
  'Two left feet, both of them confident.',
  'The floor is lava and I am winning.',
  'Warning: contains moves not approved by anyone.',
  'I peaked in a school annual day and never recovered.',
  'You scroll, I walk. You stop, I go off. Fair deal.',
  'This move does not have a name. It has consequences.',
  'I am contractually one move deep and committed.',
  'Judges are not present. Lucky for me.',
  'Somebody start the countdown. Any second now.',
  'This is rehearsed. Badly, but rehearsed.',
  'Statistically, someone out there thinks this is cool.',
  'The road can wait ten more seconds.',
  'I would explain the choreography but there is none.',
  'Every scroll-stop is a stage. This is my stage.',
  'Do not encourage me. It only gets worse.',
  'I saved this one specifically for you.',
  'This counts as exercise. I have decided.',
  'One day I will learn a second move.',
];

/**
 * Occasional chatter while he is actively walking the map — shown sparsely so
 * it reads as commentary, not narration of every step.
 */
export const walkLines = [
  'Nice road. No idea where it actually goes.',
  'Halfway there. Probably. Nobody measured it.',
  'Good pace. I could keep this up for hours. Please do not test that.',
  'The map is not to scale. Neither am I, honestly.',
  'Somewhere behind me is a project I am proud of.',
  'This road has more turns than my actual career did.',
  'I drew every building on this street myself.',
  'This street does not exist anywhere but here.',
];

/** The status line while he is sat at the laptop at a project stop. */
export const codingLines = [
  'one sec, fixing a semicolon',
  'it worked on my machine, I swear',
  'npm install... praying',
  'this bug is a feature actually',
  'writing the commit message is the hard part',
  'git push --force, no witnesses',
  'stack overflow is down, we improvise',
  'ship it, we will document later',
  'renaming a variable for the ninth time',
  'the tests pass. I am as surprised as you',
  'refactoring something nobody asked me to',
  'this loop looked simpler in my head',
  'reading my own code like it is a stranger',
  'adding a comment that just says // why',
  'three tabs of documentation, zero answers',
  'blaming the compiler. it was me',
];

/** Swimming across the lake on the map. */
export const swimLines = [
  'The road just ends here. Nobody warned me.',
  'This was not on the itinerary.',
  'Laptop is in a ziplock. Priorities.',
  'I can swim. Badly, but I can.',
  'Shortcut. Definitely a shortcut.',
  'Do not tell my mother about this.',
  'Water is cold. Commitment is warm.',
  'The map said fifteen minutes. The map lied.',
];

/** Scrolled too fast — he cannot keep up. */
export const tiredLines = [
  'slow down pls',
  'ok that is too fast',
  'my legs. please.',
  'I am not a cheetah',
  'give me a second',
  'you scroll like you are being chased',
  'easy, easy',
  'I have a whole career to show you',
  'this is a marathon not a sprint',
  'wait for me',
];

/** Catching his breath once the scrolling stops. */
export const restLines = [
  'ok. ok. I am fine.',
  'just... one moment.',
  'that was a lot of pixels.',
  'right. where were we.',
  'I should have stretched first.',
  'not out of shape. the page is just long.',
];

/** Occasional lines while walking the page between sections. */
export const greetLines = [
  'Keep going, the good part is the map.',
  'Mind the gap between sections.',
  'You are further than most people get.',
  'This is a lot of scrolling for a CV, I know.',
  'I built all of this instead of sleeping.',
  'Still with me? Nice.',
  'Almost at the interesting bit.',
];

/**
 * The contact section. Deliberately terrible, and deliberately adjustable —
 * the rizz meter is a real slider that picks from one of these three tiers.
 * Level 1 is barely a pun, level 3 is unforgivable. Reorder or rewrite freely,
 * just keep roughly the same count in each tier.
 */
export const rizzLines: { text: string; level: 1 | 2 | 3 }[] = [
  // level 1 — mild. Could say this to a coworker without consequences.
  { text: 'You had me at hello world.', level: 1 },
  { text: 'Are you CSS? Because you make everything look better.', level: 1 },
  { text: 'I would never git ignore you.', level: 1 },
  { text: 'You must be a good commit message, because you explain everything.', level: 1 },
  { text: 'You had me at the first render.', level: 1 },
  { text: 'I do not need dark mode, you already light up the room.', level: 1 },
  { text: 'Is this a form? Because I am ready to commit.', level: 1 },
  { text: 'You are the only exception I do not want to catch.', level: 1 },

  // level 2 — medium. Getting a little much.
  { text: 'Are you a semicolon? Because you complete me.', level: 2 },
  { text: 'Is your name Wi-Fi? Because I am feeling a connection.', level: 2 },
  { text: 'You must be a 200 OK, because you are exactly the response I wanted.', level: 2 },
  { text: 'Call me a null pointer, because I am nothing without you.', level: 2 },
  { text: 'If you were a function, I would call you every day.', level: 2 },
  { text: 'You must be recursion, because I keep coming back.', level: 2 },
  { text: 'I would refactor my whole life for you.', level: 2 },
  { text: 'Are you a cache? Because I would hit you every single time.', level: 2 },
  { text: 'You are the only dependency I would never want to update away.', level: 2 },
  { text: 'They call it a pull request. I am just asking you to pull up.', level: 2 },

  // level 3 — maximum. No survivors.
  { text: 'I have 99 problems and every one of them is you being this far away.', level: 3 },
  { text: 'My heart has a memory leak and it is all your fault.', level: 3 },
  {
    text: 'Are you a merge conflict? Because I cannot stop thinking about resolving this.',
    level: 3,
  },
  { text: 'Is your father a backend developer? Because you are the whole API of my dreams.', level: 3 },
  { text: 'If loving you is an infinite loop, do not fix the bug.', level: 3 },
  { text: 'You are so fine my linter has no complaints.', level: 3 },
  { text: 'I would give you root access. That is not a small thing.', level: 3 },
  { text: 'My love for you scales horizontally.', level: 3 },
  { text: 'Are you a variable? Because you are constantly on my mind.', level: 3 },
];

/** Random line at a given tackiness level, avoiding an immediate repeat. */
export function pickRizz(level: 1 | 2 | 3, previous?: string): string {
  const pool = rizzLines.filter((l) => l.level === level).map((l) => l.text);
  return pick(pool, previous);
}

/** Hovering the phone number. */
export const hoverPhone = [
  'one ring, I am picking up',
  'hello? yes, this is Hamzah',
  'ah, you found the number',
  'no I am not busy. never busy.',
  'putting you straight through',
];

/** Hovering the GitHub link. */
export const hoverGithub = [
  'oh you want to see the code',
  'give me a second, opening the editor',
  'it is mostly commented, mostly',
  'green squares, I am proud of them',
  'do not judge the early commits',
];

/** Hovering the LinkedIn link. */
export const hoverLinkedin = [
  'one second, let me look employable',
  'straightening the tie',
  'professional mode: engaged',
  'my corporate posture is loading',
];

/** Small rotating line under your name in the top bar. */
export const hudQuips = [
  'now with 100% more pixels',
  'no frameworks were harmed',
  'built at 2am, obviously',
  'scroll for the good bit',
  'yes, that is my actual face',
  'every sprite drawn by hand',
  'the map is not to scale',
];

/** The fake boot sequence on first load. */
export const bootLines = [
  'BOOTING HAMZAH.EXE',
  'LOADING THE MAP...',
  'MOUNTING /dev/PIXELS',
  'CALIBRATING VIBES',
  'READY',
];

/** Flies out of the laptop while he is coding. Symbols, not sentences. */
export const codeConfetti = [
  '{}',
  '</>',
  '&&',
  '=>',
  ';',
  '404',
  'git',
  '!==',
  'if',
  '()',
  '[]',
  'npm',
  '0x1F',
  'TODO',
  '::',
  '?.',
];

/** Pick a random entry, avoiding an immediate repeat of `previous`. */
export function pick(list: string[], previous?: string): string {
  if (list.length === 0) return '';
  if (list.length === 1) return list[0];
  let next = previous;
  while (next === previous) next = list[Math.floor(Math.random() * list.length)];
  return next as string;
}
