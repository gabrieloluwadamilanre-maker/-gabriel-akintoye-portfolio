/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense, useEffect, useRef, useState, type RefObject } from 'react';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';

const BELOW_FOLD_TARGETS = new Set(['#about', '#skills', '#projects', '#contact']);

const loadBelowFoldSections = () =>
  import('./components/BelowFoldSections').then((m) => ({
    default: m.BelowFoldSections,
  }));

const BelowFoldSections = lazy(loadBelowFoldSections);

function BelowFoldFallback({ sentinelRef }: { sentinelRef: RefObject<HTMLDivElement | null> }) {
  return (
    <div aria-busy="true">
      <section
        id="about"
        aria-label="About Me"
        className="relative scroll-mt-16 min-h-[680px] border-b border-[#1E293B]/80 bg-[#0E1729]"
      >
        <div
          ref={sentinelRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-[220px] lg:top-[80px] left-0 h-px w-full"
        />
      </section>
      <section
        id="skills"
        aria-label="Skills"
        className="scroll-mt-16 min-h-[890px] border-b border-[#1E293B]/80 bg-[#0B1220]"
      />
      <section
        id="projects"
        aria-label="Projects"
        className="scroll-mt-16 min-h-[1100px] border-b border-[#1E293B]/80 bg-[#0E1729]"
      />
      <section
        id="contact"
        aria-label="Contact"
        className="scroll-mt-16 min-h-[420px] bg-[#0B1220]"
      />
    </div>
  );
}

export default function App() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [shouldLoadBelowFold, setShouldLoadBelowFold] = useState(
    () => typeof window !== 'undefined' && BELOW_FOLD_TARGETS.has(window.location.hash)
  );

  useEffect(() => {
    if (shouldLoadBelowFold) {
      void loadBelowFoldSections();
      return;
    }

    let triggered = false;
    const triggerBelowFoldLoad = () => {
      if (triggered) return;
      triggered = true;
      void loadBelowFoldSections();
      setShouldLoadBelowFold(true);
    };

    const handleHashChange = () => {
      if (BELOW_FOLD_TARGETS.has(window.location.hash)) {
        triggerBelowFoldLoad();
      }
    };

    const handleAnchorIntent = (event: Event) => {
      const target = event.target as Element | null;
      const anchor = target?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      const href = anchor?.getAttribute('href');
      if (href && BELOW_FOLD_TARGETS.has(href)) {
        triggerBelowFoldLoad();
      }
    };

    const handleScroll = () => {
      if (window.scrollY > 16) {
        triggerBelowFoldLoad();
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('click', handleAnchorIntent, { capture: true });
    document.addEventListener('focusin', handleAnchorIntent, { capture: true });
    document.addEventListener('pointerenter', handleAnchorIntent, { capture: true, passive: true });

    let observer: IntersectionObserver | null = null;
    if (sentinelRef.current && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            triggerBelowFoldLoad();
          }
        },
        { rootMargin: '40px 0px' }
      );
      observer.observe(sentinelRef.current);
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleAnchorIntent, { capture: true });
      document.removeEventListener('focusin', handleAnchorIntent, { capture: true });
      document.removeEventListener('pointerenter', handleAnchorIntent, { capture: true });
      observer?.disconnect();
    };
  }, [shouldLoadBelowFold]);

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
        {shouldLoadBelowFold ? (
          <Suspense fallback={<BelowFoldFallback sentinelRef={sentinelRef} />}>
            <BelowFoldSections />
          </Suspense>
        ) : (
          <BelowFoldFallback sentinelRef={sentinelRef} />
        )}
      </main>

      <Footer />
    </div>
  );
}
