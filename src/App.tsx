/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense, useEffect } from 'react';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';

const loadBelowFoldSections = () =>
  import('./components/BelowFoldSections').then((m) => ({
    default: m.BelowFoldSections,
  }));

const BelowFoldSections = lazy(loadBelowFoldSections);

function BelowFoldFallback() {
  return (
    <div aria-busy="true">
      <section
        id="about"
        aria-label="About Me"
        className="min-h-[480px] border-b border-[#1E293B]/80 bg-[#0E1729]"
      />
      <section
        id="skills"
        aria-label="Skills"
        className="min-h-[560px] border-b border-[#1E293B]/80 bg-[#0B1220]"
      />
      <section
        id="projects"
        aria-label="Projects"
        className="min-h-[640px] border-b border-[#1E293B]/80 bg-[#0E1729]"
      />
      <section
        id="contact"
        aria-label="Contact"
        className="min-h-[380px] bg-[#0B1220]"
      />
    </div>
  );
}

export default function App() {
  useEffect(() => {
    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    const prefetch = () => {
      if (!cancelled) {
        void loadBelowFoldSections();
      }
    };

    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    const rafId = requestAnimationFrame(() => {
      if (cancelled) return;
      if (win.requestIdleCallback) {
        idleId = win.requestIdleCallback(prefetch, { timeout: 200 });
      } else {
        timeoutId = window.setTimeout(prefetch, 80);
      }
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      if (idleId !== undefined) {
        win.cancelIdleCallback?.(idleId);
      }
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#F8FAFC] flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[#2563EB] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#F8FAFC] focus:shadow-[0_0_20px_rgba(59,130,246,0.45)]"
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content" className="flex-1">
        <Hero />
        <Suspense fallback={<BelowFoldFallback />}>
          <BelowFoldSections />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
