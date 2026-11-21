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
      role="img"
      aria-label="Interactive 3D laptop workspace loading"
      className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-[#1E3A5F]/40 bg-[#0B1426]/65 p-4"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-6 rounded-full bg-radial from-[#3B82F6]/25 via-[#2563EB]/10 to-transparent blur-3xl"
      />
      <svg
        viewBox="0 0 420 290"
        aria-hidden="true"
        className="relative z-10 h-auto w-full max-w-[360px] drop-shadow-[0_22px_38px_rgba(37,99,235,0.22)]"
      >
        {/* Ground Shadow Glow */}
        <ellipse cx="210" cy="264" rx="158" ry="16" fill="#3B82F6" fillOpacity="0.18" />

        {/* Display Lid & Inner Screen */}
        <rect
          x="74"
          y="24"
          width="272"
          height="172"
          rx="12"
          fill="#141E30"
          stroke="#3B82F6"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
        <rect x="84" y="34" width="252" height="150" rx="6" fill="#070E1A" />

        {/* Editor Chrome: Top Bar & Sidebar Explorer */}
        <path
          d="M88 34 H332 C334 34 336 36 336 38 V50 H84 V38 C84 36 86 34 88 34 Z M84 50 H132 V176 H84 Z"
          fill="#0B1528"
        />

        {/* Window Dots & Syntax Accents */}
        <path
          d="M91 42 a2.5 2.5 0 1 0 5 0 a2.5 2.5 0 1 0 -5 0 M99 42 a2.5 2.5 0 1 0 5 0 a2.5 2.5 0 1 0 -5 0 M107 42 a2.5 2.5 0 1 0 5 0 a2.5 2.5 0 1 0 -5 0"
          fill="#64748B"
        />
        <path
          d="M136 36 H182 V38 H136 Z M92 72 H124 V78 H92 Z M142 72 H184 V77 H142 Z M200 88 H268 V93 H200 Z M152 116 H236 V121 H152 Z M154 131 H218 V135 H154 Z M84 175 H336 V184 H84 Z"
          fill="#2563EB"
          fillOpacity="0.85"
        />
        <path
          d="M188 72 H264 V77 H188 Z M142 88 H196 V93 H142 Z M190 102 H284 V107 H190 Z M222 131 H270 V135 H222 Z M142 146 H180 V151 H142 Z"
          fill="#38BDF8"
          fillOpacity="0.75"
        />

        {/* Lower Metallic Chassis, Keyboard Deck & Trackpad */}
        <path
          d="M72 198 H348 L384 248 C387 252 384 256 378 256 H42 C36 256 33 252 36 248 Z"
          fill="#233044"
          stroke="#475569"
          strokeOpacity="0.6"
          strokeWidth="1.2"
        />
        <path
          d="M98 205 H322 L338 228 H82 Z M174 234 H246 L252 248 H168 Z"
          fill="#0F172A"
          stroke="#3B82F6"
          strokeOpacity="0.3"
        />
      </svg>
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
      className="relative scroll-mt-16 overflow-hidden border-b border-[#1E293B]/80 bg-gradient-to-b from-[#0B1220] via-[#0D1628] to-[#0B1220]"
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
