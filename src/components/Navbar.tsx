import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS, PROFILE } from '@/src/data/portfolio';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('#home');
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track currently visible section (also re-attaches when lazy sections mount)
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.href.replace('#', ''));
    const observed = new Set<Element>();

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.id) {
          setActiveSection(`#${entry.target.id}`);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: '-38% 0px -52% 0px',
      threshold: 0,
    });

    const scanSections = () => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el && !observed.has(el)) {
          observed.add(el);
          observer.observe(el);
        }
      });
    };

    scanSections();

    const mainEl = document.getElementById('main-content');
    const mutationObserver = mainEl
      ? new MutationObserver(() => scanSections())
      : null;
    mutationObserver?.observe(mainEl!, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver?.disconnect();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        toggleButtonRef.current?.focus();
      }
    };
    if (mobileMenuOpen) {
      window.addEventListener('keydown', onKeyDown);
    }
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  const handleNavClick = (href: string) => {
    setActiveSection(href);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B1220]/95 md:bg-[#0B1220]/85 md:backdrop-blur-md border-b border-[#1E3A5F]/50 shadow-[0_8px_30px_rgba(2,6,23,0.45)]'
          : 'bg-[#0B1220]/90 md:bg-[#0B1220]/65 md:backdrop-blur-sm border-b border-[#1E293B]/60'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#home"
          onClick={() => handleNavClick('#home')}
          className="font-display text-lg font-semibold tracking-tight text-[#F8FAFC] hover:text-[#60A5FA] transition-colors whitespace-nowrap shrink-0"
        >
          {PROFILE.name}
        </a>

        {/* Zone 2: Concise single-line nav links with active indicator */}
        <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => handleNavClick(link.href)}
                className={`relative py-1.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-[#F8FAFC]'
                    : 'text-[#A1AAB8] hover:text-[#F8FAFC]'
                }`}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 -bottom-0.5 h-0.5 origin-center rounded-full bg-[#3B82F6] shadow-[0_0_10px_rgba(59,130,246,0.85)] transition-transform duration-200 ease-out ${
                    isActive ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action (desktop) + mobile menu toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#contact"
            onClick={() => handleNavClick('#contact')}
            className="hidden md:inline-flex items-center justify-center min-h-[40px] rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-[#F8FAFC] shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:bg-[#1D4ED8] hover:shadow-[0_0_26px_rgba(59,130,246,0.55)] transition-all whitespace-nowrap shrink-0"
          >
            Contact Me
          </a>

          <button
            ref={toggleButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg border border-[#1E3A5F]/60 bg-[#111C30]/95 text-[#F8FAFC] hover:border-[#3B82F6]/70 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Conditionally mounted mobile navigation panel preserves aria-controls target while avoiding hidden DOM nodes */}
      <div
        id="mobile-navigation"
        hidden={!mobileMenuOpen}
        className="md:hidden border-t border-[#1E3A5F]/50 bg-[#0B1220]/98"
      >
        {mobileMenuOpen && (
          <nav aria-label="Mobile Navigation" className="px-4 py-4 sm:px-6">
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.href;
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={() => handleNavClick(link.href)}
                      className={`flex min-h-[44px] items-center justify-between rounded-lg px-3 py-2 text-base font-medium transition-colors ${
                        isActive
                          ? 'bg-[#111C30] text-[#F8FAFC] border border-[#3B82F6]/40'
                          : 'text-[#A1AAB8] hover:bg-[#111C30]/60 hover:text-[#F8FAFC]'
                      }`}
                    >
                      <span>{link.label}</span>
                      {isActive && (
                        <span className="text-xs font-mono text-[#60A5FA]">Active</span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
            <div className="mt-3 pt-3 border-t border-[#1E293B]">
              <a
                href="#contact"
                onClick={() => handleNavClick('#contact')}
                className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-[#F8FAFC] shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:bg-[#1D4ED8] transition-colors"
              >
                Contact Me
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
