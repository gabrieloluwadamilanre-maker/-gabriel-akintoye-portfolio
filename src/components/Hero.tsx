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
        <defs>
          <linearGradient id="laptopLid" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="laptopBase" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
        </defs>

        {/* Ground Shadow Glow */}
        <ellipse cx="210" cy="264" rx="158" ry="16" fill="#3B82F6" fillOpacity="0.18" />

        {/* Display Lid */}
        <rect
          x="74"
          y="24"
          width="272"
          height="172"
          rx="12"
          fill="url(#laptopLid)"
          stroke="#3B82F6"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
        {/* Inner Screen */}
        <rect x="84" y="34" width="252" height="150" rx="6" fill="#070E1A" />
        {/* Editor Top Bar */}
        <rect x="84" y="34" width="252" height="16" rx="4" fill="#0D1729" />
        <circle cx="94" cy="42" r="2.5" fill="#F87171" />
        <circle cx="102" cy="42" r="2.5" fill="#FBBF24" />
        <circle cx="110" cy="42" r="2.5" fill="#34D399" />
        {/* Active Editor Tab */}
        <rect x="136" y="36" width="46" height="14" fill="#070E1A" />
        <rect x="136" y="36" width="46" height="2" fill="#3B82F6" />

        {/* Sidebar Explorer */}
        <rect x="84" y="50" width="48" height="126" fill="#0A1324" />
        <rect x="92" y="60" width="28" height="4" rx="2" fill="#475569" />
        <rect x="92" y="72" width="32" height="6" rx="2" fill="#3B82F6" fillOpacity="0.35" />
        <rect x="92" y="84" width="26" height="4" rx="2" fill="#94A3B8" fillOpacity="0.55" />
        <rect x="92" y="94" width="30" height="4" rx="2" fill="#38BDF8" fillOpacity="0.55" />

        {/* Syntax-Highlighted Code Lines */}
        <rect x="142" y="60" width="110" height="5" rx="2" fill="#64748B" fillOpacity="0.7" />
        <rect x="142" y="72" width="42" height="5" rx="2" fill="#38BDF8" />
        <rect x="188" y="72" width="76" height="5" rx="2" fill="#34D399" />
        <rect x="142" y="88" width="54" height="5" rx="2" fill="#C084FC" />
        <rect x="200" y="88" width="68" height="5" rx="2" fill="#60A5FA" />
        <rect x="142" y="102" width="44" height="5" rx="2" fill="#C084FC" />
        <rect x="190" y="102" width="94" height="5" rx="2" fill="#FBBF24" />
        <rect x="152" y="116" width="84" height="5" rx="2" fill="#93C5FD" />
        <rect x="152" y="130" width="126" height="6" rx="2" fill="#3B82F6" fillOpacity="0.35" />
        <rect x="154" y="131" width="64" height="4" rx="2" fill="#38BDF8" />
        <rect x="222" y="131" width="48" height="4" rx="2" fill="#34D399" />
        <rect x="142" y="146" width="38" height="5" rx="2" fill="#CBD5E1" fillOpacity="0.7" />

        {/* Bottom Status Bar */}
        <rect x="84" y="175" width="252" height="9" rx="2" fill="#1D4ED8" />

        {/* Lower Metallic Chassis & Keyboard Deck */}
        <path
          d="M72 198 H348 L384 248 C387 252 384 256 378 256 H42 C36 256 33 252 36 248 Z"
          fill="url(#laptopBase)"
          stroke="#475569"
          strokeOpacity="0.6"
          strokeWidth="1.2"
        />
        {/* Keyboard Backlight Area */}
        <path d="M98 205 H322 L338 228 H82 Z" fill="#0F172A" stroke="#3B82F6" strokeOpacity="0.35" />
        {/* Trackpad */}
        <path d="M174 234 H246 L252 248 H168 Z" fill="#162238" stroke="#334155" />
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
