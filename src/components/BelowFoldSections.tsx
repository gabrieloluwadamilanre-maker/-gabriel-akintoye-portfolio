import { LazyMotion, MotionConfig, domAnimation } from 'motion/react';
import { About } from './About';
import { Contact } from './Contact';
import { Projects } from './Projects';
import { Skills } from './Skills';

export function BelowFoldSections() {
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
