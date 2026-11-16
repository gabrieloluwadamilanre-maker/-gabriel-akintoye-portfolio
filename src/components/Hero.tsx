import { lazy, Suspense, useEffect, useState } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { PROFILE } from '@/src/data/portfolio';
import { FloatingTypography, type FloatingWordItem } from './FloatingTypography';

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

function LaptopLoadingFrame() {
  return (
    <div
      aria-label="Loading 3D laptop workspace"
      className="relative flex h-full w-full items-center justify-center rounded-2xl border border-[#1E3A5F]/40 bg-[#111C30]/35"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 rounded-full bg-radial from-[#3B82F6]/20 via-[#2563EB]/10 to-transparent blur-3xl"
      />
      <div className="relative z-10 h-28 w-44 rounded-xl border border-[#3B82F6]/25 bg-[#070E1A]/80 shadow-[0_0_40px_rgba(59,130,246,0.16)]" />
    </div>
  );
}

export function Hero() {
  const [shouldLoad3D, setShouldLoad3D] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    const rafId = requestAnimationFrame(() => {
      if (cancelled) return;
      const win = window as Window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
        cancelIdleCallback?: (id: number) => void;
      };

      if (win.requestIdleCallback) {
        idleId = win.requestIdleCallback(
          () => {
            if (!cancelled) setShouldLoad3D(true);
          },
          { timeout: 250 }
        );
      } else {
        timeoutId = window.setTimeout(() => {
          if (!cancelled) setShouldLoad3D(true);
        }, 120);
      }
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      if (idleId !== undefined) {
        (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(idleId);
      }
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

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
          {/* Left Column: Immediately visible for optimal LCP */}
          <div className="flex flex-col justify-center gap-6 lg:col-span-6">
            <div className="space-y-4">
              <p className="text-sm font-semibold tracking-wide text-[#60A5FA]">
                {PROFILE.title}
              </p>

              <h1
                id="hero-heading"
                className="font-display text-4xl font-bold tracking-tight text-[#F8FAFC] sm:text-5xl lg:text-6xl leading-[1.06]"
              >
                {PROFILE.name}
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-[#A1AAB8] sm:text-lg">
                {PROFILE.heroIntro}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#projects"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-6 py-3 text-sm font-semibold text-[#F8FAFC] shadow-[0_0_24px_rgba(59,130,246,0.4)] hover:bg-[#1D4ED8] hover:shadow-[0_0_32px_rgba(59,130,246,0.6)] transition-all whitespace-nowrap shrink-0"
              >
                <span>View My Projects</span>
                <ArrowDownRight className="w-4 h-4" aria-hidden="true" />
              </a>

              <a
                href="#contact"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-[#1E3A5F]/80 bg-[#111C30]/95 md:bg-[#111C30]/80 md:backdrop-blur-md px-6 py-3 text-sm font-medium text-[#F8FAFC] hover:border-[#3B82F6]/80 hover:bg-[#162540] transition-all whitespace-nowrap shrink-0"
              >
                <span>Contact Me</span>
                <ArrowUpRight className="w-4 h-4 text-[#60A5FA]" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Right Column: Deferred Interactive 3D Programming Laptop */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="w-full h-[300px] sm:h-[380px] lg:h-[470px]">
              {shouldLoad3D ? (
                <Suspense fallback={<LaptopLoadingFrame />}>
                  <Laptop3D />
                </Suspense>
              ) : (
                <LaptopLoadingFrame />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
