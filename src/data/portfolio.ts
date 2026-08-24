/* ---------------------------------------------------------------------------
   ALL site content lives here.

   This is the single swap-in point: edit the values below and every section
   updates. No component needs to change.
--------------------------------------------------------------------------- */

export interface Project {
  id: string;
  title: string;
  /** Short label shown on the map pin. */
  sign: string;
  /** District id from ProjectMap/worldData.ts — where the pin drops on the map. */
  location: string;
  year: string;
  stack: string[];
  blurb: string;
  /** What the character says when they stop here. Kept to 2-3 short lines. */
  dialogue: string[];
  /** Omit when there is no public repo — the map hides the Repo button. */
  github?: string;
  links: { label: string; href: string }[];
}

export interface HistoryEntry {
  year: string;
  title: string;
  place: string;
  grade: string;
  detail: string;
  status: 'done' | 'current';
}

export interface Skill {
  name: string;
  level: number; // 0-100
  years: string;
  note: string;
  glyph: string; // 2-3 chars drawn in the inventory slot
}

export interface SoftSkill {
  name: string;
  level: number;
  effect: string;
}

export interface Quest {
  title: string;
  org: string;
  period: string;
  status: 'complete' | 'active';
  detail: string;
  rewards: string[];
}

export interface Hobby {
  name: string;
  glyph: string;
  detail: string;
}

/** A leadership / co-curricular role — the "side quests" section. */
export interface Guild {
  name: string;
  org: string;
  role: string;
  period: string;
  detail: string;
}

/** A certification — the "achievements unlocked" strip. */
export interface Achievement {
  title: string;
  issuer: string;
  year: string;
}

export const profile = {
  name: 'HAMZAH K.',
  handle: '@hamzyzz_',
  title: 'Full-Stack Software Developer',
  klass: 'Full-Stack Dev / Lv.19',
  location: 'Bengaluru, Karnataka',
  tagline: 'Full-stack developer who builds across web, mobile, cloud, and AI — and ships all of it.',
  bio: [
    'BCA student at CHRIST (Deemed to be University), and a full-stack developer comfortable across the whole stack — front-end interfaces, backend APIs, databases, cloud infrastructure, embedded hardware, and the machine learning layered on top of any of it. I move between web, mobile, and systems-level work depending on what a problem actually needs, rather than sticking to one lane.',
    'Outside the code, I have run sports events for my department, coordinated community outreach, and sat on a managing committee juggling PR, props, and branding at once — the same cross-functional instinct shows up whether I am debugging a pipeline or organising a hundred-person event. Currently building out skills in retrieval, evaluation, data engineering, and agentic systems, alongside the full-stack fundamentals everything else sits on.',
  ],
  stats: [
    { label: 'AURA', value: 97, color: 'var(--accent)' },
    { label: 'RIZZ', value: 91, color: 'var(--accent-4)' },
    { label: 'SIGMA', value: 50, color: 'var(--accent-3)' },
    { label: 'DRIP', value: 85, color: 'var(--accent-2)' },
    { label: 'DIET COKE', value: 120, color: 'var(--accent)' },
  ],
  equipped: [
    { slot: 'MAIN HAND', item: 'VS Code' },
    { slot: 'OFF HAND', item: 'Gemini & Groq APIs' },
    { slot: 'ARMOUR', item: 'Type-safe everything' },
    { slot: 'TRINKET', item: 'A genuinely large tie collection' },
  ],
  resumeHref: '/resume.pdf',
};

export const techSkills: Skill[] = [
  { name: 'Python', level: 90, years: '4 yrs', note: 'The default choice for anything ML, backend, or scripted.', glyph: 'PY' },
  { name: 'JavaScript/TS', level: 86, years: '3 yrs', note: 'React front ends, FastAPI clients, the usual glue.', glyph: 'TS' },
  { name: 'React', level: 86, years: '3 yrs', note: 'The front end on VoxMind, Vakeel AI, and most side projects.', glyph: 'RE' },
  { name: 'FastAPI', level: 84, years: '2 yrs', note: 'The backend under VoxMind and Vakeel AI.', glyph: 'FA' },
  { name: 'SQL', level: 82, years: '3 yrs', note: 'Schema design, RLS policies, and the query that finally worked.', glyph: 'SQ' },
  { name: 'PostgreSQL', level: 80, years: '2 yrs', note: 'RLS, triggers, stored functions — FinTrack runs on it.', glyph: 'PG' },
  { name: 'C++', level: 74, years: '3 yrs', note: 'Coursework and the odd performance-sensitive script.', glyph: 'C+' },
  { name: 'Java', level: 72, years: '3 yrs', note: 'Coursework fundamentals, still comes in handy.', glyph: 'JV' },
  { name: 'C#', level: 76, years: '1 yr', note: '.NET 8 and WPF, built for FloodSense AI.', glyph: 'C#' },
  { name: 'HTML/CSS', level: 88, years: '4 yrs', note: 'Every pixel of this site included.', glyph: 'HC' },
  { name: 'Tailwind CSS', level: 78, years: '2 yrs', note: 'Fast to ship, easy to keep consistent.', glyph: 'TW' },
  { name: 'Three.js/WebGL', level: 76, years: '1 yr', note: 'Built a framework-free universe simulator with it.', glyph: '3J' },
  { name: 'Kotlin', level: 62, years: '1 yr', note: "FinTrack's companion Android app.", glyph: 'KT' },
  { name: 'MongoDB', level: 68, years: '1 yr', note: 'Document storage where a rigid schema does not fit.', glyph: 'MG' },
  { name: 'PWA', level: 74, years: '1 yr', note: 'Installable, offline-capable — the shape FinTrack ships in.', glyph: 'PW' },
  { name: 'Git', level: 88, years: '4 yrs', note: 'Every project on the map lives in a repo.', glyph: 'GT' },
  { name: 'RAG', level: 80, years: '1 yr', note: "Hybrid retrieval underneath Vakeel AI's citation engine.", glyph: 'RG' },
  { name: 'Hybrid Search', level: 78, years: '1 yr', note: 'BM25 plus vector embeddings, reranked.', glyph: 'HS' },
  { name: 'LLM Evaluation', level: 82, years: '1 yr', note: 'Took hallucinated citations from 40% to 0% on a held-out set.', glyph: 'EV' },
  { name: 'ML Dataset Curation', level: 76, years: '1 yr', note: 'QA on robotics training data, 90%+ accuracy across three months.', glyph: 'DS' },
  { name: 'Gemini/Groq/Ollama', level: 84, years: '1 yr', note: 'Ollama-first, Groq-fallback — reliability over any single vendor.', glyph: 'LM' },
  { name: 'scikit-learn', level: 70, years: '1 yr', note: 'Predictive models behind the flood-risk alerts.', glyph: 'SK' },
  { name: 'STT/TTS Pipelines', level: 78, years: '1 yr', note: "Whisper and Google STT power VoxMind's speech layer.", glyph: 'ST' },
  { name: 'AWS', level: 64, years: '1 yr', note: 'DynamoDB, mostly.', glyph: 'AW' },
  { name: 'Azure', level: 58, years: '<1 yr', note: 'Enough to be dangerous.', glyph: 'AZ' },
  { name: 'Firebase', level: 72, years: '1 yr', note: 'Auth, Firestore, Hosting — the fast path to shipped.', glyph: 'FB' },
  { name: 'Supabase', level: 74, years: '1 yr', note: 'Postgres with the boilerplate removed.', glyph: 'SB' },
  { name: 'Docker', level: 70, years: '1 yr', note: 'Reproducible environments, tidy compose files.', glyph: 'DK' },
  { name: 'Vercel', level: 76, years: '2 yrs', note: 'Where most of these front ends actually live.', glyph: 'VC' },
  { name: 'IoT', level: 66, years: '1 yr', note: 'ESP32-CAM smart-home control, wired into VoxMind.', glyph: 'IO' },
];

export const softSkills: SoftSkill[] = [
  { name: 'Team Leadership', level: 92, effect: 'Ran sports events end to end while leading a team of student volunteers.' },
  { name: 'Event Management', level: 90, effect: 'Scheduling, venue booking, registrations — the unglamorous parts, handled.' },
  { name: 'Cross-Functional Collaboration', level: 88, effect: 'Comfortable moving between engineering, PR, and design in the same week.' },
  { name: 'Time Management', level: 85, effect: 'Held four concurrent roles without dropping any of them.' },
  { name: 'Adaptability', level: 90, effect: 'New stack, new domain, same week — voice AI to WPF to legal tech.' },
  { name: 'Social Media Management', level: 78, effect: 'Branding and PR for an events managing committee.' },
];

export const projects: Project[] = [
  {
    id: 'voxmind',
    title: 'VoxMind',
    sign: 'VOXMIND',
    location: 'northgate',
    year: 'Ongoing',
    stack: [
      'Python',
      'FastAPI',
      'React',
      'Gemini API',
      'Groq API',
      'Whisper STT',
      'ESP32-CAM',
      'Distance Sensor',
    ],
    blurb:
      'An assistive smart-glasses system built for blind and visually-impaired users. A distance sensor detects what is nearby, and an onboard camera, microphone and single push-button let the wearer press once, ask what is in front of them, and get back a detailed spoken description of the scene — powered by a full-stack voice pipeline with secure login, multilingual speech, and real-time streaming responses from Gemini and Groq, with an Ollama-first fallback for reliability.',
    dialogue: [
      'Up here in Northgate — a pair of glasses that describes the world out loud, for someone who cannot see it.',
      'One button. Press it, ask what is ahead, and the glasses answer — camera, mic, and a distance sensor doing the looking.',
    ],
    github: 'https://github.com/Hamzyzz-k/Voxmind-dev',
    links: [{ label: 'Live', href: 'https://voxmind-cu.web.app' }],
  },
  {
    id: 'godsview',
    title: "God's View",
    sign: "GOD'S VIEW",
    location: 'oldtown',
    year: '2026',
    stack: ['Three.js', 'WebGL', 'WebXR', 'NASA API', 'ISS API', 'n8n'],
    blurb:
      "A framework-free Three.js simulation of the universe's evolution — Big Bang, through a live-tracked solar system, to a full tour of the observable universe. Real-time NASA and ISS data, an AI scene assistant, and full WebXR support for a headset.",
    dialogue: [
      'Old Town gets loud. This one is the opposite — the whole universe, quiet, from the Big Bang onward.',
      'No engine underneath it. Just Three.js, real NASA and ISS data, and however much math that turned out to need.',
    ],
    github: 'https://github.com/Hamzyzz-k/Gods-View',
    links: [{ label: 'Live', href: 'https://gods-view.vercel.app' }],
  },
  {
    id: 'floodsense',
    title: 'FloodSense AI',
    sign: 'FLOODSENSE',
    location: 'eastmarket',
    year: 'Feb 2026',
    stack: ['C#', '.NET 8', 'WPF', 'ML.NET', 'SQL Server', 'Ollama'],
    blurb:
      'A flood monitoring and alert system that runs ML.NET predictive models against live weather data and fires automated SMS and email alerts to at-risk zones before the water arrives.',
    dialogue: [
      'East Market floods first whenever it rains here. Wish I had built this before I found that out.',
      'It watches the weather and warns the people who need to know, before they need to know it.',
    ],
    // No public repo for this one.
    links: [],
  },
  {
    id: 'fintrack',
    title: 'FinTrack',
    sign: 'FINTRACK',
    location: 'thebasin',
    year: 'Aug 2026',
    stack: ['PWA', 'SQL', 'Row-Level Security', 'Kotlin (Android)'],
    blurb:
      'An installable expense-tracking and shared-savings PWA with row-level-security-enforced data isolation, a PDF statement importer, and SMS auto-tracking through a companion Android app that keeps personal messages off-network.',
    dialogue: [
      'The Basin, out past the crossing — nobody had built anything out here until this one.',
      'Messages never leave the phone. The tracking happens on-device, the way it should.',
    ],
    github: 'https://github.com/Hamzyzz-k/fintrackapp',
    links: [{ label: 'Live', href: 'https://fintrack-cu.vercel.app' }],
  },
  {
    id: 'vakeelai',
    title: 'Vakeel AI',
    sign: 'VAKEEL AI',
    location: 'southworks',
    year: 'Aug 2026',
    stack: ['Python', 'FastAPI', 'React', 'RAG', 'Hybrid Retrieval', 'LLM Evaluation'],
    blurb:
      'A citation-verified legal research assistant for Indian law, built on hybrid retrieval — BM25, vector search, and reranking — with closed-set citation verification, benchmarked against the AILA legal-IR dataset.',
    dialogue: [
      'Southworks, end of the road. Fitting — this one is about making sure the ending of an argument is actually true.',
      'Hallucinated citations went from 40% to zero on the test set. That number took a while to earn.',
    ],
    github: 'https://github.com/Hamzyzz-k/vakeel-ai',
    links: [{ label: 'Live', href: 'https://vakeelai.vercel.app' }],
  },
];

export const quests: Quest[] = [
  {
    title: 'Software Development Intern',
    org: 'Softora',
    period: 'Apr 2025 — Jun 2025',
    status: 'complete',
    detail:
      'Delivered assigned development tasks across the project stack, writing clean and maintainable code to sprint timelines. Debugged and resolved issues in existing modules, improving application stability ahead of release.',
    rewards: ['Full-stack delivery', 'Debugging', 'Sprint discipline'],
  },
  {
    title: 'Data Quality Analyst Intern — Robotics Training Data',
    org: 'Instawork (Part-Time)',
    period: 'Mar 2025 — May 2025',
    status: 'complete',
    detail:
      'Reviewed up to 10 hours of headcam footage daily at 4x playback speed, applying structured QA guidelines to flag procedural errors in human task execution. Held a 90%+ accuracy rate across a three-month engagement.',
    rewards: ['QA at scale', 'Robotics training data', 'Sustained accuracy'],
  },
];

/** Leadership and co-curricular roles — the side quests, run alongside everything else. */
export const guilds: Guild[] = [
  {
    name: 'Sports Coordinator',
    org: 'Dept. of Computer Science, Christ University',
    role: 'Head',
    period: 'Jun 2024 — Jun 2025',
    detail:
      'Planned and executed inter- and intra-departmental sports events end to end — scheduling, venue booking, registrations — leading a team of student volunteers.',
  },
  {
    name: 'Centre for Service Learning',
    org: 'Dept. of Computer Science, Christ University',
    role: 'Coordinator',
    period: 'Jun 2024 — Jun 2025',
    detail:
      'Organised community outreach including NGO visits and peer-teaching sessions, connecting academic learning to real-world impact.',
  },
  {
    name: 'AI Guild',
    org: 'Dept. of Computer Science, Christ University',
    role: 'Core Member',
    period: 'Jun 2025 — Mar 2026',
    detail: 'Participated in AI-focused workshops and collaborative projects within the department.',
  },
  {
    name: 'SDG Cell',
    org: 'Christ University',
    role: 'Member',
    period: '2024 — 2026',
    detail: 'Contributed to SDG-aligned events and initiatives on campus, alongside the other concurrent roles.',
  },
  {
    name: 'Ozark Productions',
    org: 'Managing Committee',
    role: 'PR, Events, Prop Design, Branding',
    period: '2024 — 2026',
    detail: 'Held concurrent roles across PR, event execution, prop design, and branding for academic and cultural events.',
  },
];

/** Certifications — shown as unlocked achievements. */
export const achievements: Achievement[] = [
  { title: 'Artificial Intelligence Ethics Certification', issuer: 'Infosys Springboard', year: '2026' },
  { title: 'AI Fundamentals 2026: Safe AI Skills for Work', issuer: 'Infosys Springboard', year: '2026' },
  { title: 'AWS Academy Cloud Foundations', issuer: 'AWS', year: '2026' },
  { title: 'Mental Health and Well-Being', issuer: 'SWAYAM (NPTEL)', year: '2025' },
];

export const hobbies: Hobby[] = [
  { name: 'Gym', glyph: 'GYM', detail: 'The other kind of debugging — the body kind. Progressive overload, mostly.' },
  { name: 'Video Games', glyph: 'PLY', detail: 'Whatever is worth the hours this month. Occupational hazard, honestly.' },
  { name: 'Cricket', glyph: 'CRK', detail: 'Weekend matches. Batting average not tracked, for good reason.' },
  { name: 'Bike Rides', glyph: 'BKE', detail: 'Long rides with no destination in particular. The best debugging happens here too.' },
  { name: 'Cooking', glyph: 'PAN', detail: 'Still iterating on the recipe. Version control would help.' },
  { name: 'Collecting Ties', glyph: 'TIE', detail: 'A genuinely large collection at this point. Yes, the character sprite is wearing one on purpose.' },
];

export const interests = [
  'RAG & Retrieval',
  'LLM Evaluation',
  'Prompt Engineering',
  'Agentic AI',
  'Data Engineering & Analysis',
  'Software Development',
  'Image Tracking',
];

export const socials = [
  { id: 'github', label: 'GitHub', href: 'https://github.com/Hamzyzz-k', glyph: 'GH' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/hamzah-k-41b91b331/', glyph: 'IN' },
  { id: 'email', label: 'Email', href: 'mailto:khamzah0812@gmail.com', glyph: '@' },
  { id: 'phone', label: 'Phone', href: 'tel:+919148140382', glyph: 'TEL' },
];

/** Shown only after the visitor hovers the phone entry. */
export const phoneDisplay = '+91 91481 40382';

export const history: HistoryEntry[] = [
  {
    year: '2022',
    title: 'SSLC (Class X)',
    place: 'The New Cambridge High School, Bengaluru — Karnataka State Board',
    grade: '77.7%',
    detail: 'Finished school and immediately started building things that had nothing to do with the syllabus.',
    status: 'done',
  },
  {
    year: '2024',
    title: 'Pre-University (PUC)',
    place: "St. Joseph's PU College, Bengaluru — Karnataka State Board",
    grade: '83.3%',
    detail: 'Two years of science, and the stretch where writing code stopped being a hobby and became the plan.',
    status: 'done',
  },
  {
    year: 'Jul 2024 — May 2027',
    title: 'Bachelor of Computer Applications',
    place: 'CHRIST (Deemed to be University), Bengaluru',
    grade: 'CGPA 7.55',
    detail: 'Systems, databases and machine learning on paper. Most of the real learning is on the map above.',
    status: 'current',
  },
];

export const sections = [
  { id: 'hero', label: 'START' },
  { id: 'about', label: 'ABOUT' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'traits', label: 'TRAITS' },
  { id: 'history', label: 'HISTORY' },
  { id: 'projects', label: 'MAP' },
  { id: 'quests', label: 'QUESTS' },
  { id: 'guilds', label: 'GUILDS' },
  { id: 'hobbies', label: 'HOBBIES' },
  { id: 'contact', label: 'CONTACT' },
];
