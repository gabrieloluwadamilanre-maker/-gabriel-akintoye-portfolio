import { useEffect } from 'react';
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react';
import { About } from './About';
import { Contact } from './Contact';
import { Projects } from './Projects';
import { Skills } from './Skills';

const BELOW_FOLD_IDS = new Set(['about', 'skills', 'projects', 'contact']);

export function BelowFoldSections() {
  useEffect(() => {
    const hashId = window.location.hash.replace(/^#/, '');
    if (!hashId || !BELOW_FOLD_IDS.has(hashId)) return;

    const frameId = requestAnimationFrame(() => {
      const targetEl = document.getElementById(hashId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    });

    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <About />
        <Skills />
        <Projects />
        <Contact />
      </MotionConfig>
    </LazyMotion>
  );
}
