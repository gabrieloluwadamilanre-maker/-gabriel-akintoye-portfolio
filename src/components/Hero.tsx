import { lazy, Suspense } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { PROFILE } from '@/src/data/portfolio';
import { FloatingTypography, type FloatingWordItem } from './FloatingTypography';
import { RevealText } from './RevealText';

const Laptop3D = lazy(() =>
  import('./Laptop3D').then((m) => ({ default: m.Laptop3D }))
);

const HERO_FLOATING_WORDS: FloatingWordItem[] = [
  {
    text: 'CODE',
    depth: 36,
    className:
      'top-8 right-[6%] text-5xl sm:text-7xl lg:text-8xl text-[#3B82F6]/[0.08] drop-shadow-[0_0_18px_rgba(59,130,246,0.2)]',
  },
  {
    text: 'CREATE',
    depth: 24,
    reverse: true,
    hideOnMobile: true,
    className:
      'bottom-10 left-[4%] text-5xl lg:text-7xl text-[#60A5FA]/[0.06] drop-shadow-[0_0_16px_rgba(96,165,250,0.18)]',
  },
  {
    text: '{ }',
    depth: 42,
    className:
      'top-16 left-[42%] text-4xl sm:text-5xl font-mono text-[#3B82F6]/[0.09] blur-[0.4px]',
  },
];

export function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-[#1E293B]/80 bg-gradient-to-b from-[#0B1220] via-[#0D1628] to-[#0B1220]"
    >
      {/* Subtle Ambient Blue Radial Backlights */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#3B82F6]/12 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-0 h-[420px] w-[420px] rounded-full bg-[#2563EB]/12 blur-3xl"
      />

      {/* Ambient Floating Typography */}
      <FloatingTypography items={HERO_FLOATING_WORDS} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Name, Title, Intro & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center gap-6 lg:col-span-6"
          >
            <div className="space-y-4">
              <p className="text-sm font-semibold tracking-wide text-[#60A5FA]">
                {PROFILE.title}
              </p>

              <RevealText
                as="h1"
                id="hero-heading"
                text={PROFILE.name}
                immediate
                className="font-display text-4xl font-bold tracking-tight text-[#F8FAFC] sm:text-5xl lg:text-6xl leading-[1.06]"
              />

              <p className="max-w-xl text-base leading-relaxed text-[#A1AAB8] sm:text-lg">
                {PROFILE.heroIntro}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#projects"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-6 py-3 text-sm font-semibold text-[#F8FAFC] shadow-[0_0_24px_rgba(59,130,246,0.4)] hover:bg-[#2563EB] hover:shadow-[0_0_32px_rgba(59,130,246,0.6)] transition-all whitespace-nowrap shrink-0"
              >
                <span>View My Projects</span>
                <ArrowDownRight className="w-4 h-4" aria-hidden="true" />
              </a>

              <a
                href="#contact"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-[#1E3A5F]/80 bg-[#111C30]/80 backdrop-blur-md px-6 py-3 text-sm font-medium text-[#F8FAFC] hover:border-[#3B82F6]/80 hover:bg-[#162540] transition-all whitespace-nowrap shrink-0"
              >
                <span>Contact Me</span>
                <ArrowUpRight className="w-4 h-4 text-[#60A5FA]" aria-hidden="true" />
              </a>
            </div>
          </motion.div>

          {/* Right Column: Interactive 3D Programming Laptop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex items-center justify-center"
          >
            <div className="w-full h-[300px] sm:h-[380px] lg:h-[470px]">
              <Suspense
                fallback={
                  <div
                    aria-label="Loading 3D laptop workspace"
                    className="flex h-full w-full items-center justify-center rounded-2xl border border-[#1E3A5F]/40 bg-[#111C30]/40"
                  >
                    <div className="h-24 w-24 rounded-full bg-[#3B82F6]/15 blur-2xl" />
                  </div>
                }
              >
                <Laptop3D />
              </Suspense>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
