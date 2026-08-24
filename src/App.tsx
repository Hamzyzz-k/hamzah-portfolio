import { useEffect, useRef, useState } from 'react';

import BootScreen from './components/BootScreen';
import CharacterSheet from './components/CharacterSheet';
import Companion from './components/Companion';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Guilds from './components/Guilds';
import Hero from './components/Hero';
import History from './components/History';
import Hobbies from './components/Hobbies';
import HudNav from './components/HudNav';
import ProjectMap from './components/ProjectMap';
import QuestLog from './components/QuestLog';
import SoftSkills from './components/SoftSkills';
import TechSkills from './components/TechSkills';
import { companion } from './companion/store';
import { useReveal } from './hooks/useReveal';
import { useSound } from './hooks/useSound';
import { useTheme } from './hooks/useTheme';

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export default function App() {
  const { theme, toggle } = useTheme();
  const { play } = useSound();
  const root = useRef<HTMLDivElement>(null);
  const [booted, setBooted] = useState(false);
  const [party, setParty] = useState(false);

  useReveal(root);

  // He is hidden behind the boot screen and appears once it clears.
  useEffect(() => {
    companion.setHidden(!booted);
  }, [booted]);

  // Konami code: everything goes technicolour for a few seconds.
  useEffect(() => {
    let idx = 0;
    const onKey = (e: KeyboardEvent) => {
      idx = e.key === KONAMI[idx] ? idx + 1 : e.key === KONAMI[0] ? 1 : 0;
      if (idx === KONAMI.length) {
        idx = 0;
        play('open');
        setParty(true);
        window.setTimeout(() => setParty(false), 6000);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [play]);

  return (
    <div ref={root} className={party ? 'is-party' : undefined}>
      <BootScreen onDone={() => setBooted(true)} />
      <HudNav theme={theme} onToggleTheme={toggle} />
      <Companion />

      <main>
        <Hero theme={theme} />
        <CharacterSheet />
        <TechSkills />
        <SoftSkills />
        <History />
        <ProjectMap theme={theme} />
        <QuestLog />
        <Guilds />
        <Hobbies />
        <Contact />
      </main>

      <Footer />
      {party && <div className="party-banner">↑↑↓↓←→←→BA — cheat accepted</div>}
    </div>
  );
}
