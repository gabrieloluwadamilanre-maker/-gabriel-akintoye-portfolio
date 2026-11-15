import { motion } from 'motion/react';
import { PROFILE } from '@/src/data/portfolio';
import { FloatingTypography, type FloatingWordItem } from './FloatingTypography';
import { RevealText } from './RevealText';

const FOCUS_AREAS = [
  {
    index: '01.',
    title: 'Computer Science Foundation',
    description:
      'Studying Computer Science while applying core problem-solving principles directly to practical web applications.',
  },
  {
    index: '02.',
    title: 'User-Focused Interfaces',
    description:
      'Building clean, readable layouts that adapt naturally across mobile phones, tablets, and desktop displays.',
  },
  {
    index: '03.',
    title: 'Continuous Improvement',
    description:
      'Refining front-end craft through hands-on builds, modern tooling, and structured, maintainable code.',
  },
];

const ABOUT_FLOATING_WORDS: FloatingWordItem[] = [
  {
    text: 'DESIGN',
    depth: 32,
    className:
      'top-8 right-[5%] text-4xl sm:text-6xl lg:text-7xl text-[#3B82F6]/[0.06] drop-shadow-[0_0_16px_rgba(59,130,246,0.16)]',
  },
  {
    text: 'BUILD',
    depth: 22,
    reverse: true,
    hideOnMobile: true,
    className:
      'bottom-8 left-[3%] text-5xl lg:text-6xl text-[#60A5FA]/[0.05] blur-[0.4px]',
  },
];

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative overflow-hidden border-b border-[#1E293B]/80 bg-[#0E1729]"
    >
      <FloatingTypography items={ABOUT_FLOATING_WORDS} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Section Title Column */}
          <div className="lg:col-span-4 space-y-3">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4 }}
              className="text-sm font-semibold text-[#3B82F6]"
            >
              About Me
            </motion.p>
            <RevealText
              as="h2"
              id="about-heading"
              text="Building digital solutions with steady curiosity."
              className="font-display text-2xl font-semibold tracking-tight text-[#F8FAFC] sm:text-3xl"
            />
          </div>

          {/* Narrative + Glassmorphic Focus Grid */}
          <div className="lg:col-span-8 space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4 text-base leading-relaxed text-[#E2E8F0] max-w-2xl"
            >
              <p>{PROFILE.aboutSummary}</p>
              <p className="text-[#A1AAB8]">{PROFILE.aboutSecondary}</p>
            </motion.div>

            <div className="grid grid-cols-1 gap-4 border-t border-[#1E3A5F]/50 pt-8 sm:grid-cols-3">
              {FOCUS_AREAS.map((item, idx) => (
                <motion.div
                  key={item.index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{
                    duration: 0.45,
                    delay: idx * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="rounded-xl border border-[#1E3A5F]/50 bg-[#111C30]/75 backdrop-blur-md p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#3B82F6]/60 hover:shadow-[0_12px_30px_rgba(37,99,235,0.16)]"
                >
                  <span className="font-mono text-xs tabular-nums text-[#60A5FA]">
                    {item.index}
                  </span>
                  <h3 className="mt-2 font-display text-base font-semibold text-[#F8FAFC]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#A1AAB8]">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
